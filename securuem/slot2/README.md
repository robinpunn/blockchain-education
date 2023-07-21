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
2. [Block 2](#block-2)
	21. [Return Variables](#21-return-variables)
	22. [Modifiers](#22-modifiers)
	23. [Function Visibility](#23-function-visibility)
	24. [Function Mutability](#24-function-mutability)
	25. [Function Overloading](#25-function-overloading)
	26. [Free Functions](#26-free-functions)
	27. [Events](#27-events)
	28. [Indexed Parameters](#28-indexed-parameters)
	29. [Emit](#29-emit)
	30. [Structs](#30-structs)
	31. [Enums](#31-enums)
	32. [Constructor](#32-constructor)
	33. [Receive Function](#33-receive-function)
	34. [Fallback Function](#34-fallback-function)
	35. [Statically Typed](#35-statically-typed)
	36. [Types](#36-types)
	37. [Value Type](#37-value-type)
	38. [Reference Type](#38-reference-type)
	39. [Default Values](#39-default-values)
	40. [Scoping](#40-scoping)
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

### [Block 2](https://www.youtube.com/watch?v=TCl1IcGl_3I)
#### 21. Return Variables
- Return variables are specified after the ``returns`` keyword
- Solidity functions can return single return variable or multiple variables
	- These variables can be named or unnamed
- Treated like local variables within the context of the function
- In the case of unnamed return variables, an explicit return statement needs to be used to return that variable as a return value that goes to the context of the caller function
- The caller calls the callee
	- The caller specifies arguments that get assigned to the respective parameters of the callee function
	- The callee function works with these parameters, implements logic, and returns values back to the caller
#### 22. Modifiers
- Function modifiers are something unique and specific to solidity
- They are declared using the modifier keyword
	- ``modifier mod() {Checks;_;}``
	- ``function foo() mod {}
		- ``mod -> foo()``
		- Whenever foo is called, it first goes to the modifier
- The modifiers implements some preconditions before the function's logic is executed
- If the ``_;`` is placed before the modifier logic, then the function the modifier is applied to gets executed before the modifier logic
- Very often used to implement access control checks
#### 23. Function Visibility
- Similar to state variables, functions also have the concept of visibility: public, internal, external, private
- ``public`` functions are part of the contract interface
	- can be called internally or via messages
- ``external`` functions are also part of the contract interface
	- can only be called from outside the contract
- ``internal`` functions can only be called inside the contract or inside contracts derived from the contract
- ``private`` functions can only be accessed within the contract where they are defined
- Visibility: Access control has security Implications
#### 24. Function Mutability
- Like state variables, functions have a concept of mutability
	- This affects what state they can read and modify
- There are two function mutability specifiers: view and pure
- ``view`` functions are only allowed to read state and they cannot modify
	- Enforced at the EVM level using STATICCALL opcode
	- There are various action considered to be state modifying that ``view`` functions cannot execute:
		- writing to state variables
		- emitting events
		- creating other contracts
		- using SELFDESTRUCT
		- sending ether to other contracts
		- calling other functions not marked view or pure
		- using low level calls and using inline assembly that contain certain opcodes
- ``pure`` functions cannot read or modify contract state
	- The inability to modify is enforced at the EVM level
	- The inability to read cannot be enforced by the EVM as there are no specific opcodes for that behavior
	- Actions that ``pure`` functions cannot execute:
		- reading from state variables
		- accessing the balance of contracts
		- accessing members of block transaction or message
		- calling other functions not marked pure
		- using inline assembly that contain certain opcodes
- Mutability: Write/Read has security implications
#### 25. Function Overloading
- Solidity supports the concept of function overloading
	- Supports multiple functions within a contract to have the same name but with different parameters
- Overloaded functions are selected by matching the function declarations  within the current scope to the arguments supplied in the function call
	- Depending on the number and type of arguments, the correct function is chosen even if there are other functions with the same name
- Return variables are not considered for the process of resolving overloading
#### 26. Free Functions
- Free functions are functions that are defined at the file level (outside contracts)
- Different from the contract functions that are defined within the scope of the contract
- Free functions have implicit internal visibility
-  Code is included in all the contracts that call them similar to internal library functions
- These type of functions are not very commonly seen
#### 27. Events
- An abstraction built on top of the EVM logging functionality
	- Emitting events cause the arguments that are supplied to them to be stored in the transactions log (the log is a special data structure in the blockchain)
- The log stays as long as the block is accessible
- The log and the event data is not accessible from within the contracts
- Logs are meant to be accessed off chain using RPC (remote procedure call) access
- Applications off chain can subscribe and listen to events through RPC interface
- From a security perspective, these events play an important role when it comes to auditing and logging ...
	- ... ?? for offchain tools to really know what the state of a contract is and monitor the state along with all the transitions that happen because of the transaction??
#### 28. Indexed Parameters
- Up to 3 parameters of every event can be specified as being indexed by using the ``indexed`` keyword
	- This causes those parameters to be stored in a special data structure known as topics instead of the data part of the log
- Using topics allows one to search and filter those topics in a very optimal manner
- Indexed parameters are commonly seen (ERC-20)
- Use a little more gas than non-indexed but they allow for faster search and query
#### 29. Emit
- Events are triggered by using the ``emit`` keyword
	- ``emit Deposit(msg.sender, _id, msg.value)``
- From a security perspective, it is critical for the developers to emit the correct event and also to use the correct parameters that are required by that event
	- Can be easy to miss because it is harder to be tested and not really critical to the control flow of the contract
#### 30. Structs
- Structs are custom data structures that can group together several variables of same or different types to create something unique to the contract
- Various members of structs are accessed using dot notation
- An aggregate type commonly used to pack together custom data structures
#### 31. Enums
- Another user defined custom type
- Use to represent a finite set of constant integer values as represented by the members of the enum
- Every ``enum`` needs to have a minimum of 1 member and a max of 256 members
- An enum actually represents the underlying integer value
	- ``enum ActionChoices {GoLeft, GoRight};``
		- ``ActionChoices choice;
		- ``choice = ActionChoices.GoRight``
- Mainly used to improve readability
	- Rather than using integer values, devs can use specific names... which under the hood are associated with integer values
#### 32. Constructor
- A concept that is unique to Solidity in that it applies to smart contracts and the way they are created
- Constructors initialize the contract state on creation
- A constructor is a special function that gets triggered when a contract is created
- The constructor is optional and there can be only one constructor for every contract
	- Specified by using the ``constructor`` keyword
- Once the constructor is finished executing, the final code is stored on the blockchain
	- The deployed code does not include the constructor code or any of the internal functions that are called within the constructor
- From a security perspective, we can examine what the initializations will do to the contract state, otherwise default values would be used for state variables
#### 33. Receive Function
- A function that gets triggered automatically whenever there is an ether transfer made to the contract via send/transfer primitives
- Triggered when a transaction targets a contract with empty calldata
- Only one receive function for every contract
	- cannot have any arguments
	- cannot return anything
	- has an external visibility and payable state mutability
		- Function with ``payable`` can receive ether as part of a transaction
- send/transfer primitives are designed to only transfer 2300 gas
	- The reason for this is to mitigate the risk of reentrancy attacks
	- The minimal amount of gas does not allow the receive function to do much more than basic logging using events
- From a security context, receive function affects the ether balance of a contract and any assumptions in the contract logic that depends on the contract's ether balance
#### 34. Fallback Function
- Similar to the receive function but with some differences
- Gets triggered when none of the functions in the contract match the function signature specified in the transaction
- Also gets triggered if there was no data supplied in the transaction and there is no receive function
- There can only be one fallback function for a contract
- The function can receive and return data
- Visibility is external and it needs the payable specifier if meant to receive ether
- send/transfer can only be supplied with 2300 gas
- Similar to receive, the security implications are regarding the contract balance of ether
#### 35. Statically Typed
- Solidity is statically typed... the type of the variables used in a contract need to be specified in the code explicitly at compile time
- This is in contrast to dynamically typed languages where types are optional at compile time and are required only to be associated with the runtime values during execution
- Statically typed languages perform compile-time type checking according to the language rules
- Other examples of statically typed: C, C++, Java, Rust, Go, Scala
- This helps improve the security of contracts
#### 36. Types
- Solidity has two categories of types: value and reference
- Variables of value types are passed by value
	- Whenever they are used, they are copied from one location to another
- Variables of reference types are passed by reference
	- Can be modified via multiple names all of which point to or reference the same underlying variable
- From a security perspective, this really affects which state is being updated and state transitions that are affected by the transaction
#### 37. Value Type
- Variable type that is passed by value... copied when used as function arguments/assignments of expressions
- There are different value types in Solidity:
	- Booleans
	- Integers
	- Address
	- Enums
	- Fixed size byte arrays
	- Literals
	- Functions
	- Contracts??
- From a security perspective, value types can be though of as being somewhat safer because a copy of the original variable is made... the original value is not modified
	- Check the assumptions of the persistence of the value
#### 38. Reference Type
- Passed by reference... meaning there can be multiple names for a variable all pointing to the same underlying variable state
- There are three reference types:
	- Arrays
	- Structs
	- Mappings
- From a security perspective, reference types can be risky due to unintentional modification
#### 39. Default Values
- Variables that are declared but not initialized have default values
- In Solidity, the default value is the zero-state of that particular type
	- Boolean: false (0)
	- Integer: 0
	- Address: 0
	- Enum: First Member
- From a security perspective, this becomes important because variables that are declared an not initialized end up with these default values and in some cases, such as an address type, the zero value has a special meaning in Ethereum... and that can affect the security properties depending on how those variables are used
#### 40. Scoping
- Fundamental to every programming language... affects variable visibility
	- Where variables can be used in relation to where they are declared
- Solidity used to scoping rules of the [C99 standard](https://en.wikipedia.org/wiki/C99)
- In Solidity, variables are visible right after the point of declaration until the end of the smallest curly bracket block that contains that declaration
	- As an exception to this rule, variables declared in the initialization of a for loop are only visible until the end of the for loop
- Variables that are parameters (function parameters, modifier parameters, catch parameters) are visible inside the code block that follows the body of the function or modifier parameter and the catch block for a catch parameter
- Variables and other items declared outside of a code block (such as functions, contracts, state variables, user defined types) are visible even before they are declared
	- We can see the usage of state variables even before they are declared within the context of a contract
		- This is what allows functions to be called recursively
- From a security perspective, understanding scoping becomes important when we are doing data flow analysis