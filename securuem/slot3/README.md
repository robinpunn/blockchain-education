## Slot 3

---
### Table of Contents
1. [Block 1](#block-1)
    102. [Inheritance](#102-inheritance)
    103. [Contract Types](#103-contract-types)
    104. [Using For](#104-using-for)
    105. [Base Class Function](#105-base-class-function)
    106. [Shadowing](#106-shadowing)
    107. [Overriding Changes](#107-overriding-changes)
    108. [Virtual Functions](#108-virtual-functions)
    109. [State Variables](#109-state-variables)
    110. [Function Modifiers](#110-function-modifiers)
    111. [Base Constructor](#111-base-constructor)
    112. [Name Collision](#112-name-collision)
    113. [Library Restrictions](#113-library-restrictions)
    114. [EVM Storage](#114-evm-storage)
    115. [Storage Layout](#115-storage-layout)
    116. [Stroge Packing](#116-storage-packing)
    117. [Structs and Arrays](#117-structs-and-arrays)
    118. [Inheritance](#118-inheritance)
    119. [Layout and Types](#119-layout-and-types)
    120. [Layout and Ordering](#120-layout-and-ordering)
---

### [Block 1](https://www.youtube.com/watch?v=3bFgsmsQXrE)
#### 102. Inheritance
- Solidity supports multiple inheritance including polymorphism
	- A function call (internal and external) always executes the function of the same name (and parameter types) in the most derived contract in the inheritance heirarchy.
	- When a contract inherits from other contracts, only a single contract is created on the blockchain with the code of the base contract compiled into the created contract
	- Function Overriding: Base functions can be overridden by inheriting contracts to change their behavior if they are marked as _virtual_. 
		- The overriding function must then use the _override_ keyword in the function header
	- Languages that allow multiple inheritance have to deal with several problems. 
		- One is the Diamond Problem. 
		- Solidity is similar to Python in that it uses “C3 Linearization” to force a specific order in the directed acyclic graph (DAG) of base classes. 
		- So when a function is called that is defined multiple times in different contracts, the given bases are searched from right to left (left to right in Python) in a depth-first manner, stopping at the first match.
#### 103. Contract Types
- Besides the typical contracts supported by Solidity, it also supports three other contract types: Abstract contracts, Interfaces, and Libraries
	- Abstract Contracts: Contracts need to be marked as abstract when at least one of their functions is not implemented. 
		- They use the _abstract_ keyword.
	- Interfaces: They cannot have any functions implemented. 
		- There are further restrictions: 
			1) They cannot inherit from other contracts, but they can inherit from other interfaces 
			2) All declared functions must be external 
			3) They cannot declare a constructor 
			4) They cannot declare state variables. They use the _interface_ keyword
	- Libraries: They are deployed only once at a specific address and their code is reused using the DELEGATECALL opcode. 
		- This means that if library functions are called, their code is executed in the context of the calling contract. 
		- They use the _library_ keyword.
#### 104. Using For
- Solidity supports using the "for directive"
- This directive is used for attaching library functions to specific types in the context of the contract
- The directive using A for B; 
	- can be used to attach library functions (from the library A) to any type (B) in the context of a contract. 
	- These functions will receive the object they are called on as their first parameter.
	- The using A for B; directive is active only within the current contract, including within all of its functions, and has no effect outside of the contract in which it is used.
	- The directive may only be used inside a contract, not inside any of its functions
		- ``using SafeMath for uint256;``
#### 105. Base Class Function
- When we consider inheritance hierarchy, we have base classes and then we have derived classes
- It is possible to call functions further up in the inheritance hierarchy internally by explicitly specifying the contract using ContractName.functionName() or using super.functionName() if you want to call the function one level higher up in the flattened inheritance hierarchy
#### 106. Shadowing
- Until verision 0.6.0, variables of the same name were allowed to be used from derived classes as they were declared in the base classes
- As of the lastest versions, this is considered as an error. A derived contract can only declare a state variable x, if there is no visible state variable with the same name in any of its bases.
#### 107. Overriding Changes
- Functions in the derived classes can override the virtual functions in their base classes to redefine the logic within them
	- These overriding functions can change the visibility of the overridden functions
- The overriding function may only change the visibility of the overridden function from external to public. 	
- The mutability may be changed to a more strict one following the order: 
	- nonpayable can be overridden by view and pure. 
	- view can be overridden by pure. 
	- payable is an exception and cannot be changed to any other mutability.
#### 108. Virtual Functions
- Virtual functions are functions without implementation
- Have to be marked virtual outside of interfaces. 
- In interfaces, all functions are automatically considered virtual... don't need to use virtual keyword. 
- In abstract functions, if a function has to be considered virtual (without specifying an implemenation??) it should use the virtual keyword
- Functions with private visibility cannot be virtual.
#### 109. State Variables
- State variables in Solidity can have different visibilities... one of them is public
	- Public state functions have automatic getter functions generated by the solidity compiler
		- Getters are functions that are generated to allow accessing the value of the public state variables
- Public state variables can override external functions if the parameter and return types of the function matches the getter function of the variable. 
	- While public state variables can override external functions, they themselves cannot be overridden.
#### 110. Function Modifiers
- Function modifiers can override each other. 
	- This works in the same way as function overriding (except that there is no overloading for modifiers). 
	- The virtual keyword must be used on the overridden modifier and the override keyword must be used in the overriding modifier
#### 111. Base Constructor
- The constructors of all the base contracts will be called following the linearization rules. 
	- If the base constructors have arguments, derived contracts need to specify all of them either in the inheritance list or in the derived constructor.
#### 112. Name Collision
- Name collision is always an error in Solidity
- It is an error when any of the following pairs in a contract have the same name due to inheritance: 
	1) a function and a modifier 
	2) a function and an event 
	3) an event and a modifier
#### 113. Library Restrictions
- In comparison to contracts, libraries are restricted in the following ways:
	- they cannot have state variables
	- they cannot inherit nor be inherited
	- they cannot receive Ether
	- they cannot be destroyed
	- it can only access state variables of the calling contract if they are explicitly supplied (it would have no way to name them, otherwise)
	- Library functions can only be called directly (i.e. without the use of DELEGATECALL) if they do not modify the state (i.e. if they are view or pure functions), because libraries are assumed to be stateless
#### 114. EVM Storage
- Storage is a key-value store that maps 256-bit words to 256-bit words and is accessed with EVM’s SSTORE/SLOAD instructions. 
	- All locations in storage are initialized as zero.
#### 115. Storage Layout
- State variables are stored in different storage slots
	- Each slot corresponds to a word size of 256bits and the various state variables in a contract map to these storage slots
- Depending on their types, multiple state variables can fit within the same storage slot
- State variables of contracts are stored in storage in a compact way such that multiple values sometimes use the same storage slot. 
	- Except for dynamically-sized arrays and mappings, data is stored contiguously item after item starting with the first state variable, which is stored in slot 0
#### 116. Storage Packing
- For each state variable, a size in bytes is determined according to its type. 
	- Multiple, contiguous items that need less than 32 bytes are packed into a single storage slot if possible, according to the following rules:
	    - The first item in a storage slot is stored lower-order aligned
	    - Value types use only as many bytes as are necessary to store them
	    - If a value type does not fit the remaining part of a storage slot, it is stored in the next storage slot
#### 117. Structs and Arrays
- Structs and array data always start a new slot and their items are packed tightly according to these rules
- Items following struct or array data always start a new storage slot
- The elements of structs and arrays are stored after each other, just as if they were given as individual values.
#### 118. Inheritance
- For contracts that use inheritance, the ordering of state variables is determined by the C3-linearized order of contracts starting with the most base-ward contract. 
	- If allowed by the above rules, state variables from different contracts do share the same storage slot.
#### 119. Layout and Types
- Storage packing allows us to optimize the storage slot layout depending on the types of the state variables
- It might be beneficial to use reduced-size types if you are dealing with storage values because the compiler will pack multiple elements into one storage slot, and thus, combine multiple reads or writes into a single operation.
	- If you are not reading or writing all the values in a slot at the same time, this can have the opposite effect, though: 
		- When one value is written to a multi-value storage slot, the storage slot has to be read first and then combined with the new value such that other data in the same slot is not destroyed.
#### 120. Layout and Ordering
- Packing has a big impact on gas costs
	- From a gas cost perspective, SLOAD and SSTORE are very expensive
- Ordering of storage variables and struct members affects how they can be packed tightly. 
	- For example, declaring your storage variables in the order of uint128, uint128, uint256 instead of uint128, uint256, uint128, as the former will only take up two slots of storage whereas the latter will take up three.