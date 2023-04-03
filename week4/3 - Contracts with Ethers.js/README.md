### Contracts with ethers.js
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