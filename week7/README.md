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
---

### Proxy Contracts
#### [Storage Slots](https://docs.alchemy.com/docs/smart-contract-storage-layout#how-is-memory-used-in-the-evm)
- This guide will explain how data stored on smart contracts. 
    - Contract storage layout refers to the rules governing how contracts’ storage variables are laid out in long-term memory.

#### What is contract storage layout and why does it matter?
- Contract storage layout refers to the rules governing how contracts’ storage variables are laid out in long-term memory. 
    - Almost all smart contracts have state variables that need to be stored long-term.
- Understanding contract storage layout is important for:
    - writing gas-efficient contracts as storing data in long-term memory on the blockchain is expensive.
    - working with contracts that use design patterns such as a proxy or a diamond pattern or other various patterns.
    - security auditing a contract. Not understanding contract storage layout rules might leave our contracts vulnerable.
- In addition to the public functions and variables we define to make up our contract’s external interface, the layout of state variables is also considered to be part of the external interface as well.
- Smart contract developer’s do not have direct control over this aspect of their contract’s external interface, it is controlled by the compiler. 
    - However, if the compiler version changes and the rules of contract storage layout were to change, a developer would need to be aware of this.

#### How is memory used in the EVM?
- Smart contracts are computer programs that run on blockchains.
    - Programs consist of functions and data (also known as variables or parameters) that functions operate on.
    - The data that functions use need to be stored somewhere in the computer’s memory.
    - In this case the computer is the EVM.
##### Solidity Memory Types
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

#### What is storage memory?
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

#### How are state variables stored in smart contract storage slots?
- Solidity will automatically map every defined state variable of your contract to a slot in storage in the order the state variables are declared, starting at slot 0.
- A simple visualization of this idea is show here:
![storage](https://files.readme.io/e316e25-diagram-mapping-contract-state-variables-to-storage-slots.jpeg)
- Here we can see how variables a, b and c get mapped from their declaration order to their storage slots.
    - To see how the storage variables actually get encoded and stored in the slots at the binary level we need to dig a little deeper and understand the concepts of endian-ness, byte-packing and byte-padding.