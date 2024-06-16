// SPDX-License-Identifier: GPL-2.0
pragma solidity 0.8.20;

import "@openzeppelin@4.8.3/contracts/utils/Multicall.sol";
import "@openzeppelin@4.8.3/contracts/metatx/ERC2771Context.sol";
import "@openzeppelin@4.8.3/contracts/security/ReentrancyGuard.sol";

interface IToken {
   function transfer(address, uint256) external returns (bool);
   function approve(address, uint256) external;
   function balanceOf(address) external view returns (uint256);
}

interface ISwapper {
   function swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin) external;
}

interface IStrategy {
   function want() external view returns (address);
   function reward() external view returns (address);
}

contract Controller is Multicall, ERC2771Context {
   address immutable OWNER;
   mapping(address => bool) isStrategy;
   mapping(address => bool) isDivested;
   mapping(address => mapping(address => bool)) allowedSwap;
   mapping(address => uint256) lastSafeBalanceOfWant;

   constructor(address owner, address trustedForwarder_) ERC2771Context(trustedForwarder_) public {
       OWNER = owner;
   }

   modifier onlyOwner() {
       require(_msgSender() == OWNER, "onlyOwner");
       _;
   }

   function registerStrategy(address strategy) external onlyOwner returns (uint256) {
       address want = IStrategy(strategy).want();
       address reward = IStrategy(strategy).reward();
       require(!allowedSwap[reward][want], "Cannot add same swap route");
       allowedSwap[reward][want] = true;
       isStrategy[strategy] = true;
   }

   /** Multicallable Operations */
   function divest(address strategy, uint256 amt, uint256 minOut) external onlyOwner returns (uint256) {
       require(isStrategy[strategy], "Must be registered");
       require(!isDivested[strategy], "Must be Invested!");
       isDivested[strategy] = true;
       bool healthCheck = Strategy(strategy).shouldDivest();
       require(healthCheck, "Must be in emergency");
       Strategy(strategy).divest(amt, minOut);
       lastSafeBalanceOfWant[strategy] = IToken(Strategy(strategy).want()).balanceOf(strategy);
   }

   function invest(address strategy, uint256 minOut) external onlyOwner returns (uint256) {
       require(isDivested[strategy]);
       require(isStrategy[strategy], "Must be registered");
       IToken token = IToken(address(IStrategy(strategy).want()));
       uint256 amt = token.balanceOf(address(this));
       require(amt >= lastSafeBalanceOfWant[strategy]); // Ensure we didn't lose value on divest
       token.transfer(strategy, amt);
       Strategy(strategy).invest(amt, minOut);
       isDivested[strategy] = false;
   }

   function harvestSwap(ISwapper swapper, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOutMin, address strategy)
       external
       onlyOwner
       returns (uint256)
   {
       require(allowedSwap[tokenIn][tokenOut], "Must be allowed");
       IToken reward = IToken(address(IStrategy(strategy).reward()));
       IToken want = IToken(address(IStrategy(strategy).want()));
       require(address(reward) == tokenIn);
       require(address(want) == tokenOut);
       IToken(address(tokenIn)).approve(address(swapper), 0);
       IToken(address(tokenIn)).approve(address(swapper), amountIn);
       swapper.swap(tokenIn, tokenOut, amountIn, amountOutMin);
       want.transfer(strategy, want.balanceOf(address(this)));       
   }
}

interface ICurvePool {

   // Add with WETH
   function add_liquidity(uint256[] memory amounts, uint256 min_mint_amount) external;

   function remove_liquidity(uint256 _amount, uint256[] memory _min_amounts) external;

   function remove_liquidity_one_coin(uint256 token_amount, uint256 i, uint256 min_amount) external;

   function exchange(uint256 i, uint256 j, uint256 dx, uint256 min_dy, bool useETh) external;

   function balances(uint256) external view returns (uint256);

   function D() external returns (uint256);

   function virtual_price() external returns (uint256);

   function get_virtual_price() external returns (uint256);
  
   function totalSupply() external view returns (uint256);
}

interface IGauge {   
   function balanceOf(address) external view returns (uint256);
   function deposit(uint256) external;
   function withdraw(uint256) external;
   function claim_rewards() external;
}

contract Strategy is ReentrancyGuard {
   address public immutable CONTROLLER;
   address public immutable want;
   address public immutable reward;

   uint256 constant PRECISION = 1e18; // 50%
   uint256 constant IDLE_AMOUNT = 5; // 5%
   uint256 constant IDLE_PRECISION = 100; // 5%
  
   // https://arbiscan.io/address/0x82aF49447D8a07e3bd95BD0d56f35241523fBab1
   uint256 constant WETH_INDEX = 2;
   // https://arbiscan.io/address/0x960ea3e3C7FB317332d990873d354E18d7645590

   ICurvePool pool = ICurvePool(0x960ea3e3C7FB317332d990873d354E18d7645590);
   IGauge gauge = IGauge(0x555766f3da968ecBefa690Ffd49A2Ac02f47aa5f);

   constructor(address controller, address _want, address _reward) public {
       CONTROLLER = controller;
       want = _want;
       reward = _reward;
       IToken(_want).approve(address(pool), type(uint256).max);
       IToken(address(pool)).approve(address(gauge), type(uint256).max);
   }

   modifier onlyController() {
       require(msg.sender == CONTROLLER);
       _;
   }

   function idleBalance() public view returns (uint256) {
       return IToken(want).balanceOf(address(this));
   }

   function balanceInPool() public view returns (uint256) {
       return IToken(address(gauge)).balanceOf(address(this));
   }

   function balanceOfRewards() public view returns (uint256) {
       return IToken(reward).balanceOf(address(this));
   }

   // Get Total Value we would have if we withdrew WETH
   function investedBalance() external view returns (uint256) {
       uint128 bal_1 = uint128(pool.balances(WETH_INDEX));
       uint256 calculatedBalance = bal_1 * PRECISION * balanceInPool() / pool.totalSupply() / PRECISION;
       return calculatedBalance;
   }

   // We should divest when something goes wrong, avoids bricking the pool
   function shouldDivest() external view returns (bool) {
       try this.investedBalance() {
           return false;
       } catch {
           return true; // Divest if something goes wrong
       }
      
       return false;
   }
   
   function invest(uint256 amt, uint256 minMint) external nonReentrant onlyController returns (uint256) {
       uint256 toKeep = idleBalance() * IDLE_AMOUNT / IDLE_PRECISION;
       uint256 toDeposit = idleBalance() - toKeep;
       uint256[] memory amounts = new uint256[](3);
       amounts[WETH_INDEX] = toDeposit;
       uint256 initialBal = balanceInPool();
       pool.add_liquidity(amounts, minMint);
       uint256 afterBal = balanceInPool();
       gauge.deposit(afterBal - initialBal);
   }

   function divest(uint256 amt, uint256 minOut) external nonReentrant onlyController returns (uint256) {
       gauge.withdraw(amt);
       uint256 initialBal = idleBalance();
       pool.remove_liquidity_one_coin(amt, WETH_INDEX, minOut);
       uint256 afterBal = idleBalance();
       IToken(reward).transfer(address(CONTROLLER), afterBal - initialBal);
   }
   
   function harvest() external nonReentrant {
       // Increases
       uint256 prevBalRewards = balanceOfRewards();
       gauge.claim_rewards();
       uint256 afterBalReward = balanceOfRewards();
       IToken(reward).transfer(address(CONTROLLER), afterBalReward - prevBalRewards);
   }
}