## Token
The goal of this level is for you to hack the basic token contract below.
You are given 20 tokens to start with and you will beat the level if you somehow manage to get your hands on any additional tokens. Preferably a very large amount of tokens.

##### Things that might help
What is an odometer?

#### Understanding the contract
1. State Variables
- This contract has two state variables, a mapping and a uint:
```js
mapping(address => uint) balances;
uint public totalSupply;
```
- The mapping ``balances`` takes an address and associates it with a uint
- The uint ``totalSupply`` is public

2. Constructor
```js
constructor(uint _initialSupply) public {
    balances[msg.sender] = totalSupply = _initialSupply;
}
```
- The constructor takes a uint argument ``_initialSupply``
- The contuctor sets the ``totalSupply`` to ``_intialSupply`` as well as setting the balance of ``msg.sender`` to ``_initialSupply`` in the ``balances`` mapping 

3. Functions
- This contract has two functions, ``transfer`` and ``balanceOf``
```js
function transfer(address _to, uint _value) public returns (bool) {
    require(balances[msg.sender] - _value >= 0);
    balances[msg.sender] -= _value;
    balances[_to] += _value;
    return true;
}
```
- Transfer takes two arguments, an address and a uint, and returns a bool
- The function has a require statement that must be met in order for the function to execute
    - It requires that the balance of the address calling the function must be greater than or equal to 0 when subtracted by the value argument
- If the require check is passed, the balane of ``msg.sender`` in the ``balances`` mapping is subtraced by the ``_value`` argument
- The balance of the ``_to`` address is increased by ``_value`` in the ``balances`` mapping
- Finally, the function returns ``true``

```js
function balanceOf(address _owner) public view returns (uint balance) {
    return balances[_owner];
}
```
- The ``balanceOf`` function takes an address as an argument and returns a uint
- The function checks the balance of the address used as an argument in the ``balances`` mapping and returns its asssociated uint value

#### Solving
Solving this challenge involves exploiting overflow/underflow which is possible because of the version ``pragma solidity ^0.6.0;``
The older compiler versions before ``0.8.x`` don't have the "Checked Arithmetic" feature... older libraries should use "SafeMath" to prevent overflows and underflows
So this line can be exploited: ``require(balances[msg.sender] - _value >= 0);``
    - Using a value greater than ``balances[msg.sender]`` should lead to an underflow instead of a negative value and ``balances[msg.sender] -= _value;`` should create a very large balance
Sending an amount of 21 to any address other than our own should complete the challenge: ``await contract.transfer("0x0000000000000000000000000000000000000000", 21)``

#### Summary
Overflows are very common in solidity and must be checked for with control statements such as:
```
if(a + c > a) {
  a = a + c;
}
```

An easier alternative is to use OpenZeppelin's SafeMath library that automatically checks for overflows in all the mathematical operators. The resulting code looks like this:

```
a = a.add(c);
```
If there is an overflow, the code will revert.