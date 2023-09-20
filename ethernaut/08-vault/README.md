## Vault
Unlock the vault to pass the level!

##### Things that might help
???

#### Understanding the contract
1. State Variables
- this contract has two variables
```js
bool public locked;
bytes32 private password;
```
- ``locked`` is a bool type set to public
- ``password`` is a bytes32 type set to private

2. Constructor
```js
constructor(bytes32 _password) {
    locked = true;
    password = _password;
  }
```
- The constructor takes one argument, a bytes32
- The constructor sets ``locked`` to true and assigns the argument of the constructor to ``password``

3. Functions
- There is one function, ``unlock``, which is set to public
```js
 function unlock(bytes32 _password) public {
    if (password == _password) {
      locked = false;
    }
  }
```
- ``unlock`` takes one argument, a bytes32 type
- If the argument passed to the function is the same as the password state variable, then ``locked`` is set to false

#### Solving
Solving this contract involves taking advantage of the fact that the password is stored as a global variable
Even though the variable is set to [private](https://solidity-by-example.org/hacks/accessing-private-data/), the data is still accessible
We can use the web3js method [getStorageAt](https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html?highlight=getStorageAt#getstorageat)
The challenge is further simplified as we know that ``password`` will be in its own [storage slot](https://docs.soliditylang.org/en/v0.8.17/internals/layout_in_storage.html)
Because password will be in its own storage slot, we should simply be able to call:
```js
await web3.eth.getStorageAt("CONTRACT ADDRESS",1)
```
This should give us the password which we can then use with the unlock function
```js
await contract.unlock("PASSWORD FROM PREVIOUS STEP")
```
The contract should now be unlocked, and following command should return false:
```js
await contract.locked()
```
We should now be able to complete this challenge

#### Summary
It's important to remember that marking a variable as private only prevents other contracts from accessing it. State variables marked as private and local variables are still publicly accessible.

To ensure that data is private, it needs to be encrypted before being put onto the blockchain. In this scenario, the decryption key should never be sent on-chain, as it will then be visible to anyone who looks for it. [zk-SNARKs](https://blog.ethereum.org/2016/12/05/zksnarks-in-a-nutshell/) provide a way to determine whether someone possesses a secret parameter, without ever having to reveal the parameter.