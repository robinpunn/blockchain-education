## Solidity Governance

---
### Table of Contents
1. [Proxy Contracts](#proxy-contracts)
    - [Storage Slots](#storage-slots)
        - [What is contract storage layout and why does it matter?](#what-is-contract-storage-layout-and-why-does-it-matter)
        - [How is memory used in the EVM?](#how-is-memory-used-in-the-evm)
            - [Solidity Memory Types](#solidity-memory-types)
        - [What is storage memory?](#what-is-storage-memory)
        - [How are state variables stored in smart contract storage slots?](#how-are-state-variables-stored-in-smart-contract-storage-slots)
        - [What is Endian-ness?](#what-is-endian-ness)
            - [How is Endian-ness used in Ethereum?](#how-is-endian-ness-used-in-ethereum)
        - [How are state variables padded and packed in smart contract storage slots?](#how-are-state-variables-padded-and-packed-in-smart-contract-storage-slots)
        - [How are user-defined types (structs) stored in contract memory?](#how-are-user-defined-types-structs-stored-in-contract-memory)
        - [How are statically-sized variables stored in memory?](#how-are-statically-sized-variables-stored-in-memory)
        - [How are dynamically-sized state variables stored in smart contract memory?](#how-are-dynamically-sized-state-variables-stored-in-smart-contract-memory)
        - [How are mappings stored in smart contract storage?](#how-are-mappings-stored-in-smart-contract-storage)
    - [Delegatecall](#delegatecall)
        - [Communication](#communication)
        - [Calldata](#calldata)
        - [Call](#call)
        - [Delegatecall](#delegatecall-1)
            - [Use cases](#use-cases)
    - [Evolution of Proxies](#evolution-of-proxies)
        - [Proxy Patterns](#proxy-patterns)
        - [Inherited Storage](#inherited-storage)
        - [External Storage](#external-storage)
        - [Unstructured Storage](#unstructured-storage)
        - [Fallback](#fallback)
        - [Delegatecall](#delegatecall-2)
        - [History](#history)
        - [Pros and Cons](#pros-and-cons)
        - [Suggested Reading](#suggested-reading)
2. [Libraries](#Libraries)
    - [Introduction to Libraries](#introduction-to-libraries)
    - [1. Deployed Inline](#1-deployed-inline)
    - [2. Deployed Separately](#2-deployed-separately)
---

### Proxy Contracts
#### [Storage Slots](https://docs.alchemy.com/docs/smart-contract-storage-layout#how-is-memory-used-in-the-evm)
- This guide will explain how data stored on smart contracts. 
    - Contract storage layout refers to the rules governing how contracts’ storage variables are laid out in long-term memory.

##### What is contract storage layout and why does it matter?
- Contract storage layout refers to the rules governing how contracts’ storage variables are laid out in long-term memory. 
    - Almost all smart contracts have state variables that need to be stored long-term.
- Understanding contract storage layout is important for:
    - writing gas-efficient contracts as storing data in long-term memory on the blockchain is expensive.
    - working with contracts that use design patterns such as a proxy or a diamond pattern or other various patterns.
    - security auditing a contract. Not understanding contract storage layout rules might leave our contracts vulnerable.
- In addition to the public functions and variables we define to make up our contract’s external interface, the layout of state variables is also considered to be part of the external interface as well.
- Smart contract developer’s do not have direct control over this aspect of their contract’s external interface, it is controlled by the compiler. 
    - However, if the compiler version changes and the rules of contract storage layout were to change, a developer would need to be aware of this.

##### How is memory used in the EVM?
- Smart contracts are computer programs that run on blockchains.
    - Programs consist of functions and data (also known as variables or parameters) that functions operate on.
    - The data that functions use need to be stored somewhere in the computer’s memory.
    - In this case the computer is the EVM.
###### Solidity Memory Types
- There are 3 different types of memory in Solidity that developers can use to instruct the EVM where to store their variables: memory, calldata, and storage.
- There are also rules about how long the variable’s memory location will be valid as well as rules about how the variable can be used.
    - For example, can the variable be read? Can the variable be written to?
1. **Memory**
- Developers use the memory keyword for variables and parameters that are used within a function.
    - These types of variables only exist during the lifetime of a function being executed.
    - When a function finishes running, the variables and parameters stored in the memory area go away.
    - For those with programming backgrounds memory is the type of memory that most people are familiar with.
2. **Calldata**
- The calldata memory type is very similar to the memory type and must be used when declaring an external function’s dynamically-sized parameters that make up a function’s signature.
- The difference between memory variables and calldata variables is that calldata variables reference an area of memory that is read-only.
3. **Storage**
- The final type of memory in Solidity is the storage type.
    - Storage memory is a contract’s long-term memory area that stores variables after a function or a transaction is done executing.
- The EVM rules about how storage variables are laid out is the focus of this article.
- The idea of long-term memory storage is in stark contrast to the other two memory types.
    - A contract’s state variables (i.e. variables declared inside a contract, but not inside a function) are stored in the storage memory area.
- The concept of the storage memory type is unique to blockchains, because when working with smart contracts, stored data is tamper-proof via cryptographic-sealing properties that blockchains give us.
    - In other programming environments, if we want to store variables long-term, we usually off-load this work to a filesystem or database.
    - But in blockchain, a smart contract’s code and data are both persisted together long-term on the blockchain.

##### What is storage memory?
- Each contract gets its own storage area which is a persistent, read-write memory area.
    - Contract’s can only read and write from their own storage.
    - A contract’s storage is divided up into 2²⁵⁶ slots of 32 bytes each.
    - Slots are contiguous and are referenced by indexes, starting at 0 and ending at 2²⁵⁶.
    - All slots are initialized to a value of 0.
- EVM storage memory is only directly accessible by these 32 byte slots.
**2²⁵⁶ slots!**
- Each contract’s storage area has more slots than all the stars in the universe. We’re dealing with truly astronomical proportions here.
- Because of the immense storage size a contract’s storage can be considered virtual.
    - What that means is, that if you were to read a random slot, it will most likely be empty/uninitialized.
    - Reading such a slot will return a value of 0.
    - The EVM is not actually storing all these 0s, but it keeps track of which slots are in use and which are not.
    - When you access an unused slot the EVM knows that and will return 0.
**Why did the designers of the EVM give contracts such a large storage area?**
- The reason the contract storage area is so large has to do with state variables of dynamic size and how hashes are used to calculate state variables’ storage slots.

##### How are state variables stored in smart contract storage slots?
- Solidity will automatically map every defined state variable of your contract to a slot in storage in the order the state variables are declared, starting at slot 0.
- A simple visualization of this idea is show here:
![storage](https://files.readme.io/e316e25-diagram-mapping-contract-state-variables-to-storage-slots.jpeg)
- Here we can see how variables a, b and c get mapped from their declaration order to their storage slots.
    - To see how the storage variables actually get encoded and stored in the slots at the binary level we need to dig a little deeper and understand the concepts of endian-ness, byte-packing and byte-padding.

##### What is Endian-ness?
- Endian-ness refers to how computers store multi-byte values in memory (eg: uint256, bytes32, address), and there are two types of endian-ness: big-endian and little-endian.
    - Big-endian → last byte of binary representation of data type is stored first
    - Little-endian → first byte of binary representation of data type is stored first
- For example take the hexadecimal number 0x01e8f7a1, a hexadecimal representation of the decimal number 32044961.
    - How is this value stored in memory?
    - Visually it will look like one of the diagrams below depending on the endian-ness.
![endian](https://files.readme.io/a21dcf5-diagram-of-big-endian-and-little-endian-storage-layouts-in-solidity-smart-contracts.jpeg)

###### How is Endian-ness used in Ethereum?
- Ethereum uses both endian-ness formats, and the format used depends on the variable type.
    - Big-endian is only used for bytes and string types.
        - These 2 types behave differently in a contract’s storage slots than other variables.
    - Little-endian is used for every other type of variable.
        - Some examples are: uint8, uint32, uint256, int8, boolean, address, etc…

##### How are state variables padded and packed in smart contract storage slots?
- To store variables that require less than 32 bytes of memory in storage, the EVM will pad the values with 0s until all 32 bytes of the slot are used and then store the padded value.
- Many variable types are smaller than the 32 byte slot size, eg: bool, uint8, address.
    - Here is a diagram of what it looks like when we want to store state variables of types requiring less than 32 bytes of memory:
![padded](https://files.readme.io/89ce3ce-diagram-of-how-the-ethereum-virtual-machine-pads-state-variables-that-need-less-than-32-bytes-of-memory.jpeg)
- Due to EVM padding, developer’s can directly address the state variables a and c at the cost of wasting a lot of expensive storage memory.
    - The EVM stores the variables in a way that minimizes the cost of reading/writing the values at the expense of the amount of memory used.
- If we think carefully about the sizes of our contracts’ state variables and their declaration order, the EVM will pack the variables into storage slots to reduce the amount of storage memory that is used.
    - Taking the ``PaddedContract`` example above we can reorder the declaration of the state variables to get the EVM to tightly pack the variables into storage slots.
- An example of this is shown in the ``PackedContract`` below which is just a reordering of the variables in the ``PaddedContract`` example:
![packed](https://files.readme.io/058295a-diagram-of-a-packed-contract-example-where-variables-are-packed-into-storage-slots-to-reduce-storage-memory.jpeg)
- The EVM will pack variables within a slot starting at the right of the slot, moving left for each subsequent state variable that can be packed into the same slot.
    - Here we can see that the variables a and c have been packed into storage slot 0.
    - Because the size of variable b cannot fit into the remaining space in slot 0, the EVM assigns variable b to slot 1.
- In contrast to padding variables, packing minimizes the amount of storage used at the expense of reading/writing these variables.
    - The extra reading and writing costs come from the fact that extra bitwise operations will need to be done to read a and c.
    - For example, to read a the EVM will need to read storage slot 0 and then bitmask out all bits not belonging to variable a.
- The storage gas savings of tightly packing variables can significantly increase the cost of reading/writing them if the packed variables are not usually used together.
    - For example, if we need to read c very often without reading a it might be best to not tightly pack the variables.
    - This is a design consideration developers must take into account when writing contracts.

##### How are user-defined types (structs) stored in contract memory?
- In scenarios where we have a group of variables that logically belong together and are often read and written as unit, we can define a user-defined type via Solidity’s struct keyword and apply the above knowledge of byte-packing to get the most efficient gas-usage regarding storage usage and reading and writing of storage variables.
![structs](https://files.readme.io/3e9dfc1-diagram-of-how-user-defined-structrs-are-packed-and-stored-in-smart-contract-storage-memory.jpeg)
- Now we have the benefit of tight byte-packing and grouped reading/writing of the state variable someStruct.

##### How are statically-sized variables stored in memory?
- Statically-sized state variables are stored in their corresponding slots.
    - If a statically-sized variable is 2 slots in size (64 bytes) and stored at slot s, then the following storage variable will be stored at slot s + 2.
- For example, the storage layout of the state variables in the following contract:
![static](https://files.readme.io/c9c107b-diagram-of-how-statically-sized-variables-are-stored-in-smart-contract-storage-memory.jpeg)

##### How are dynamically-sized state variables stored in smart contract memory?
- Dynamically-sized state variables are assigned slots in the same way as statically-sized state variables, but the slots assigned to dynamic state variables are only marker slots.
    - That is, the slots mark the fact that a dynamic array or mapping exists, but the slot doesn’t store the variable’s data.
- For a [dynamically-sized variable](https://www.alchemy.com/overviews/solidity-arrays), why isn’t its data stored directly in its assigned slot the same way that it works for statically-sized variables?
- Because if new items are added to the variable it will require more slots to store its data, meaning subsequent state variables would have to be pushed down to further slots.
- By using the ``keccak256 hash`` of the marker slot, we can take advantage of the enormous virtual storage area we have to store variables without the risk of a dynamically-sized variable growing and overlapping with other state variables.
- For a dynamically-sized array, the marker slot also stores the array’s length.
    - The keccak256 hash of the marker slot number is a ‘pointer’ to where the array’s values live in the contract’s storage layout.
![dynamic](https://files.readme.io/388c33b-diagram-of-how-dynamically-sized-variables-are-stored-in-storage-memory-using-keccak256-hashing.jpeg)

##### How are mappings stored in smart contract storage?
- For [mappings](https://www.alchemy.com/overviews/solidity-mapping), the marker slot only marks the fact that there is a mapping.
    - To find a value for a given key, the formula keccak256(h(k) . p) is used where:
        - the symbol . denotes string concatenation
        - p is the state variable’s declaration position in the smart contract
        - h()is a function that is applied to the key depending on the key’s type
        - for value types, h() returns the padded the value to 32 bytes
        - for strings and byte arrays, h() just returns the unpadded data
- Here is an diagram depicting how mappings are stored in memory:
![mapping](https://files.readme.io/c4ba494-diagram-of-how-mappings-are-stored-in-storage-memory-using-keccak256-hashing.jpeg)

#### Delegatecall
- The ``<address>.delegatecall`` method is critical to our understanding of proxies

##### Communication
![comm](https://i.ibb.co/MBvV606/comm.png)
- Our program lives on the blockchain in bytecode form
    - We write our program in Solidity, and it gets compiled into the bytecode that lives on the blockchain
- When a EOA(externally owned account) interacts with the contract, it goes through steps such as signing a transaction
    - the calldata and transaction performed by the EOA interacts with our smart contract

##### Calldata
![calldata](https://i.ibb.co/jwMjzXF/calldata.png)
- Calldata is the function signature + arguments
    - When data is encoded to a smartcontract, this is how it is done for solidity

##### Call
![messagecall](https://i.ibb.co/jZTXZww/message-Call.png)
- EOA uses the calldata with signed transaction
    - This information could be sent to contract A and contract A may interact with many other contracts during the transactions execution
- Interacting with contract A involves the "message context" which has three important values:
    - msg.sender: the EOA (person who signed the tx)
    - msg.value: the amount of Ether that was signed
    - storage: Contract A's storage
- Contract A makes the call to another contract
    - msg.sender is now Contract A
    - msg.value is based on how much contract A is sending
    - storage is based on new contract

##### Delegatecall
![delegatecall](https://i.ibb.co/ZM8JrKn/delegated-Call.png)
- Instead of using ``b.call{value:2.0}(calldata)``, using delegatecall: ``b.delegatecall(calldata)``
    - msg.sender is still the EOA
    - msg.value is the value that was encoded during the EOA transaction
    - storage is based on the inital contract a
- Using delegatecall, contract B is being interacted with while using Contract A's storage
- This allows new contracts to modify contract A's storage variables
    - not something that you want to use everywhere
###### Use cases
- The proxy contract implements logic on other contracts using the proxy storage
![proxy](https://i.ibb.co/DK8M90J/proxy.png)
- Upgrades
- Saving Gas

**[Minimal Proxy (clone)](https://eips.ethereum.org/EIPS/eip-1167)**
- save on gas by deploying one implementation and delegating to it

**Upgrade Implementation**
- we can't upgrade new code to a smart contract address
- using a proxy, we can delegatecall to an upgraded contract.
    - version 1 would still exist, but the proxy contract would deteremine which contract users interacted with

#### Evolution of Proxies
- Proxy contracts in Solidity have undergone significant evolution as developers have sought to create a more upgradeable and maintainable smart contract infrastructure.
    - The concept of a proxy contract is such that all message calls go through a proxy contract that will redirect them to the latest deployed contract logic.
    - Developers can set up a proxy contract architecture that will allow them to use new deployed contracts as if their main logic had been upgraded.

##### Proxy Patterns
- There are several proxy patterns that developers can use to achieve upgradeability, and each has its own advantages and disadvantages.
- The three options explored by Zeppelin are:
    - Upgradeability using Inherited Storage
    - Upgradeability using Eternal Storage
    - Upgradeability using Unstructured Storage

##### Inherited Storage
- In the Inherited Storage approach, the logic contract incorporates the storage structure required by the proxy.
    - Both the proxy and the logic contract inherit the same storage structure to ensure that both adhere to storing the necessary proxy state variables.
    - This approach relies on having a Registry contract to keep track of the different versions of your logic contract

##### External Storage
- In the Eternal Storage pattern, the storage schemas are defined in a separate contract that both the proxy and logic contract inherit from.
    - The storage contract holds all the state variables the logic contract will need, and since the proxy is aware of them too, it can define its own state variables necessary for upgradeability without the concern of them being overwritten

##### Unstructured Storage
- The Unstructured Storage pattern is similar to Inherited Storage but doesn’t require the logic contract to inherit any state variables associated with upgradeability.
    - This pattern uses an unstructured storage slot defined in the proxy contract to save the data required for upgradeability.
    - By using this pattern, none of the logic contract versions have to know about the storage structure of the proxy, however all future logic contracts must inherit the storage variables declared by their ancestor versions

##### Fallback
- When a function call to a contract is made that it does not support, the fallback function will be called.
    - The proxy contract uses a custom fallback function to redirect calls to other contract implementations.
    - If the logic contract relies on its constructor to set up some initial state, this has to be redone after the proxy upgrades to your logic contract.
    - A common pattern for upgrading the proxy contract is that the proxy to immediately call an initialize method on the logic contract

##### Delegatecall
- Zeppelin’s Proxy contract, shared by all proxy patterns, implements its own delegatecall function which returns the value that resulted in calling the logic contract.
    - In the Inherited Storage and Unstructured Storage patterns, future upgraded token logic contracts can upgrade existing functions as well as introduce new functions and new storage variables.
    - In the Eternal Storage pattern, all future versions of the logic contract should not define any other state variable.
    - All versions of the logic contract must always use the eternal storage structure defined in the beginning

##### History
- Proxies in Solidity have undergone several changes and improvements over the years.
- Here's a brief overview of their evolution:
1. **Solidity version 0.4.x**
    - The first implementation of proxies in Solidity was based on the delegatecall opcode, which allowed contracts to execute code from another contract without changing their own state.
    - This technique was used to implement proxy contracts that acted as "forwarders" to a target contract.
2. **Solidity version 0.5.x**
    - In this version, the delegatecall opcode was replaced with the more secure and gas-efficient staticcall opcode.
    - This required a new approach to implementing proxies, which led to the development of the "transparent proxy" pattern.
    - Transparent proxies use the fallback function to forward all calls to a target contract, while still allowing the proxy contract to be upgraded.
3. **Solidity version 0.6.x**
    - The introduction of the receive function in Solidity 0.6.x allowed for even more flexibility in implementing proxies.
    - The "minimal proxy" pattern was introduced, which creates a new contract that simply forwards all calls to a target contract.
    - This pattern is more gas-efficient than the transparent proxy pattern, as it does not require any storage for the target contract address.
4. **Solidity version 0.7.x**
    - This version introduced the "Diamond" pattern, which is a more advanced approach to implementing upgradeable contracts.
    - The Diamond pattern uses multiple proxy contracts to create a modular architecture that allows for more granular upgrades and better separation of concerns.

##### Pros and Cons
There are several benefits to using proxy contracts as an upgrade mechanism.
    - For example, proxy contracts allow developers to upgrade their smart contracts without having to migrate their data to a new contract.
    - Additionally, proxy contracts enable developers to fix bugs or add new features to their smart contracts without having to redeploy them from scratch.
- However, there are also some challenges associated with using proxy contracts, such as the need to carefully manage storage and the risk of introducing security vulnerabilities

##### Suggested Reading
- [Open Zeppelin](https://blog.openzeppelin.com/proxy-patterns/)
- [Upgradeable Smart Contracts](https://mvpworkshop.co/blog/upgradeable-smart-contracts-proxy-pattern/)
- [Proxy Patterns](https://dev.to/nvn/proxy-patterns-for-upgradeability-of-solidity-contracts-transparent-vs-uups-proxies-3ig2)

### Libraries
#### Introduction to Libraries
- Libraries are like contracts, but with some key differences!
    - When you deploy a library on its own, you cannot store storage variables on libraries and you can't send ether to them either.
    - However, not all libraries are deployed on their own.
    - Often times they are pulled into the smart contract bytecode directly by the compiler.
- Let's take a look at how they are being used by searching some of the more popular Solidity libraries.
    - Here's a search for the word library in the Uniswap v3-core repository: https://github.com/Uniswap/v3-core/search?q=library
    - Most of the libraries used by Uniswap v3 core contain utility functions, generally pure math calculations like this one:
    ```solidity
    // SPDX-License-Identifier: GPL-2.0-or-later
    pragma solidity >=0.5.0;

    /// @title Math library for liquidity
    library LiquidityMath {
        /// @notice Add a signed liquidity delta to liquidity and revert if it overflows or underflows
        /// @param x The liquidity before change
        /// @param y The delta by which liquidity should be changed
        /// @return z The liquidity delta
        function addDelta(uint128 x, int128 y) internal pure returns (uint128 z) {
            if (y < 0) {
                require((z = x - uint128(-y)) < x, 'LS');
            } else {
                require((z = x + uint128(y)) >= x, 'LA');
            }
        }
    }
    ```
- This is pretty standard in big smart contract repositories today!
    - These functions get pulled into the bytecode of whichever contract references them.
    - This is the most common way to use libraries today, although there's technically two ways to use them.

#### 1. Deployed Inline
- When all the functions you are using from a library function are marked as internal, they will be pulled directly into the smart contract bytecode by the solidity compiler.
    - These functions are being pulled inline with the contract and deployed together.
    - You'll see this is the case for the majority of libraries used today.

#### 2. Deployed Separately
- Deploying a library separately from your smart contract can be helpful in that it can help keep your smart contract below the 24kb limit, and also you can potentially share an on-chain library with other contracts, which can help ease your deployment burden.
    - The library can run code on behalf of a contract, much like a logic contract in our proxy/logic discussions.
    - This is because when we call an external function on a library, a ``delegatecall`` will be made.
- When a library is deployed separately, the compiler requires that you link the contract to the library you intend to deploy it with.
    - This process can be tricky and many people run into issues.
    - If you find yourself in this situation, check out **library linking** on [the hardhat docs](https://hardhat.org/hardhat-runner/plugins/nomiclabs-hardhat-ethers#library-linking) as well as [the solidity compiler docs](https://docs.soliditylang.org/en/v0.8.17/using-the-compiler.html?highlight=linking#library-linking).