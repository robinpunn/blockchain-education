## Naught Coin
NaughtCoin is an ERC20 token and you're already holding all of them. The catch is that you'll only be able to transfer them after a 10 year lockout period. Can you figure out how to get them out to another address so that you can transfer them freely? Complete this level by getting your token balance to 0.

##### Things that might help
The [ERC20](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) Spec
The [OpenZeppelin](https://github.com/OpenZeppelin/zeppelin-solidity/tree/master/contracts) codebase

#### Understanding the contract
1. Import
``import 'openzeppelin-contracts-08/token/ERC20/ERC20.sol';``
- This Contract imports ``ERC20`` from OpenZeppelin and the contract is ERC20
- ``contract NaughtCoin is ERC20 {...}``

2. State Variables
```js
uint public timeLock = block.timestamp + 10 * 365 days;
uint256 public INITIAL_SUPPLY;
address public player;
```
- The contract has three state variables
- ``timeLock`` is public uint that uses ``block.timestamp`` + 10 and 365 days
- ``INITIAL_SUPPLY`` is a public uint256
- ``player`` is a public address

3. Modifiers
```js
modifier lockTokens() {
    if (msg.sender == player) {
        require(block.timestamp > timeLock);
        _;
    } else {
        _;
    }
}
```
- ``lockTokens`` checks to see if ``msg.sender`` is ``player``
- It requires that the current timestamp is greater than timelock

4. Constructor
```js
constructor(address _player)
  ERC20('NaughtCoin', '0x0') {
    player = _player;
    INITIAL_SUPPLY = 1000000 * (10**uint256(decimals()));
    // _totalSupply = INITIAL_SUPPLY;
    // _balances[player] = INITIAL_SUPPLY;
    _mint(player, INITIAL_SUPPLY);
    emit Transfer(address(0), player, INITIAL_SUPPLY);
}
```
- The contructor takes on argument, an address. It assigns the address to ``player``
- It creates an ERC20 token with an initial value of 1000000
- ``_mint`` sends the initial supply to ``player``

5. Functions
```js
function transfer(address _to, uint256 _value) override public lockTokens returns(bool) {
    super.transfer(_to, _value);
}
```
- The transfer function has the ``lockTokens`` modifier applied
- It takes two arguments, and address and a uint256 values
- It returns a bool
- The functions uses the [super](https://solidity-by-example.org/super/) keyword to inherit the transfer function from the parent ``ERC20`` contract

#### Solving
The challenge involves understanding ERC20 tokens.  We also have access to ``approve`` and ``transferFrom``.  We don't have to use the ``transfer`` function that has the ``lockTokens`` modifier applied to it.
In the console, our firs step is to create a balance of the tokens:
``const balance = await contract.balanceOf(player).then(v=> v.toString())``
Next, we can chose a random address to approve:
``await contract.approve("TARGET ADDRESS", balance)``
Finally, we send the tokens from our address to the address that we approved.
``await contract.transferFrom("YOUR ADDRESS","TARGET ADDRESS",balance)``
Since the challenge was to make sure our balance is 0, this should satisfy the condition.