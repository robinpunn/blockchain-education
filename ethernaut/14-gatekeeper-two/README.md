## Gate Keeper Two
This gatekeeper introduces a few new challenges. Register as an entrant to pass this level.

##### Things that might help
Remember what you've learned from getting past the first gatekeeper - the first gate is the same.
The ``assembly`` keyword in the second gate allows a contract to access functionality that is not native to vanilla Solidity. See [here](http://solidity.readthedocs.io/en/v0.4.23/assembly.html) for more information. The ``extcodesize`` call in this gate will get the size of a contract's code at a given address - you can learn more about how and when this is set in section 7 of the [yellow paper](https://ethereum.github.io/yellowpaper/paper.pdf).
The ``^`` character in the third gate is a bitwise operation (XOR), and is used here to apply another common bitwise operation (see [here](http://solidity.readthedocs.io/en/v0.4.23/miscellaneous.html#cheatsheet)). The Coin Flip level is also a good place to start when approaching this challenge.

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
    uint x;
    assembly { x := extcodesize(caller()) }
    require(x == 0);
    _;
}
```
- The second modifier, ``gateTwo()`` utilizes a uint variable ``x``. It uses [assembly](https://docs.soliditylang.org/en/v0.4.24/assembly.html) to set ``x`` equal to the size of the code in the address making the call to the contract.  The modifier requires that the address calling the contract does not have any code.

```js
modifier gateThree(bytes8 _gateKey) {
    require(uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey) == type(uint64).max);
    _;
}
```
- The third modifier, ``gateThree()`` has one parameter, a bytes8 type
- This modifier involves the bitwise XOR operattion
- A hash taken of the ``msg.sender`` address and an XOR operation is performed with ``uint64(_gateKey)``. The result of this operation is compared with ``type(uint64).max`` and if they are equivalent, then this require check is satisfied


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
This challenge has some similarities to the previous one. Like ``Gatekeeper One``, we have to use a separate smart contract to call the challenge contract. This satisfies ``gateOne``. To satisfy ``gateTwo``, we need to make sure that ``extcodesize``.  This is possible to do with a smart contract if all the logic is in the contructor. To satisfy ``gateThree``, we can look at the require statement, ``uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey)``, and use the contract address to derive an opposite taking advantage of the ``XOR(^)`` operator: ``uint64 gateKey = ~uint64(bytes8(keccak256(abi.encodePacked(this))));``.
Having all the logic contained in the contructor:
```js
contract GatekeeperTwoAttacker {
    IGatekeeperTwo gatekeeper;
    constructor (address _contract) {
        gatekeeper = IGatekeeperTwo(_contract);
        uint64 gateKey = ~uint64(bytes8(keccak256(abi.encodePacked(this))));
        gatekeeper.enter(bytes8(gateKey));
    }
}
```
Running ``await contract.entrant()`` in the browser console should return our address completing the challenge.

