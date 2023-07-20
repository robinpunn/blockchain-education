## Slot 2

---
### Table of Contents
1. [Block 1](#block-1)
    1. [Solidity](#1-solidity)
    2. [Influence](#2-influence)
    3. [Features](#3-features)
    4. [Layout](#4-layout)
    5. [SPDX](#5-spdx)
    6. [Pragma Keyword](#6-pragma-keyword)
    7. [Version](#7-version)
    8. [ABI Coder](#8-abi-coder)
    9. [Experimental](#9-experimental)
    10. [Imports](#10-imports)
    11. [Comments](#11-comments)
    12. [NatSpec](#12-natspec)
    13. [Contracts](#13-contracts)
    14. [Contracts 2](#14-contracts-2)
    15. [Variables](#15-variables)
    16. [State Visibility](#16-state-visibility)
    17. [State Mutibility](#17-state-mutability)
    18. [Mutability and Gas](#18-mutability-and-gas)
    19. [Functions](#19-functions)
    20. [Parameters](#20-parameters)
---

### [Block 1](https://www.youtube.com/watch?v=5eLqFac5Tkg)
#### 1. Solidity
- Solidity is a high level programming language used to write smart contracts on Ethereum
- Smart contracts target the underlying EVM
- Proposed in 2014 by Gavin Wood...was letter developed and has continued to be developed by the Ethereum solidity team
- A fundamental pillar to smart contracts on Ethereum as there are few alternatives
#### 2. Influence
- Solidity is mainly influenced by C++
	- Also some inspiration from Python and JavaScript
- A lot of the syntax and OOP concepts are influenced by C++
- The use of modifiers, inheritance, the use of super keyword, etc. are influenced by Python
- Early in it's life, Solidity was influenced by JavaScript through concepts like function scoping, var keyword... these influences have significantly been reduced since 0.4.0.
#### 3. Features
- Solidity is curly bracket language
- It is an object-oriented language
- It is statically typed
- Because of OOP, there is the use of inheritance, reusable code in the form of libraries, and user defined types
- Fully featured high level language that lets us define complex logic in smart contracts allowing us to leverage all the features of the EVM
#### 4. Layout
- The physical layout of a smart contract is important to understand
- A solidity source file an contain an arbitrary number of directives and primitives
	- Pragma/Import directives
	- Declarations of Structs/Enums
	- Contract defintions
- Every contract can contain: Struct/Enum, State variables, Events, Errors, Modifiers, Constructor, Functions 
- The physical layout is specific to the syntax of solidity 
#### 5. SPDX
- Often seen at the top of a Solidity file: SPDX License Identifier
	- Software Package Data Exchange
	- A comment that indicates the license
	- Specified as a best practice to be at the top of every file
- ``SPDX-License-Identifier: AGPLv3``
- Included by the compiler in the bytecode metadata so it becomes machine readable
#### 6. Pragma Keyword
- The ``pragma`` keyword is used to enable certain compiler features/checks
	- ``pragma solidity ^0.8.0;``
- There are two types of pragmases
	- The first kind specifies version... there are two types of version that can be specified
		- Version (of the compiler)
		- ABI coder (v1/v2... declared by pragma directory)
	- The second pragma directive helps  the developer to specify the use of any experimental features  
		- SMTChecker
- The pragma directive is local to the file where the are specified
	- pragma does not automatically carry over when a file is imported
#### 7. Version
- Version pragma indicates the specific Solidity compiler version that the developer expects to be used for that source file 
	- ``pragma solidity x.y.x``
		- x, y, and z are numerals that specify the complier version
- Instructs the compiler at compilation time to check whether its version matches the one specified by the developer
	- can be of several formats: simple, complex, floating
- z indicated bug fixes
- y indicates breaking changes
- software products use semver that have major/minor patch versioning
- a floating pragma has a caret symbol prefix to x.y.z 
	- it indicates that contracts can compiled with versions starting with x.y.z al the way up the x.y+1.z
	- ``pragma solidity ^0.8.3``: can use anything starting at 0.8.3 and up (0.8.4,0.8.5), but not 0.9.z
- a range of compiler versions can be indicated with complex pragma using operator symbols to combine multiple versions
- affects the compiler version which in turn brings in different features and optimizations
#### 8. ABI Coder
- The second version pragma directive is what applies to the ABI coder
	- Allows the developer to specify the choice between version 1 or version 2
- Version 2 is activated by default and it allows the encode/decode of nested arrays and structs
- v2 is a superset of v1
	- contracts that use v2 can interact with contracts that use v1
#### 9. Experimental
- The next version pragma is the experimental pragma
	- Used to specify features that are considered experimental
	- These features aren't enabled by default and have to be explicitly specified
- SMTChecker is an experimental feature (satisfiable? modulo theory)
	- not enabled by default
	- used to implement safety checks ( querying an smt solver)
- There are various safety checks performed by the SMTChecker
	- require/assert: the checker considers all the require statements specified  as assumptions by the developer and it tries to prove that the conditions inside the assert statements are true
		- If a failure can be established the checker provides a "counter example" that shows the user how the assertion can fail
	- various checks have been added over time: overflow/underflow, division by 0, unreachable code, etc.
- SMTChecker is implemented in the compiler
- Affects: security and optimizations of the contract
#### 10. Imports
- Import statements are similar to JavaScript: ``import filename;``
- Helps to modularize code, create reusable code
- Affects: readability, security, and optimization
#### 11. Comments
- Single line: //
- Multi-line: / * ... * /
- Comments are used as inline documentation of what the contracts are supposed to do
- Affect: Readability, maintainability 
#### 12. NatSpec
- Solidity supports a special type of comment called NatSpec: Ethereum Natural Language Specification Format
	- Specialized comments that are specific to Ethereum and Solidity
- Written directly above function declaration or statements:
	- /// or //** .. * /
- Have many different tags: @title, @author, @notice, @dev, @param, @return, etc
	- Automatically generates JSON documentation for developers and users
#### 13. Contracts
- Smart contracts are fundamental to what Ethereum is all about
- They are similar to classes in OOP
- They encapsulate state in the form of variables and logic that allows modification of state in the form of funtions
- Contracts can inherit and interact with other contracts
- Smart contracts are a fundamental primitive of Ethereum
#### 14. Contracts 2
- Contracts can contain different components
	- Struct/Enum, state variables, events, errors, modifiers, constructors, functions
- Contracts can come in different types
	- Vanilla contracts
	- Libraries
	- Interfaces
#### 15. Variables
- State variables can be accessed by all contract functions
- Data location for state variables is contract storage (non-volatile storage)
	- State variables persist across transactions
#### 16. State Visibility
- State variables have a concept of visibility
- Visibility specifiers indicate who can see state variables and who can access them
- There are three types:
	- public: part of the contract interface
		- can be accessed internally from the contract or from outside the contract via messages
		- an automatic getter function is generated by the compiler
			- this function can be used to access the value of public state variables
	- internal: can only be accessed internally from within the current contract or contracts deriving rom this contract
	- private: can only be accessed from within the contract they are defined in and not even from the contracts they are derived from
		- All variables can be looked at and queried off chain, private just prevents other contracts from reading the variables onchain
#### 17. State Mutability
- Indicates when state variables can be modified and the rules for modification
- Two specifiers: constant and immutable
- constant: fixed at compile time 
	- have the same value as when they were declared for the life of the contract
- immutable: fixed at construction time
	- assigned values within the constructor of the contract or at the point of declaration
	- they cannot be read during construction time and they can only be assigned once
- constant and immutable variables allow the solidity compiler  to prevent reserving any storage slots for these variables
	- this property makes these variables storage and gas efficient
#### 18. Mutability and Gas
- Compared to regular state variables, the gas cost of constant and immutable variables are lower
- The expression assigned to a constant variable is copied to all the places where it is accessed within the contract and reevaluated each time
	- This aspect allows the Solidity compiler to make some local optimizations where ever constant variables are used
- Immutable state variables are only evaluated once at construction time and then the value is copied to all the places in the code where they are used
	- 32 bytes are reserved even if they require fewer bytes, and due to this aspect the constant variables can sometimes be cheaper than the immutable ones
- The only supported types for these variables are strings and value types
#### 19. Functions
- Executables units of code usually defined inside a smart contract... can also be defined outside of the contracts
- Functions defined outside of the contract are referred to as free functions
- Functions allows the modification of state
- How logic manifests itself within smart contracts
- State transitions from an initial state to a modified state as a result of transactions or messages that interact with the smart contract
#### 20. Parameters
- Functions typically specify parameters
- They are treated and declared just like variables
- Parameters are how the caller of the functions sends data into the function
- Used/assigned similar to local variables within the function
- The function specifies the parameter, the caller sends in arguments that get assigned to these parameters in the context of the function