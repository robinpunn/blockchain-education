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

### Up for sale
1. Create a new event called ``ForSale`` which takes two ``uint`` parameters: the price and the current block timestamp.
1. Create a new external function called ``markPrice`` which has a single ``uint`` parameter: the asking price.
1. Inside the ``markPrice`` function, emit the ``ForSale`` event with the price and block timestamp as its arguments. HINT: ``block.timestamp`` is a [global variable](https://docs.soliditylang.org/en/v0.8.17/cheatsheet.html#global-variables)