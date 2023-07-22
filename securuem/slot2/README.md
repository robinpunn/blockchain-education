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
3. [Block 3](#block-3)
	41. [Boolean](#41-boolean)
	42. [Integers](#42-integers)
	43. [Integer Arithmetic](#43-integer-arithmetic)
	44. [Fixed Point](#44-fixed-point)
	45. [Address](#45-address)
	46. [Address Members](#46-address-members)
	47. [Transfer](#47-transfer)
	48. [Send](#48-send)
	49. [External Calls](#49-external-calls)
	50. [Contract Type](#50-contract-type)
	51. [Bytes Arrays](#51-bytes-arrays)
	52. [Literal](#52-literals)
	53. [Enums](#53-enums)
	54. [Function Types](#54-function-types)
	55. [Data Location](#55-data-location)
	56. [Data Locations and Assignments](#56-data-location-and-assignments)
	57. [Arrays](#57-arrays)
	58. [Array Members](#58-array-members)
	59. [bytes and string](#59-bytes-and-string)
	60. [Memory Arrays](#60-memory-arrays)
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


### [Block 3](https://www.youtube.com/watch?v=6VIJpze1jbU)
#### 41. Boolean
- Boolean types are declared using the ``bool`` keyword
	- They can have two possible values: true or false
- Five operators that can operate on boolean types:
	- ``!``: not... logical negation
	- ``==``: eq
	- ``!=``: inequality
	- ``&&``: and
	- ``||``: or
- Logical conjunction (&&) and logical disjunction (||) apply short circuiting rules
	- If using the or operator, if the first value is evaluated as true, the second value won't be evaluated
	- If using the and operator, if the first value is false, the second value won't be evaluated
- From a security perspective, booleans are used extensively in smart contracts... they affect the control flow
	- Make sure the correct operator is being used
#### 42. Integers
- Use the ``uint``/``int`` (unsigned/signed) keywords
- They come in sized of 8 bits to 256 bits
	- ``uint8``, ``uint16``, ...``uint256``
	- ``int8``, ``int16``, ...``int256``
- They have various operators
	- Arithmetic
	- Comparative
	- Bit
	- Shift
- From a security perspective, they affect data flow of contract logic
	- Underflow/overflow is critical to security
#### 43. Integer Arithmetic
- Arithmetic that operates on integer operands
- Integers in Solidity are restricted to a certain range of value
	- ``uint256``... range: 0 -> 2^256-1
		- anything beyond this range would be an overflow or underflow
- Overflow/Underflow causes wrapping
	- When a number is out of range, it "wraps" to the other side
	- In the case of ``uint256``, if a number is at the max value of that range and the contract incremented by 1, it would go back to 0
- For the versions of Solidity below 0.8.0, the best practice was to use OpenZeppelin SafeMath library
	- Made operating on integer values safe with respect to overflows and underflows
- Solidity >= 0.8.0 introduced overflow and underflow check for integers
	- Can switch from the default checked arithmetic vs unchecked arithmetic
#### 44. Fixed Point
- For numbers that have an integer part and a fractional part the location of the decimal point indicates if it is fixed or floating
	- If the position of the decimal point can change, it is referred to as a floating point type
	- If the position is fixed for all variables of that type, then it is known as fixed point arithmetic
- There is no real support for this in Solidity?
- For fixed point arithmetic, a library is required
#### 45. Address
- The ``address`` type in Solidity refers to the underlying Ethereum account address (the EOA or the contract account)
- Addresses are 20 bytes in size
- They come on two types:
	- plain address types
	- address payable type (can receive ether)
- There are different operators that operate on address types:
	- ``==``
	- ``!=``
	- ``<``
	- ``<=``
	- ``>``
	- ``>=``
- Converting an address payable to a plain address is safe as an implicit conversion?
- An address type converted to an address payable type should be an explicit conversion
- From a security perspective, address roles play a critical role
#### 46. Address Members
- Address types have different members that can you different aspects of the underlying address type:
	- balance: gives balance of address in wei
	- code: gives the code at the address
	- codehash: gives hash of the code at the address
	- transfer/send: applicable to address payable types... make calls to the address specified with a limited gas stipend of 2300 units (not adjustable, hard coded by Solidity to address reentrancy attacks)
- Used to make low level calls to the specified address:
	- call
	- delegatecall: callee account executes its logic with the state of the caller account
	- staticcall: the callee contract address can access the state but cannot modify the state
- Address members play a huge role when it comes to security because they deal with balances, external calls, reentrancy
#### 47. transfer
- The transfer function is used to transfer ether to the destination address
- This transfer triggers the receive or fallback function of the target contract
- Supplied with 2300 gas subsidy by default
	- Fixed amount that can't be changed
	- If the target contract uses more than 2300 gas, the transaction fails, it reverts, and an exception is caused
- From a security perspective, this primitive prevents reentrancy
#### 48. send
- The send primitive is similar to transfer, but it is a lower level counter part of transfer
- Used for ether transfers, like transfer it triggers receive/fallback
- Has a 2300 gas subsidy, but it does not result in a failure if the target contract uses more than 2300 gas... just returns a boolean indicating failure
- From a secuirty perspective... used to mitigate reentrancy... the caller has to check the return value to make sure it went through
#### 49. External Calls
- Three primitives: call, delegatecall, staticcall
- Use to interface with contracts that do no adhere to the api or where the developer wants more control over such calls
	- They all take single bytes memory parameter
	- Return a success boolean and data in the form of bytes memory
	- Can use functions such as abi encode?, encode path?, encode with selector?, encode with signature?... to encode structured data as part of the arguments
	- Can use gas and value modifiers to specify the amount of gas and ether for these calls (applicable to call primitive, not delegatecall or staticcall)
- delegatecall is used when the caller contract wants to use the logic specified by the callee contract but with the state and other aspects of the caller contract
	- so the code of callee is used, but all other aspects(storage, balance, message sender) are taken from the caller contract
	- purpose of delegatecall is to enable usecases such as libraries or proxy upgradability
- staticcall is used when we want the called function in the callee contract to look at or read the state of the caller contract but not modify it in any way
- The use of external calls have different types of security implications
	- These are low level calls that should be avoided in most cases unless absolutely required and there are no alternatives available ( could call out to external contracts that are untrusted )
#### 50. Contract Type
- Every contract that is declared is its own type and these contract types can explicitly be converted to and from address types
- Contract types do not have any operators supported
- The only members are external functions and public state variables
#### 51. Bytes Arrays
- These types are used to store arrays of raw bytes
- Two types:
	- fixed-size byte array
		- bytes1, bytes2, ...bytes32
	- ``byte[]``
		- used for storing byte arrays where we don't know the fixed size in advance
		- due to padding rules in EVM, it wastes 31 bytes of space for every element that's stored in it
	- better to use the byte type vs the bytes type???
- Will come across this in contracts when trying to store raw bytes such as in the case of hashes
#### 52. Literals
- Solidity supports 5 types of literals:
	- Address: hexadecimal literals that pass the address checksum test
		- Every "nibble"(hexadecimal character) in a hexadecimal address is half a byte
		- So a 40 character address literal is 20 bytes
		- checksum makes sure there are no typographical errors when using addresses ([EIP55](https://eips.ethereum.org/EIPS/eip-55))
	- Rational/Integer
		- Integer literals have a sequence of numbers from 0-9 range
		- decimal fraction literals are formed by using a decimal point with one number on each side
		- scientific notation is supported where the base can have fractions and exponent cannot
		- underscores can be used to separate digits (used to help with readability)
	- String
		- Written with either double quotes or single quotes
		- They can only contain printable ascii characters and a set of escape characters
	- Unicode
		- Have to be prefixed with the keyword unicode
		- can contain any utf-8 sequence
	- Hexadecimals
		- Hexadecimal digits prefixed with the keyword hex enclosed in double or single quotes
- The usage of all these literals is in the context of constants
#### 53. Enums
- A way to create user defined types
- Must have atleast 1 member up to a max of 256
- The default value of an enum is the first member
- In smart contracts, enums are used to represent the names of various states within the context of the contract logic
- Used to help improve readability
#### 54. Function Types
- Function types are types used to indicate that variables represent actual functions
- These variables can be used just like any other variables
	- They can assigned as functions because of the function type??
	- They can be sent as arguments to other functoins
	- They can be used to return values from other functions
- They come in two types, internal and external
	- Internal functions can only be called inside the current contract
	- external functions consist of an address of the contract where they are relevant and a function signature
- Usage of function types is minimal in most of the contracts we will see??
#### 55. Data Location
- Reference types (structs, arrays, mappings) allow for a specification of their data location
	- An additional annotation that indicates where that reference type variable is stored
- Three locations (not including the 4th... stack) affect the lifetime or the scope and persistence of the variables stored in those locations:
	- memory: indicates that the lifetime is limited to the external function call
	- storage: the lifetime extends to the whole contract (also the location where state variables are stored)
	- calldata: non-modifiable, non-persistent area where function arguments are stored
		- required for parameters of external functions but can also be used for other variables
- Impacts the scope of the variables
- From a security perspective, this affects the persistence of those variables
#### 56. Data Location and Assignments
- The data location annotation affects persistency in the scope in which they are relevant but also affects assignment semantics
- Assignment semantics: During an assignment is a copy of the variable being created or simply a reference??
	- Storage and memory assignments always creates an independent copy
	- Memory to memory assignments only create references
	- storage to storage assignments only create a reference
	- All other variants create a copy
- If a copy were to be created, any modifications to the copy only affects the copy and not the original variable
- If a reference was created, then the new variable being modified will affect the original variable... both of them are just different names pointing to the same underlying data
#### 57. Arrays
- Arrays come in two types
	- Static: the size of the array is known at compile time
		- ``T[k]``
	- Dynamic
		- ``T[]``
- The elements of these arrays can be of any type that is supported by Solidity
- Indices are zero based (first element is stored at 0)
- If arrays are accessed past their length, Solidity automatically reverts that access and creates an exception
- Arrays are commonly used in smart contracts
	- Check if the correct index is being used
	- Check for off by one if they are being accessed beyond or below their indices
	- If an array is very long and the elements are complex, the amount of gas used can end up causing a denial of service attack
#### 58. Array Members
- ``length``, ``push``, ``push(x)``, ``pop``
	- length: returns the number of elements in the array
	- push: appends a 0 initialized element at the end of the array... returns a reference to that element
	- push(x): appends the specified x element to the end of the array... returns nothing
	- pop: removes an element from the end of the array and implicitly calls delete on that removed element
- Security considerations would involve considering the length of the array, off by one accesses, push and pop semantics
#### 59. bytes and string
- bytes are used to store arbitrary byte data or arbitrary length
	- If we know the size of the array, we can used fixed size byte arrays (bytes1...)
	- If we don't know the size, we can just use ``bytes`` or ``byte[]``
		- Preferable to use ``bytes`` over ``byte[]`` as ``byte[]`` will require a lot of gas
- the string type is equivalent to the bytes types... string == byte
	- string does not allow accessing the length or index of the string
- Solidity doesn't have built in string functions, but there are third party libraries
#### 60. Memory Arrays
- Arrays that are created in memory
- Can have a dynamic length and are created using the ``new`` operator
 - As opposed to storage arrays, it's not possible to resize memory arrays... no push
 - Either have to calculate the size in advance, or copy the old array in to a new array
	 - ``uint[] memory a = new uint[](7)``