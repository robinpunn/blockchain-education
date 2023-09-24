## Gate Keeper One
Make it past the gatekeeper and register as an entrant to pass this level.

##### Things that might help
Remember what you've learned from the Telephone and Token levels.
You can learn more about the special function gasleft(), in Solidity's documentation (see [here](https://docs.soliditylang.org/en/v0.8.3/units-and-global-variables.html) and [here](https://docs.soliditylang.org/en/v0.8.3/control-structures.html#external-function-calls)).

#### Understanding the contract
1. State Variables
```js
address public entrant;
```
- The contract has one state variable ``entrant``
- It is a public variable that is an address type

2. Modifiers
This contract has three modifiers
```js
modifier gateOne() {
    require(msg.sender != tx.origin);
    _;
}
```
- The first modifier, ``gateOne()`` requires that ``msg.sender`` is not ``tx.origin``... whichever account is interacting with this contract, can't be the account that initiated the original transaction
- ``_;`` inidicates that the logic of the function the modifier is applied to will execute if the require condition is met


```js
modifier gateTwo() {
    require(gasleft() % 8191 == 0);
    _;
}
```
- The second modifier, ``gateTwo()`` requires that the [gas left](https://docs.soliditylang.org/en/v0.8.21/units-and-global-variables.html#block-and-transaction-properties) in the transaction is evenly divisble by 8191

```js
modifier gateThree(bytes8 _gateKey) {
      require(uint32(uint64(_gateKey)) == uint16(uint64(_gateKey)), "GatekeeperOne: invalid gateThree part one");
      require(uint32(uint64(_gateKey)) != uint64(_gateKey), "GatekeeperOne: invalid gateThree part two");
      require(uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)), "GatekeeperOne: invalid gateThree part three");
    _;
}
```
- The third modifier, ``gateThree()`` has one parameter, a bytes8 type
- It has three require statements making comparisons related to various bit representations of the ``_gateKey`` bytes8 paramter.
- The first require check converts the bytes8 ``_gateKey`` into a uint64 and then checks if the uint32 and uin16 of the conversion are equivalent
- The second require check converts the bytes8 ``_gateKey`` into a uint64 and then checks if the uint32 conversion is not equivalent to the uint64 conversion
- The third require check converts the ``_gateKey`` into a uint64 and then converts it to a uint32.  It converts the ``tx.origin`` address to a uint160 and then a uint16.  It checks if both of these values are equivalent.
- If all the require conditions are met, then the function this modifier was applied to executes is logic as indicated by ``_;``

3. Constructor
This contruct doesn't have a constructor

4. Functions
This contract has one function, ``enter``
```js
function enter(bytes8 _gateKey) public gateOne gateTwo gateThree(_gateKey) returns (bool) {
    entrant = tx.origin;
    return true;
}
```
- ``enter`` takes one argument, ``gateKey`` that is of types bytes8
- The function has the three previously mentioned modifiers applied to it... the third modifier, ``gateThree`` takes the ``_gatekey`` parameter passed into the function as an argument
- The funcion returns a boolean
- If all the modifier checks are met, ``entrant`` is assigned ``tx.origin``

#### Solving
Solving this challenge involves understanding data type conversions and "bitmasking".

We need to understand what the data looks like when it is converted between uint16, uint32, and uint64.

We also need to know how to manipulate the data so it passes the require checks.

This line, ``require(uint32(uint64(_gateKey)) == uint16(uint160(tx.origin)), "GatekeeperOne: invalid gateThree part three");``, dictates that our ``_gateKey`` should involve ``tx.origin``, which will be our address.

First, we need to create an attack contract. This will meet the requirement of ``require(msg.sender != tx.origin);``. Our address will initiate the transaction, ``tx.origin``, but the ``msg.sender`` will be the attack contract

This [write up](https://blog.dixitaditya.com/ethernaut-level-13-gatekeeper-one) by Aditya Dixit explains the logic behind data type conversions. Converting from bigger to smaller data types leads to a loss of data while converting from smaller to bigger leads to packing with zeros. To mimic this data loss and packing, we can use ["Bit masking"](https://www.geeksforgeeks.org/what-is-bitmasking/). Our ``_gatekey`` will look like: ``bytes8 _gateKey = bytes8(uint64(uint160(tx.origin))) & 0xFFFFFFFF0000FFFF;``.

We also have to account for the gas requirement in the ``gateTwo`` modifier. Using the call method to initiate the ``enter`` function, we use a loop to try various gas amounts to satisfy ``gateTwo``
```js
for (uint256 i = 0; i < 300; i++) {
    (bool success, ) = _contract.call{gas: i + (8191 * 3)}(abi.encodeWithSignature("enter(bytes8)", _gateKey));
    if (success) {
        break;
    }
}
```
After running the ``exploit`` function from the attack contract, ``await contract.entrant()`` should return our wallet address allowing us to complete the challenge

