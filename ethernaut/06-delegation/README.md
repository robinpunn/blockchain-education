## Delegation
The goal of this level is for you to claim ownership of the instance you are given.

##### Things that might help
- Look into Solidity's documentation on the delegatecall low level function, how it works, how it can be used to delegate operations to on-chain libraries, and what implications it has on execution scope.
- Fallback methods
- Method ids

#### Understanding the contract
- This challenge has two contracts ``Delegate`` and ``Delegation``
##### Delegate
1. State Variables
- ``Delegate`` has one state variable ``owner`` which is an address set to public
2. Constructor
- The constructor takes an argument that is an address and sets the owner to that address
3. Functions
- There is one function, ``pwn``, which is set to public
- When called, the ``msg.sender`` becomes the owner

##### Delegation
1. State Variables
- ``Delegation`` has two state variables
- ``owner`` is an address set to public
- ``delegate`` is of type ``Delegate`` with a default visibility of internal
2. Constructor
- The constructor takes one argument, an address
- ``delegate`` is set to the address that was given as an argument
- ``msg.sender`` becomes the owner
3. Functions
- There is one fallback function which is external
- This function is used to delegate calls to the ``delegate`` contract sending the ``msg.data`` to that contract which should execute the effects on this contract

#### Solving
A [fallback function](https://solidity-by-example.org/fallback/) is executed either when a function that does not exist is called or when ether is sent to a contract but recieve does not exist or ``msg.data`` is not empty.
[delegatecall](https://solidity-by-example.org/delegatecall/) is a low level function similar to call... when contract A exectutes delegatecall to contract B, contract B's code is executed using contract A's storage
The [method id](https://ethereum.stackexchange.com/questions/118336/how-to-get-methodid-of-a-function-in-a-smart-contract) is the first 4 bytes of the hash of a function name and parameters
Using the information above, we can make a call to the ``Delegate`` contract using the ``Delegation`` contract.
When this call is made, the storage of the ``Delegation`` contract will be used.    - Our goal is to become the owner of the
``Delegation`` contract, so we can use the ``methodID`` of the ``pwn()`` function found in ``Delegate`` and send that as a transaction:
```js
let methodID = web3.utils.sha3("pwn()").substring(0, 10);

web3.eth.sendTransaction({
  from: "YOUR ADDRESS",
  to: "DELEGATION CONTRACT ADDRESS",
  data: methodID
});
```
The ``pwn`` function will be called from the ``Delegate`` contract using the storage of ``Delegation``
If we call ``await contract.owner()``, we should now be the owner

#### Summary
Usage of `delegatecall` is particularly risky and has been used as an attack vector on multiple historic hacks. With it, your contract is practically saying "here, -other contract- or -other library-, do whatever you want with my state". Delegates have complete access to your contract's state. The `delegatecall` function is a powerful feature, but a dangerous one, and must be used with extreme care.

Please refer to the [The Parity Wallet Hack Explained](https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7) article for an accurate explanation of how this idea was used to steal 30M USD.