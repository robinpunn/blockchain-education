## Multi-Sig Wallet

---

### Table of Contents
1. [Multiple Signature Wallet](#multiple-signature-wallet)
1. [Constructor](#constructor)
    - [Example](#example)
    - [Your Goal: Setup](#your-goal-setup)
    - [State Variables](#state-variables)
    - [Constructor](#constructor1)
1. [Error Handling](#error-handling)
    - [Your Goal: Handle Contructor Mistakes](#your-goal-handle-constructor-mistakes)
1. [Transaction Setup](#transaction-setup)
    - [Transaction Struct](#transaction-struct)
    - [Your Goal: Transactions](#your-goal-transactions)
    - [Transaction Storage](#transaction-storage)
1. [Add Transactions](#add-transactions)
    - [Transactions](#transactions)
    - [Your Goal: Add Transactions](#your-goal-add-transactions)
    - [Note on Transaction IDs](#note-on-transaction-ids)
1. [Confirmations](#confirmations)
    - [Confirmation Storage](#confirmation-storage)
    - [Your Goal: Nested Confirmations Mapping](#your-goal-nested-confirmations-mapping)
1. [Confirm Transaction](#confirm-transaction)
    - [Owner Confirmations](#owner-confirmations)
    - [Your Goal: Confirm Transaction](#your-goal-confirm-transaction)
    - [View Function](#view-function)
1. [Confirm Security](#confirm-security)
    - [Only Owners](#only-owners)
    - [Your Goal: Confirmation Security](#your-goal-confirmation-security)
1. [Submit Transaction](#submit-transaction)
    - [Your Goal: Submit Transactions](#your-goal-submit-transactions)
    - [Change Visibility](#change-visibility)
1. [Receive](#receive)
    - [Your Goal: Payable Receive](#your-goal-payable-receive)
1. [Is Confirmed](#is-confirmed)
    - [Check if Confirmed](#check-if-confirmed)
    - [Your Goal: Confirmed Getter](#your-goal-confirmed-getter)
1. [Execute](#execute)
    - [Execution](#execution)
    - [Call Syntax](#call-syntax)
    - [Compiler Warning](#compiler-warning)
    - [Your Goal: Execute Transaction](#your-goal-execute-transaction)
1. [Execute Confirmed](#execute-confirmed)
    - [Immediate Execution](#immediate-execution)
    - [Your Goal: Execute Confirmed](#your-goal-execute-confirmed)
1. [Sending Calldata](#sending-calldata)
    - [Storing ERC20 Tokens](#storing-erc20-tokens)
    - [Call Syntax](#call-syntax)
    - [Compiler Warning](#compiler-warning-1)
    - [Your Goal: Send Calldata](#your-goal-send-calldata)

---

### Multiple Signature Wallet
- You can think of a Multiple Signature Wallet (Multi-Sig) as being like an EOA, except each transaction must be signed off by multiple parties. 
- In Ethereum, Multi-Sig Wallets are smart contracts that store a list of owner addresses and a number of confirmations (unique owner signatures) that are required to complete a transaction. 
![Multi-Sig Smart Contract](https://res.cloudinary.com/divzjiip8/image/upload/v1569277574/Frame_13_mcuqpx.png)
- The multi-sig keeps track of owners #1, #2, and #3. 
    - It is also configured with the number of required confirmations to move funds, 2 in this case.
- Owner #1 submits a transaction to move .5 ETH to 0xabc.... 
    - This transaction will be pending until there are enough confirmations to move it forward. 
    - Since this multi-sig only requires two confirmations, as soon as owner #3 confirms the transaction, it is executed.
- In this tutorial we will build an implementation of a multi-signature wallet smart contract!

### Constructor
#### Multiple Signature Wallet
- Multi-Sig Wallet is short for Multiple Signature Wallet.
    - It is a wallet that requires multiple confirmations on a transaction before the transaction is executed.
- If you had funds that were shared amongst four different individuals you might require 2, 3, or 4 signatures to execute a transaction.
- Less signatures will make it easier to move funds, although you risk funds being moved without the entire groups consent.
- The more signatures you require, the better your overall security.
    - Of course, with a higher amount of signatures you do run the risk that losing private keys may cause the funds to be immovable.
#### Example
- Let's take a look at an example with three owners and two required confirmations:
![multi2](https://res.cloudinary.com/divzjiip8/image/upload/v1569277574/Frame_13_mcuqpx.png)
- Here you can see that owner #3 has confirmed a transaction that owner #1 submitted.
    - Since this Multi-Sig only requires 2 confirmations, the transaction is executed.
- The downside here is that perhaps owner #2 might not have been okay with the transaction, or perhaps owner #1 and #3 were hacked!
    - If you lower the confirmations to 1, it only requires one compromised owner to lose funds.
    - If you raise the confirmations to 3, one owner losing their key will result in the funds being locked forever!
- Ultimately, the number of confirmations is up to the group's discretion and should cater to the needs of the group.
#### Your Goal: Setup
- Let's create a Multi-Sig Wallet!
- When this wallet is deployed it will be configured with the owners addresses and how many signatures are required to move funds.
#### State Variables
1. Declare a public ``address[] owners`` to store wallet owner addresses.
1. Declare a public ``uint256 required`` to store the required amount of confirmations needed to execute a transaction.
#### Constructor
3. Define a constructor function that has two parameters: an array of owner addresses and the ``uint256`` required amount of confirmations.
4. Store the two arguments in their respective state variables created above.
![multi](https://res.cloudinary.com/divzjiip8/image/upload/v1569277823/Frame_14_jjrdyj.png)
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;

    constructor(address[] memory _owners, uint256 _required){
        owners = _owners;
        required = _required;
    }
}
```

### Error Handling
- Great! We've setup the owners and required signatures.
- Now, what if the deployer of the contract makes a mistake during deployment?
- When developing a user friendly contract we should be validating user inputs for common sources of error.
    - We should definitely be checking the owners and signatures to ensure situations do not occur where the funds are immediately locked.
- These situations include deploying no owner addresses and when the number of signatures is zero or more than the number of owners.
#### Your Goal: Handle Constructor Mistakes
- Let's revert the deployment transaction in the following situations:
    1. No owner addresses are sent.
    1. Number of required confirmations is zero.
    1. Number of required confirmations is more than the total number of owner addresses.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0);
        require(_required > 0);
        require(_required < _owners.length);
        owners = _owners;
        required = _required;

    }
}
```

### Transaction Setup
#### Transaction Struct
- We've supplied the initial setup parameters to our Multi-Sig Wallet!
    - The wallet will require the confirmation of multiple addresses to execute a transaction.
- This means one owner will need to propose the transaction and the smart contract will need to store information about this transaction until the other owners can sign off on it!
#### Your Goal: Transactions
- Define a ``Transaction`` struct that includes these member variables in **the following order**:
    1. A ``address`` for the destination of the transaction's value.
    1. A ``uint256`` value of the transaction in wei.
    1. A ``bool`` named **executed*** which indicates if the transaction has been executed.
> *Be sure to name this executed so the test cases can use this for a transaction status on later stages.
#### Transaction Storage
- We'll need to store the transactions while they are being confirmed by the other owners.
- You have two options for your implementation here:
1. Create a public mapping from a uint id to a Transaction
**OR**
1. Create a public array of ``Transaction``
- Then, create a public ``transactionCount`` view function which returns the total number of transactions stored.
> This function can either be a getter for a public state variable or a function that returns the array length.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint256 transaction;
        bool executed;
    }

    mapping(uint => Transaction) public transactions;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0);
        require(_required > 0);
        require(_required < _owners.length);
        owners = _owners;
        required = _required;
    }

}
```

### Add Transactions
#### Transactions
- You built out the storage for the transactions.
- Now it's time we create a function to put our transactions into that storage!
#### Your Goal: Add Transactions
1. Define a public ``addTransaction`` function with a destination ``address`` and a value ``uint256`` as parameters.
1. This function should create a new transaction struct and add it to the ``transactions`` storage variable
1. This function should return a ``uint256`` transaction id to reference this particular transaction (see note below).
1. Set the ``executed`` boolean should be set to ``false`` by default.
#### Note on Transaction IDs
- The transaction IDs should be zero-based. The first one being ``0``, then ``1``, ``2``, and so on.
![multisig](https://res.cloudinary.com/divzjiip8/image/upload/v1569278958/Frame_16_i8wb94.png)
- In the first ``addTransaction``, the transaction #0 is added and the ``transactionCount`` becomes ``1``.

**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint256 transaction;
        bool executed;
    }

    mapping(uint => Transaction) public transactions;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0);
        require(_required > 0);
        require(_required < _owners.length);
        owners = _owners;
        required = _required;
    }

    function addTransaction(address _address, uint256 _value)
        public
        returns (uint256 _id)
    {
        _id = transactionCount;
        transactions[transactionCount] = Transaction(_address,_value, false);
        transactionCount ++;
    }

}
```

### Confirmations
#### Confirmation Storage
- Since each transaction is only executed after all confirmations are received, we will need to implement a way to check which owners have confirmed a transaction!
- Let's create the storage variable for the confirmations before diving into the functionality.
#### Your Goal: Nested Confirmations Mapping
- Define a public ``confirmations`` mapping which maps the transaction id (``uint``) to an owner (``address``) to whether or not they have confirmed the transaction (``bool``).
![ids](https://res.cloudinary.com/divzjiip8/image/upload/v1569279479/Frame_17_sxq1tv.png)
- A transaction id maps to a mapping of address to booleans.
- The first transaction (#0) maps to two addresses, one of which has confirmed the transaction.
    - The second transaction (#1) maps to two addresses where both have confirmed the transaction.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint256 transaction;
        bool executed;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0);
        require(_required > 0);
        require(_required < _owners.length);
        owners = _owners;
        required = _required;
    }

    function addTransaction(address _address, uint256 _value)
        public
        returns (uint256 _id)
    {
        _id = transactionCount;
        transactions[transactionCount] = Transaction(_address,_value, false);
        transactionCount ++;
    }

}
```

### Confirm Transaction
#### Owner Confirmations
- Each owner should be able to signal their approval for the transaction by confirming it.
    - Let's create a way for them to do this!
#### Your Goal: Confirm Transaction
1. Create a public ``confirmTransaction`` function with a transaction ID as its only argument.
    - This function should create a confirmation for the transaction from the msg.sender.
#### View Function
2. Write a public, view function called ``getConfirmationsCount`` that takes a ``uint`` called ``transactionId`` and returns a ``uint256`` representing the number of times the transaction with the given ``transactionId`` has been confirmed.
> The only addresses that can confirm are the **owners**. This would be a good place to start when trying to count the total number of confirmations.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint256 transaction;
        bool executed;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0);
        require(_required > 0);
        require(_required < _owners.length);
        owners = _owners;
        required = _required;
    }

    function addTransaction(address _address, uint256 _value)
        public
        returns (uint256 _id)
    {
        _id = transactionCount;
        transactions[transactionCount] = Transaction(_address,_value, false);
        transactionCount ++;
    }

    function confirmTransaction(uint _txId) public {
        confirmations[_txId][msg.sender] = true;
    }

    function getConfirmationsCount(uint transactionId) public view returns(uint256) {
        uint confirmed;
        for (uint i = 0; i < owners.length; i++){
            if(confirmations[transactionId][owners[i]]) {
                confirmed ++;
            }
        }
        return confirmed;
    }

}
```

### Confirm Security
#### Only Owners
- The multisig wallet would be pointless and insecure if anyone could confirm a signature. Let's make sure we handle this!
#### Your Goal: Confirmation Security
1. Ensure that ``confirmTransaction`` can only be called by the owners stored in the constructor. If anyone else calls this function, revert the transaction.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint256 transaction;
        bool executed;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0);
        require(_required > 0);
        require(_required < _owners.length);
        owners = _owners;
        required = _required;
    }

    function getOwner(address _address)
        private
        view
        returns(bool)
    {
        for(uint i = 0; i < owners.length; i++) {
            if(owners[i]==_address) {
                return true;
            }
        }
        return false;
    }

    function addTransaction(address _address, uint256 _value)
        public
        returns (uint256 _id)
    {
        _id = transactionCount;
        transactions[transactionCount] = Transaction(_address,_value, false);
        transactionCount ++;
    }

    function confirmTransaction(uint _txId) public {
        require(getOwner(msg.sender));
        confirmations[_txId][msg.sender] = true;
    }

    function getConfirmationsCount(uint transactionId) public view returns(uint256) {
        uint confirmed;
        for (uint i = 0; i < owners.length; i++){
            if(confirmations[transactionId][owners[i]]) {
                confirmed ++;
            }
        }
        return confirmed;
    }

}
```
### Submit Transaction
- Let's create a new function that will allow a user to create a transaction and immediately confirm it.
> We can pretty much assume that the owner submitting the transaction also wants to confirm it. We can save them some gas of creating another transaction by confirming it immediately!

#### Your Goal: Submit Transactions
1. Create an external ``submitTransaction`` function with a destination ``address`` and a ``uint`` value as it's arguments.
1. This function should create a new transaction and add it to storage and **confirm it**.
    - Fortunately we already have two functions that do these things:
        - The ``addTransaction`` function creates transactions and adds them to storage.
        - The ``confirmTransaction`` function confirms transactions by their id.
        - Invoke both of these functions from within the ``submitTransaction`` function.
#### Change Visibility
3. Now that we have this more efficient function, change ``addTransaction`` function visibility from ``public`` to ``internal``
> Owners will only call ``submitTransaction`` so ``addTransaction`` should not be available from outside of the contract. It's generally a good security practice to keep as few functions public/external as possible. This way you have less endpoints you need to consider for vulnerabilities!
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint256 transaction;
        bool executed;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0);
        require(_required > 0);
        require(_required < _owners.length);
        owners = _owners;
        required = _required;
    }

    function getOwner(address _address)
        private
        view
        returns(bool)
    {
        for(uint i = 0; i < owners.length; i++) {
            if(owners[i]==_address) {
                return true;
            }
        }
        return false;
    }

    function addTransaction(address _address, uint256 _value)
        internal
        returns (uint256 _id)
    {
        _id = transactionCount;
        transactions[transactionCount] = Transaction(_address,_value, false);
        transactionCount ++;
    }

    function confirmTransaction(uint _txId) public {
        require(getOwner(msg.sender));
        confirmations[_txId][msg.sender] = true;
    }

    function getConfirmationsCount(uint transactionId) public view returns(uint256) {
        uint confirmed;
        for (uint i = 0; i < owners.length; i++){
            if(confirmations[transactionId][owners[i]]) {
                confirmed ++;
            }
        }
        return confirmed;
    }

    function submitTransaction(address destination, uint value) external {
        confirmTransaction(addTransaction(destination,value));
    }

}
```

### Receive
- A multi-sig can be used as a primary wallet for an organization.
    - This organization will have all of its funds pooled and then vote on where to spend those funds.
- They may direct all payments from external users/organizations to their multi-sig address.
    - As such, it's important that the multi-sig can always receive funds!
#### Your Goal: Payable Receive
1. Define a external, payable receive function that allows our Multi-Sig wallet to accept funds at any time.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint256 transaction;
        bool executed;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0);
        require(_required > 0);
        require(_required < _owners.length);
        owners = _owners;
        required = _required;
    }

    function getOwner(address _address)
        private
        view
        returns(bool)
    {
        for(uint i = 0; i < owners.length; i++) {
            if(owners[i]==_address) {
                return true;
            }
        }
        return false;
    }

    function addTransaction(address _address, uint256 _value)
        internal
        returns (uint256 _id)
    {
        _id = transactionCount;
        transactions[transactionCount] = Transaction(_address,_value, false);
        transactionCount ++;
    }

    function confirmTransaction(uint _txId) public {
        require(getOwner(msg.sender));
        confirmations[_txId][msg.sender] = true;
    }

    function getConfirmationsCount(uint transactionId) public view returns(uint256) {
        uint confirmed;
        for (uint i = 0; i < owners.length; i++){
            if(confirmations[transactionId][owners[i]]) {
                confirmed ++;
            }
        }
        return confirmed;
    }

    function submitTransaction(address destination, uint value) external {
        confirmTransaction(addTransaction(destination,value));
    }

    receive() payable external {

    }
}
```

### Is Confirmed?
#### Check if Confirmed
- Let's create a function that will help us determine if a transaction is confirmed or not!
- We'll be able to use this as a quick lookup when executing the transaction.
    - If the transaction is not confirmed, it should not be executed!
#### Your Goal: Confirmed Getter
1. Create a public view ``isConfirmed`` function with a ``uint`` transaction ID as it's only argument.
1. This function should return ``true`` if the transaction is confirmed and ``false`` if it is not.
> You have written a helper function that may help you out here!
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint256 transaction;
        bool executed;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0);
        require(_required > 0);
        require(_required < _owners.length);
        owners = _owners;
        required = _required;
    }

    function getOwner(address _address)
        private
        view
        returns(bool)
    {
        for(uint i = 0; i < owners.length; i++) {
            if(owners[i]==_address) {
                return true;
            }
        }
        return false;
    }

    function addTransaction(address _address, uint256 _value)
        internal
        returns (uint256 _id)
    {
        _id = transactionCount;
        transactions[transactionCount] = Transaction(_address,_value, false);
        transactionCount ++;
    }

    function confirmTransaction(uint _txId) public {
        require(getOwner(msg.sender));
        confirmations[_txId][msg.sender] = true;
    }

    function getConfirmationsCount(uint transactionId) public view returns(uint256) {
        uint confirmed;
        for (uint i = 0; i < owners.length; i++){
            if(confirmations[transactionId][owners[i]]) {
                confirmed ++;
            }
        }
        return confirmed;
    }

    function submitTransaction(address destination, uint value) external {
        confirmTransaction(addTransaction(destination,value));
    }

    function isConfirmed(uint confirmed) public view returns(bool){
        if(getConfirmationsCount(confirmed) >= required ) {
            return true;
        }
        return false;
    }

    receive() payable external {

    }
}
```

### Execute
#### Execution
- It's time to execute our multi-sig transaction!
- This is the part of the process where we have reached the required amount of signatures, so we can go ahead and move the funds

#### Call Syntax
- To send ether and calldata to a particular address, we can use the following syntax:
    ```js
    _tx.destination.call{ value: _tx.value }("");
    ```
- How does this work?
- There's three types being used here in this syntax:
    - **_tx.destination** - an address that we're sending data and ether to
    - **_tx.value** - a uint that represents the amount of ether we are sending to the destination.
        - This could be zero.
        - If it's above zero, the multisig must have enough ether stored in it to send this amount.
    - **empty string** - this can be empty, although often this is abi encoded function signature and arguments.
        - If the destination is a smart contract, it will run some code based on this calldata!
>  The call data can be basically anything! A simple example would be an encoded call to ``transfer(address _to, uint256 _value)`` on an ERC20 token. This is what is happening in the test cases!

#### Compiler Warning
- For the syntax shown above the compiler will warn that we are not using the boolean success value returned from the low-level call. You will see ``"Warning: Return value of low-level calls not used."``
- In our case we may want to revert on an unsuccessful transfer:
    ```solidity
    (bool success, ) = _tx.destination.call{ value: _tx.value }("");
    require(success, "Failed to execute transaction");
    ```
    - This will revert the transaction if the success boolean is false.
- The second argument will be bytes, we can specify it with bytes memory returnData, although it will also result in a compiler warning unless we use this data.
> You can learn more about the call method in the [address members](https://docs.soliditylang.org/en/v0.8.4/types.html#members-of-addresses) documentation.

#### Your Goal: Execute Transaction
1. Define a public ``executeTransaction`` function with a uint transaction ID as it's only argument.
1. Ensure that the ``executeTransaction`` function sends the transaction value to the ``address`` specified within the transaction object.
1. Once transferred, set the transaction's ``executed`` boolean to true. This way we'll know the transaction has been completed.
1. The transaction should only execute if it is confirmed. If not, revert the transaction.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint256 transaction;
        bool executed;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0);
        require(_required > 0);
        require(_required < _owners.length);
        owners = _owners;
        required = _required;
    }

    function getOwner(address _address)
        private
        view
        returns(bool)
    {
        for(uint i = 0; i < owners.length; i++) {
            if(owners[i]==_address) {
                return true;
            }
        }
        return false;
    }

    function addTransaction(address _address, uint256 _value)
        internal
        returns (uint256 _id)
    {
        _id = transactionCount;
        transactions[transactionCount] = Transaction(_address,_value, false);
        transactionCount ++;
    }

    function confirmTransaction(uint _txId) public {
        require(getOwner(msg.sender));
        confirmations[_txId][msg.sender] = true;
    }

    function getConfirmationsCount(uint transactionId) public view returns(uint256) {
        uint confirmed;
        for (uint i = 0; i < owners.length; i++){
            if(confirmations[transactionId][owners[i]]) {
                confirmed ++;
            }
        }
        return confirmed;
    }

    function submitTransaction(address destination, uint value) external {
        confirmTransaction(addTransaction(destination,value));
    }

    function isConfirmed(uint confirmed) public view returns(bool){
        if(getConfirmationsCount(confirmed) >= required ) {
            return true;
        }
        return false;
    }

    function executeTransaction(uint _txid) public{
        require(isConfirmed(_txid));
        Transaction storage _tx = transactions[_txid];
        (bool success, ) = _tx.destination.call{ value: _tx.transaction }("");
        require(success, "Failed to execute transaction");
        _tx.executed = true;
    }

    receive() payable external {

    }
}
```

### Execute Confirmed
#### Immediate Execution
- Currently someone must call ``executeTransaction`` in order for the transaction to be executed.
    - Once the transaction has reached it's necessary number of signatures, we should immediately execute the transaction!
- There's no sense in requiring the owner to make a separate call to the executeTransaction function after they confirmed the transaction and it has enough signatures.

#### Your Goal: Execute Confirmed
1. Let's invoke ``executeTransaction`` within ``confirmTransaction``!
    - Once the multi-sig has been confirmed by enough owners to meet the requirement, invoke the execution.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint256 transaction;
        bool executed;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0);
        require(_required > 0);
        require(_required < _owners.length);
        owners = _owners;
        required = _required;
    }

    function getOwner(address _address)
        private
        view
        returns(bool)
    {
        for(uint i = 0; i < owners.length; i++) {
            if(owners[i]==_address) {
                return true;
            }
        }
        return false;
    }

    function addTransaction(address _address, uint256 _value)
        internal
        returns (uint256 _id)
    {
        _id = transactionCount;
        transactions[transactionCount] = Transaction(_address,_value, false);
        transactionCount ++;
    }

    function confirmTransaction(uint _txId) public {
        require(getOwner(msg.sender));
        confirmations[_txId][msg.sender] = true;
        if(isConfirmed(_txId)){
            executeTransaction(_txId);
        }
    }

    function getConfirmationsCount(uint transactionId) public view returns(uint256) {
        uint confirmed;
        for (uint i = 0; i < owners.length; i++){
            if(confirmations[transactionId][owners[i]]) {
                confirmed ++;
            }
        }
        return confirmed;
    }

    function submitTransaction(address destination, uint value) external {
        confirmTransaction(addTransaction(destination,value));
    }

    function isConfirmed(uint confirmed) public view returns(bool){
        if(getConfirmationsCount(confirmed) >= required ) {
            return true;
        }
        return false;
    }

    function executeTransaction(uint _txid) public{
        require(isConfirmed(_txid));
        Transaction storage _tx = transactions[_txid];
        (bool success, ) = _tx.destination.call{ value: _tx.transaction }("");
        require(success, "Failed to execute transaction");
        _tx.executed = true;
    }

    receive() payable external {

    }
}
```

### Sending Calldata
#### Storing ERC20 Tokens
- So at this point, the question may occur to you: What if we wanted to store ERC20 tokens?
- It turns out, it's quite simple to add this flexibility.
    - All we need to do is add the ability to send calldata as part of our multisig execution.
> This functionality will actually allow us to run more complex logic than just transferring ERC20 tokens! The ERC20 standard simply serves as a good example here.

#### Call Syntax
- To send ether and calldata to a particular address, we can use the following syntax:
```solidity
_tx.destination.call{ value: _tx.value }(_tx.data);
```
- How does this work?
- There's three types being used here in this syntax:
    1. **_tx.destination** - an address that we're sending data and ether to
    1. **_tx.value** - a uint that represents the amount of ether we are sending to the destination. This could be zero. If it's above zero, the multisig must have enough ether stored in it to send this amount.
    1. **_tx.data** - this can be empty, although often this is abi encoded function signature and arguments. If the destination is a smart contract, it will run some code based on this calldata!
>  The call data can be basically anything! A simple example would be an encoded call to ``transfer(address _to, uint256 _value)`` on an ERC20 token. This is what is happening in the test cases!

#### Compiler Warning
- For the syntax shown above the compiler will warn that we are not using the boolean success value returned from the low-level call. You will see ``"Warning: Return value of low-level calls not used."``
- In our case we may want to revert on an unsuccessful transfer:
    ```solidity
    (bool success, ) = _tx.destination.call{ value: _tx.value }(_tx.data);
    require(success, "Failed to execute transaction");
    ```
    - This will revert the transaction if the success boolean is false.
    - The second argument will be bytes, we can specify it with bytes memory returnData, although it will also result in a compiler warning unless we use this data.
> You can learn more about the call method in the [address members](https://solidity.readthedocs.io/en/v0.8.4/types.html#members-of-addresses) documentation.

#### Your Goal: Send Calldata
1. Let's first start by adding a ``bytes data`` variable as the last member of our ``Transaction`` struct.
    - This will store the calldata we will send to the destination!
**Compiler Complaints**
2. After you have added ``bytes data`` to the struct, you'll get a few compiler complaints.
    - To fix this, you'll need to accept a ``bytes`` argument in ``submitTransaction``, as well as ``addTransaction``
> You'll also need to pass this through the invocation to ``addTransaction`` within the ``submitTransaction`` function!
**Send the Data**
3. Finally, we'll need to send the data inside the executeTransaction function. We can use this syntax:
    ```solidity
    _tx.destination.call{ value: _tx.value }(_tx.data);
    ```
    - The ``_tx`` is the transaction we are executing.
        - The properties ``destination``, ``value`` and ``data`` could be named differently in your implementation.
        - They are the properties stored in the Transaction struct for the address destination, uint value and bytecode data.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MultiSig {
    address[] public owners;
    uint256 public required;
    uint public transactionCount;

    struct Transaction {
        address destination;
        uint256 transaction;
        bool executed;
        bytes data;
    }

    mapping(uint => Transaction) public transactions;
    mapping(uint => mapping(address => bool)) public confirmations;

    constructor(address[] memory _owners, uint256 _required){
        require(_owners.length > 0);
        require(_required > 0);
        require(_required < _owners.length);
        owners = _owners;
        required = _required;
    }

    function getOwner(address _address)
        private
        view
        returns(bool)
    {
        for(uint i = 0; i < owners.length; i++) {
            if(owners[i]==_address) {
                return true;
            }
        }
        return false;
    }

    function addTransaction(address _address, uint256 _value, bytes calldata _data)
        internal
        returns (uint256 _id)
    {
        _id = transactionCount;
        transactions[transactionCount] = Transaction(_address,_value, false, _data);
        transactionCount ++;
    }

    function confirmTransaction(uint _txId) public {
        require(getOwner(msg.sender));
        confirmations[_txId][msg.sender] = true;
        if(isConfirmed(_txId)){
            executeTransaction(_txId);
        }
    }

    function getConfirmationsCount(uint transactionId) public view returns(uint256) {
        uint confirmed;
        for (uint i = 0; i < owners.length; i++){
            if(confirmations[transactionId][owners[i]]) {
                confirmed ++;
            }
        }
        return confirmed;
    }

    function submitTransaction(address _destination, uint _value, bytes calldata _data) external {
        confirmTransaction(addTransaction(_destination, _value, _data));
    }

    function isConfirmed(uint confirmed) public view returns(bool){
        if(getConfirmationsCount(confirmed) >= required ) {
            return true;
        }
        return false;
    }

    function executeTransaction(uint _txid) public{
        require(isConfirmed(_txid));
        Transaction storage _tx = transactions[_txid];
        (bool success, ) = _tx.destination.call{ value: _tx.transaction }(_tx.data);
        require(success, "Failed to execute transaction");
        _tx.executed = true;
    }

    receive() payable external {

    }
}
```