### Events
- So far in the Solidity lessons, we've been using ``return`` to test functions. 
    - This works great in **queries** to the EVM where we get a response back immediately from the Ethereum client. 
    - However, we know that transactions are **not immediate**. 
    - In fact, if the gas price is set too low, a miner may never include the transaction! Even when the transaction is included, ``return`` values are not saved to the blockchain.
- So, how do we store values on transactions which can be accessed later? 
- For one thing, we can create new state variables. 
    - However, storing a state variable is an expensive operation. 
    - Expensive for the network and expensive as far as the opcode gas cost (which always seeks to reflect the strain of the network).
- Also, we can't easily look at changes over time to state variables. If, for example, we had a faucet on a testnet:
    ```solidity
    contract Faucet {
        function withdraw() external {
            msg.sender.transfer(1 ether);
        }
    }
    ```
    - How could we see a list of all addresses that have ever withdrawn ether from this faucet? It's quite difficult to do!
- Fortunately, this is what we have Solidity Events for! 
    - Events allow us to log persistent data about a transaction. For our faucet:
    ```solidity
    contract Faucet {
        event Withdrawal(address _recipient) 
        function withdraw() external {
            msg.sender.transfer(1 ether);
            emit Withdrawal(msg.sender);
        }
    }
    ```
    - You can see we declared an event ``Withdrawal`` and then emitted it with the ``msg.sender`` as the ``recipient`` address. 
        - Now we'll be able to lookup all ``Withdrawal`` events to see addresses that have received ether.
> Underneath the hood, events use the EVM ``LOGx`` opcodes, where ``x`` is a value ``0`` through ``4``, based on the number of searchable parameters. We'll discuss this further throughout the lesson.

---
### Table of Contents
1. [Deployed](#deployed)
    - [Emitting an Event](#emitting-an-event)
    - [Retrieving log Events](#retrieving-event-logs)
    - [Data](#data)
    - [Topics](#topics)
    - [Further Reading](#further-reading)
    - [Your Goal: Deployed Event](#your-goal-deployed-event)
1. [Transfer](#transfer)
    - [Multiple Arguments](#multiple-arguments)
    - [Named Arguments](#named-arguments)
    - [Your Goal: Transfer the Collectible](#your-goal-transfer-the-collectible)
1. [Up for Sale](#up-for-sale)
    - [Your Goal: Mark the Price](#your-goal-mark-the-price)
    - [Function Security](#function-security)
1. [Sale](#sale)
    - [Your Goal: Make a Purchase!](#your-goal-make-a-purchase)
    - [Function Security](#function-security-1)
1. [Indexed](#indexed)
    - [Indexing](#indexing)
    - [Your Goal: Index the Addresses](#your-goal-index-the-addresses)
---

### Deployed
#### Emitting an Event
- To emit an event, we need to take two steps. First, we need to declare the event:
    ```solidity
    event ExampleEvent(uint _exampleArgument);
    ```
    - The ``event`` keyword prefaces the event declaration, otherwise, it's quite similar to function syntax without the additional keywords and function body.
> Functions and Events use a different naming convention. Events are typically ``UpperCamelCase`` whereas function names are ``lowerCamelCase``. This is a style-choice, so the compiler will not enforce this rule. However, it's generally best to stick to convention.
- Then we must ``emit`` the event from inside of a function body:
    ```solidity
    function exampleFunction() external {
        emit ExampleEvent(5);
    }
    ```
    - We use the keyword ``emit`` prior to invoking the event.
        - Then we can pass it the argument just like we would for a function.
#### Retrieving Event Logs
- When you're looking to retrieve the logs, you can call the [``eth_getLogs``](https://docs.alchemy.com/reference/eth-getlogs) JSON RPC Method on a Ethereum Node.
    - You'll want to supply a few parameters, like the block numbers or contract addresses. You can see the documentation on that method [here](https://docs.alchemy.com/reference/eth-getlogs).
- When you call this method targeting a contract that has emitted events, you'll get a list of objects that look like this:
    ```json
    {
        "address": "0x5ed888caec1ea5f6bc9a7d06e2e81b64a3a34977",
        "blockHash": "0xbcb02dad854354d168372bdbb27fd028893c42ba2a580671f0ad14c044ff05cc",
        "blockNumber": "0x1091904",
        "data": "0x0000000000000000000000007a580af1ca28d91c905e083071bb72b46c5dfc0d",
        "logIndex": "0x0",
        "removed": false,
        "topics": [
            "0xf40fcec21964ffb566044d083b4073f29f7f7929110ea19e1b3ebe375d89055e"
        ],
        "transactionHash": "0x530a7f0a9e569ec58c07d98c7a79d45ced27f2818e317167d36453a82c79d8cf",
        "transactionIndex": "0x0",
        "transactionLogIndex": "0x0",
        "type": "mined"
    }
    ```
    - This is actually the response received after deploying the working contract for this code stage!
- Some of these properties may seem familiar, and some may seem like gibberish at the moment!
- The two most important properties we'll discuss are data and topics.
#### Data
- The **data** is the part we are most interested in right now.
    - You'll notice that the goal of this coding stage is to create and emit a ``Deployed`` event with a single address argument:
    ```solidity
    emit Deployed(0x7a580af1ca28d91c905e083071bb72b46c5dfc0d);
    ```
    - This would actually produce the same ``data`` as shown above. Notice that the data contains this address.
#### Topics
- Typically, events have **at least one** topic.
    - This one topic, in particular, is the hash of the event signature.
- In the case of this code stage, it would be the **Keccak-256** hash of ``Deployed(address)``, which is the ``"f40fcec…"``, the same value as the first **topics** value.
- Having the event as a topic allows us to quickly filter for ``Deployed(address)`` events.
- We can also change the values inside of the event topics themselves, so we can filter on events that have occurred for a particular address, for instance.
    - We'll talk about how to do this on the last stage of the lesson.
>  It is possible to have no topics, using an **anonymous** event. You can simply add the ``anonymous`` keyword to the event signature. It will save gas, but it will make it difficult to distinguish between events.
#### Further Reading
- To learn more about logs on the EVM, check out this guide on [Understanding Logs: Deep Dive into eth_getLogs](https://docs.alchemy.com/docs/deep-dive-into-eth_getlogs).

#### Your Goal: Deployed Event
1. Create a new ``event`` called ``Deployed``. This event should take one argument: an ``address``.
1. This address will be the first **owner** of this collectible. The owner in this case will be the address that deployed the contract.
1. Create a public ``constructor``. In this constructor, emit the ``Deployed`` event with the owner's address as the argument.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Collectible {
    event Deployed(address _address);

    constructor() {
        emit Deployed(msg.sender);
    }
}
```
---

### Transfer
#### Multiple Arguments
- It's possible to pass **3** to an event just like a function:
    ```solidity
    event ExampleEvent(
        uint _exampleArgument,
        bool _exampleArgument2
    );
    ```
- Then we can invoke it the same way we would with one argument:
    ```solidity
    emit ExampleEvent(3, true);
    ```
#### Named Arguments
- In event declarations, you are free to name your arguments if you'd like.
- You can also choose to leave the names out:
    ```solidity
    // unnamed parameters
    event ExampleEvent(uint, bool);
    // keep the names in
    event ExampleEventNamed(
        uint _exampleArgument,
        bool _exampleArgument2
    );
    ```
    - You might be wondering, what's the difference?
- The main difference comes in the ABI.
- For the first event you'll see its ABI inputs look like this:
    ```json
    [
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }
    ]
- While the second example, as you might expect has name filled out:
    ```json
    [
        {
            "indexed": false,
            "internalType": "uint256",
            "name": "_exampleArgument",
            "type": "uint256"
        },
        {
            "indexed": false,
            "internalType": "bool",
            "name": "_exampleArgument2",
            "type": "bool"
        }
    ]
    ```
- At the end of the day, naming the parameters is for the convenience of the developer who will be querying the data.
    - When using a library like ethers.js, it will generally parse the ABI and match up the returned event data with the argument names provided here.
>  For our testing, we'll mostly use the **order** of the event arguments you send back to verify the data is correct. For example in the goal of the stage, you'll need to pass the original owner of the collectible back first. This will distinguish it from the new owner, which is also an address type. So feel free to leave the names off!

#### Your Goal: Transfer the Collectible
1. Create a new event called ``Transfer`` which has two ``address`` parameters: the original owner and the new owner.
1. Create an external function called ``transfer`` which takes a recipient ``address`` to send the collectible to. In this function, transfer the ownership of the collectible to the recipient.
1. Then, emit the ``Transfer`` event with the original owner's address and the new owner's address as arguments (be sure to specify the event arguments in that order).
1. Ensure that the person calling this function **is the current owner** of the collectible. Otherwise, revert the transaction.
> The owner of the collectible should be initially set as the deployer of the contract. You'll need to store this value into a state variable from the constructor so you can check for it in this function.

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Collectible {
    address owner;

    event Deployed(address);
    constructor() {
        owner = msg.sender;
        emit Deployed(msg.sender);
    }

    event Transfer(address, address);
    function transfer(address recipient) external {
        require(owner == msg.sender);
        owner = recipient;
        emit Transfer(msg.sender, recipient);
    }
}
```
---


### Up for sale
#### Your Goal: Mark the Price
1. Create a new event called ``ForSale`` which takes two ``uint`` parameters: the price and the current block timestamp.
1. Create a new external function called ``markPrice`` which has a single ``uint`` parameter: the asking price.
1. Inside the ``markPrice`` function, emit the ``ForSale`` event with the price and block timestamp as its arguments. HINT: ``block.timestamp`` is a [global variable](https://docs.soliditylang.org/en/v0.8.17/cheatsheet.html#global-variables)
#### Function Security
- Ensure that the person calling this function is the current owner of the collectible. Otherwise, revert.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Collectible {
    address owner;
    uint price;

    event Deployed(address);
    constructor() {
        owner = msg.sender;
        emit Deployed(msg.sender);
    }

    event Transfer(address, address);
    function transfer(address recipient) external {
        require(owner == msg.sender);
        owner = recipient;
        emit Transfer(msg.sender, recipient);
    }

    event ForSale(uint, uint);
    function markPrice(uint _price) external {
        require(msg.sender == owner);
        price = _price;
        emit ForSale(price, block.timestamp);
    }

    event Purchase(uint, address);
    function purchase() external payable {
        require(msg.value>=price);
        (bool success, ) = owner.call{ value: msg.value}('');
        require(success);
    }
}
```
---

### Sale
#### Your Goal: Make a Purchase!
1. Create an event called Purchase which takes two arguments: a uint for the purchase amount, and an address for the buyer.
1. Create an external, payable function purchase which allows a buyer to purchase the collectible at the asking price.
1. To make this purchase happen you'll need to do 3 things:
    1. Transfer the msg.value to the seller.
    1. Transfer the ownership to the buyer.
    1. Mark the collectible as not for sale any longer.
    1. Emit a Purchase event.
- **Reminder** - To send ether, you can use the ``.call`` syntax. Let's say we're trying to send the ``msg.value`` to an address called ``anAddress``:
    ```solidity
    (bool success, ) = anAddress.call{ value: msg.value }("");
    require(success);
    ```
#### Function Security
1. Ensure that the value sent matches the price. It it doesn't, revert the transaction. We don't want to allow someone to buy this for cheaper than the asking price!
1. Ensure that the collectible was marked for sale prior to this transaction. If it wasn't, revert the transaction.
> The default value for a uint is 0. If you store the price in a uint you can use this as the not-for-sale default value. We will not call this function for a "free purchase".

---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Collectible {
    address owner;
    uint price;

    event Deployed(address);
    constructor() {
        owner = msg.sender;
        emit Deployed(msg.sender);
    }

    event Transfer(address, address);
    function transfer(address recipient) external {
        require(owner == msg.sender);
        owner = recipient;
        emit Transfer(msg.sender, recipient);
    }

    event ForSale(uint, uint);
    function markPrice(uint _price) external {
        require(msg.sender == owner);
        price = _price;
        emit ForSale(price, block.timestamp);
    }

    event Purchase(uint, address);
    function purchase() external payable {
        require(msg.value==price);
        require(price > 0);
        price = 0;
        (bool success, ) = owner.call{ value: msg.value}('');
        require(success);
        owner = msg.sender;
        emit Purchase(msg.value, msg.sender);
    }
}
```
---

### Indexed
- We can make it easy to filter on event arguments by adding an ``indexed`` keyword:
    ```solidity
    event HighScore(address indexed player);
    ```
- Now we can filter for both the ``HighScore`` event as well as the ``address`` of the player.

#### Indexing
- Underneath the hood, the Solidity events use the EVM opcodes ``LOGx`` where ``x`` is the number of **topics**.
    - It can be any number from ``0`` to ``4``.
- For all the previous stages, we have been using LOG1 underneath the hood. Can you figure out why?
- As mentioned in the first coding stage, the first topic is hash of the event signature.
    - This makes it easy for us to filter for events.
- We can also add our own topics through the use of indexed:
    ```solidity
    event Transfer(
        address indexed owner,
        address indexed beneficiary1,
        address indexed beneficiary2,
    )
    ```
    - In this case we would be using ``LOG4`` because we have three topics: the hash of the event signature and the three addresses.
    - This is the most topics allowed on any log.
- Now we can specify the **topics** on the ``eth_getLogs`` method through the [JSON-RPC API](https://docs.alchemy.com/reference/eth-getlogs) to look for events involving a particular address.
- For instance, if we wanted to know all Transfer events involving 0x7a580af1ca28d91c905e083071bb72b46c5dfc0d, we could first hash our Transfer signature:
    ```solidity
    keccak256("Transfer(address,address,address)");
    ```
- Take that result and the address above and pass them as parameters to eth_getLogs:
    ```json
    params: [{
    "topics": [
        "0x3b5c651dbcca6f936576130d201fbc5f5a2c3568820a6d9b2987ea2b7fc91b32",
        "0x0000000000000000000000007a580af1ca28d91c905e083071bb72b46c5dfc0d"
        ]
    }]
    ```
    - You'll notice that the address is left-padded with zeroes.
        - Topics are expected as 32 byte hexadecimal strings. The address is only 20 bytes long, so we pad it with zeroes.

#### Your Goal: Index the Addresses
- Modify all the ``address`` data types in the events to be indexed.
---
**SOLUTION**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Collectible {
    address owner;
    uint price;

    event Deployed(address indexed);
    constructor() {
        owner = msg.sender;
        emit Deployed(msg.sender);
    }

    event Transfer(address indexed, address indexed);
    function transfer(address recipient) external {
        require(owner == msg.sender);
        owner = recipient;
        emit Transfer(msg.sender, recipient);
    }

    event ForSale(uint, uint);
    function markPrice(uint _price) external {
        require(msg.sender == owner);
        price = _price;
        emit ForSale(price, block.timestamp);
    }

    event Purchase(uint, address indexed);
    function purchase() external payable {
        require(msg.value==price);
        require(price > 0);
        price = 0;
        (bool success, ) = owner.call{ value: msg.value}('');
        require(success);
        owner = msg.sender;
        emit Purchase(msg.value, msg.sender);
    }
}
```
---