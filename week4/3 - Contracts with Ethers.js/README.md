## Contracts with ethers.js

---
### Table of Conents
1. [Contracts with Ether.js](#contracts-with-ethersjs-1)
1. [Getter](#getter)
    - [Contracts](#contracts)
    - [Your Goal: Get The Value](#your-goal-get-the-value)
1. [Setter](#setter)
    - [Transactions](#transactions)
    - [Your Goal: Modify Value](#your-goal-modify-value)
1. [Transfer](#transfer)
    - [Multiple Arguments](#multiple-arguments)
    - [Your Goal: Transfer](#your-goal-transfer)
1. [Signer](#signer)
    - [Your Goal: Set Message](#your-goal-set-message)
1. [Deposit](#deposit)
    - [Value Transfer](#value-transfer)
---

### Contracts with Ethers.js
- In this lesson, we will be interacting with smart contracts from ethers.js! 
- It's going to be a fun lesson, combining your Solidity knowledge with your JavaScript prowess!
- Since this lesson will include multiple languages, we will include a filename at the top of each code block to indicate the language.
- For example, this Solidity contract:
    ```solidity
    // Hero.sol
    contract Hero {
        uint attackPower = 9001;

        function getAttackPower() external view returns(uint) {
            return attackPower;
        }
    }
    ```
- Is called by this JavaScript file:
    ```js
    // attackPower.sol
    async function getAttackPower(heroContract) {
        const attackPower = await heroContract.getAttackPower();
        console.log(attackPower); // 9001
    }
    ```

### Getter
#### Contracts
- In ethers.js, the [Contract](https://docs.ethers.io/v5/api/contract/contract/) provides an easy way to communicate with our Solidity contracts!
- To create a Contract instance, we pass an ABI which is used to understand the contract methods. 
    - The construction of the instance will dynamically add these methods to the instance object itself.
- All we need to do is invoke these dynamic methods.
- Let's consider the following contract:
    ```solidity
    // Example.sol
    contract Example {
        function getNumber() external pure returns(uint) {
            return 3;
        }
    }
    ```
- We can take this Solidity contract, compile it and create an ethers.js contract instance with the bytecode and abi.
- Then we can deploy the contract and interact with it from JavaScript:
    ```js
    // getNumber.js
    async function getNumber(contract) {
        const number = await contract.getNumber();
        console.log(number); // 3
    }
    ```
    -  Here, ``contract`` is an ethers.js contract instance that has dynamically created the ``getNumber`` function based on the ABI of the Example contract.
- We can invoke this ``getNumber`` function which returns a promise that resolves with the value we were looking for. Nice and easy!

#### Your Goal: Get The Value
- In the ``contract.sol`` file there is a public state variable called ``value``.
1. Your goal is to complete the function in ``index.js`` to retrieve this ``value``.
1. This function can either return the promise from invoking the method or you can make the ``getValue`` function ``async`` and return the value.
> Returning a promise that resolves with a value or returning a value in an async function result in essentially the same functionality, afterall!

---
**SOLUTION**
```solidity
// contract.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

contract Contract {
	uint public value;

	constructor(uint _value) {
		value = _value;
	}
}
```
```js
// index.js
/**
 * Find the `value` stored in the contract
 *
 * @param {ethers.Contract} contract - ethers.js contract instance
 * @return {promise} a promise which resolves with the `value`
 */
function getValue(contract) {
    return contract.value().then(result => result)
}

module.exports = getValue;
```
---

### Setter
#### Transactions
- In the last stage we made a call to the value getter. 
    - This call required no gas and made no modifications to the contract storage.
- In this stage we will be modifying a value in the contract storage. 
    - This will require us to make a transaction and spend gas. 
    - Fortunately, the contract api for this isn't much different at all!
- Consider this contract:
    ```solidity
    // Switch.sol
    contract Switch {
        bool isOn;

        function change(bool _isOn) external {
            isOn = _isOn;
        }
    }
    ```
- Once again, ethers.js will provide us with a dynamic function called ``change`` on the contract instance:
    ```js
    // turnOnSwitch.js
    function turnOnSwitch(contract) {
        return contract.change(true);
    }
    ```
    - This function will set the ``isOn`` state variable to ``true`` and return the transaction promise.
- The reason this is so simple is because the contract is linked to a [Signer](https://docs.ethers.io/v5/api/signer/). 
    - The Signer represents an EOA. 
    - With it, we can sign a transaction before we broadcast it to the network. 
    - Since the contract is already associated with the signer, ethers.js can do this automatically.
> In the previous ethers.js tutorial we specifically worked with ethers **Wallets**. Wallets implement the [Signer API](https://docs.ethers.io/v5/api/signer/#Signer) with additional functionality.

#### Your Goal: Modify Value
- In ``contract``.sol you'll see there is a uint state variable called ``value``.
1. Your goal is to call the ``modify()`` function on this ``value`` from the ``setValue`` function in ``index.js``.
1. The default value for a uint is ``0``, so change this value to anything else and the tests will pass.

---
**SOLUTION**
```solidity
// contract.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

contract Contract {
	uint public value;

	function modify(uint _value) external {
		value = _value;
	}
}
```
```js
// index.js
/**
 * Modify the `value` stored in the contract
 *
 * @param {ethers.Contract} contract - ethers.js contract instance
 * @return {promise} a promise of transaction
 */
function setValue(contract) {
    return contract.modify(2)
}

module.exports = setValue;
```


### Transfer
#### Multiple Arguments
- Calling solidity contracts with multiple arguments in ethers.js is not much different from what you might expect!
- We can define an ``Adder`` contract:
    ```solidity
    // Adder.sol
    contract Adder {
        function add(uint x, uint y) external pure returns(uint) {
            return x + y;
        }
    }
    ```
- Then we can call the contract from our JavaScript side:
    ```js
    // callAdder.js
    async function callAdder(adderContract) {
        const sum = await adderContract.add(1,4); 
        console.log(sum); // 5
    }
    ```
#### Your Goal: Transfer
1. In the ``index.js`` file, complete the ``transfer`` function to transfer value from the contract signer to the ``friend`` address.
1. The signer will also be the deployer of the contract. Their balance will be ``1000`` after deploying the contract.
1. Your task is to transfer some of this to the ``friend``. It can be however much you want!
---
**SOLUTION**
```solidity
// Token.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

contract Token {
    mapping(address => uint) public balances;

    constructor() {
        balances[msg.sender] = 1000;
    }

    function transfer(address beneficiary, uint amount) external {
        require(balances[msg.sender] >= amount, "Balance too low!");
        balances[beneficiary] += amount;
        balances[msg.sender] -= amount;
    }
}
```
```js
// index.js
/**
 * Transfer funds on the contract from the current signer
 * to the friends address
 *
 * @param {ethers.Contract} contract - ethers.js contract instance
 * @param {string} friend - a string containing a hexadecimal ethereum address
 * @return {promise} a promise of the transfer transaction
 */
function transfer(contract, friend) {
    return contract.transfer(friend,500)
}

module.exports = transfer;
```
---

### Signer
- We've talked about the **signer** quite a bit in the past few stages, but what is it, exactly?
- A signer represents an EOA we have control over. 
    - We can use it to sign transactions before sending them to the network.
- When we create a Contract instance we connect with a signer so that we can transact with the contract easily!
- We can also connect the contract with other signers when we need to run the same transaction with different addresses:
    ```js
    // createUsers.js
    async function createUsers(contract, signers) {
        for(let i = 0; i < signers.length; i++) {
            await contract.connect(signers[i]).createUser();
        }
    }
    ```
    - In this example we are connecting the contract with different signers and calling the createUser method with each one.
> The function ``connect`` returns a new instance of contract connected with this signer. This makes it possible to "chain" the function with the method call to ``createUser`` as shown above. Each call will be made with a different signer.
- The ``msg.sender`` value inside the contract will be the address of these users:
    ```solidity
    // Contract.sol
    import "hardhat/console.sol";
    contract Contract {
        function createUser() external view {
            console.log(msg.sender); // 0xabc…
        }
    }
    ```
    - The ``createUser`` function will be called once for each signer in the ``signers`` array.

#### Your Goal: Set Message
1. In the Contract you will find a ``message`` state variable. Your goal is to modify the message to contain anything other than an empty string.
1. The only problem is the ``owner`` cannot change this message! You'll need to connect the contract to a different ``signer`` in order to change it. In the ``index.js`` file you'll have access to the contract and a different ``signer``.

---
**SOLUTION**
```solidity
// Contract.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

contract Contract {
    address owner;
    string public message;

    constructor() {
        owner = msg.sender;
    }

    function modify(string calldata _message) external {
        require(msg.sender != owner, "Owner cannot modify the message!");
        message = _message;
    }
}
```
```js
// index.js
/**
 * Set the message on the contract using the signer passed in
 *
 * @param {ethers.Contract} contract - ethers.js contract instance
 * @param {ethers.types.Signer} signer - ethers.js signer instance
 * @return {promise} a promise of transaction modifying the `message`
 */
function setMessage(contract, signer) {
    return contract.connect(signer).modify('ok')
}

module.exports = setMessage;
```
---

### Deposit
#### Value Transfer
- We're making some strong progress! Up to this point we have called functions, made transactions and sent function arguments with both.
- Now it's time to learn how to send ether with our transaction!
- Let's consider a contract with a payable function:
    ```solidity
    // Charities.sol
    contract Charities {
        mapping(uint => uint) balances;
        function donate(uint id) external payable {
            balances[id] += msg.value;
        }
    }
    ``` 
    - Each charity has an ``id`` that maps to a ``uint`` balance. 
        - The ``donate`` function will add the value sent to the function to the associated charity's balance.
- We can call the donate method from ethers.js and provide ether:
    ```js
    // donate.js
    const ethers = require('ethers');
    async function donate(contract, charityId) {
        await contract.donate(charityId, {
            value: ethers.utils.parseEther("5")
        });
    }
    ```
    - This will send 5 ETH to the donate function which will store it in the ``balances`` mapping associated with the ``charityId``.
- You'll notice that the first argument passed here was the ``charityId``, matching the Solidity signature. 
    - The second argument we passed in is called the **overrides** object. 
    - In this object we can specify the **value**, which is how much ether we'd like to send. 
    - This object must be passed in **last** after all the other argument functions.
> Along with the **value** there are four other values that can be specified in the overrides object of a transaction: **gasLimit**, **gasPrice**, **nonce** and **chainId**.

#### Your Goal: Make a Deposit
Complete the deposit function within the index.js to call the contract and deposit at least 1 ether.

---
**SOLUTION**
```solidity
// Contract.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.7.5;

contract Contract {
    function deposit() payable external { }
}
```
```js
// index.js
const ethers = require('ethers');

/****
 * Deposit at least 1 ether into the contract
 *
 * @param {ethers.Contract} contract - ethers.js contract instance
 * @return {promise} a promise of the deposit transaction
 */
function deposit(contract) {
    return contract.deposit({
        value:ethers.utils.parseEther('1')
    })
}

module.exports = deposit;
```
---