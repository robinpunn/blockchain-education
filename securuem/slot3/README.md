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
2. [Block 2](#block-2)
	121. [Mapping and Dynamic Arrays](#121-mapping-and-dynamic-arrays)
	122. [Dynamic Arrays](#122-dynamic-arrays)
	123. [Mappings](#123-mappings)
	124. [bytes and string](#124-bytes-and-string)
	125. [Memory](#125-memory)
	126. [Memory Layout](#126-memory-layout)
	127. [Reserved Memory](#127-reserved-memory)
	128. [Memory Arrays](#128-memory-arrays)
	129. [Free Memory Pointer](#129-free-memory-pointer)
	130. [Zeroed Memory](#130-zeroed-memory)
	131. [Reserved Keywords](#131-reserved-keywords)
	132. [Inline Assembly](#132-inline-assembly)
	133. [Assembly Access](#133-assembly-access)
	134. [Yul Syntax](#134-yul-syntax)
	135. [Solidity 0.6.0 Breaking](#135-solidity-060-breaking)
	136. [Solidity 0.6.0 Explicitness](#136-solidity-060-explicitness)
	137. [Solidity 0.6.0 Changes](#137-solidity-060-changes)
	138. [Solidity 0.6.0 New Features](#138-solidity-060-new-features)
	139. [Solidity 0.7.0 Breaking](#139-solidity-070-breaking)
	140. [Solidity 0.7.0 Changes](#140-solidity-070-changes)
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


### [Block 2](https://www.youtube.com/watch?v=TqMIbouwePE)
#### 121. Mapping and Dynamic Arrays
- Due to their unpredictable size, mappings and dynamically-sized array types cannot be stored “in between” the state variables preceding and following them.
	- They occupy a single slot (32 bytes)
	- The elements contained inside that can change dynamically over the duration of the contract are stored in a different location
		- The starting storage slot for these elements is computed using the keccak-256 hash
#### 122. Dynamic Arrays
- If the storage location of the array ends up being a slot p after applying the storage layout rules, this slot stores the number of elements in the array (byte arrays and strings are an exception).
	- Array data is located starting at keccak256(p) and it is laid out in the same way as statically-sized array data would: One element after the other, potentially sharing storage slots if the elements are not longer than 16 bytes.
- Dynamic arrays of dynamic arrays apply this rule recursively.
#### 123. Mappings
- For mappings, the slot stays empty, but it is still needed to ensure that even if there are two mappings next to each other, their content ends up at different storage locations.
	- The value corresponding to a mapping key k is located at keccak256(h(k) . p) where . is concatenation and h is a function that is applied to the key depending on its type:
		1) for value types, h pads the value to 32 bytes in the same way as when storing the value in memory.
		2) for strings and byte arrays, h computes the keccak256 hash of the unpadded data.
	- If the mapping value is a non-value type, the computed slot marks the start of the data.
	- If the value is of struct type, for example, you have to add an offset corresponding to the struct member to reach the member.
#### 124. bytes and string
- bytes and string are encoded identically.
- In general, the encoding is similar to byte1[], in the sense that there is a slot for the array itself and a data area that is computed using a keccak256 hash of that slot’s position.
- However, for short values (shorter than 32 bytes) the array elements are stored together with the length in the same slot.
	- if the data is at most 31 bytes long, the elements are stored in the higher-order bytes (left aligned) and the lowest-order byte stores the value length * 2.
	- For byte arrays that store data which is 32 or more bytes long, the main slot p stores length * 2 + 1 and the data is stored as usual in keccak256(p).
		- This means that you can distinguish a short array from a long array by checking if the lowest bit is set: short (not set) and long (set).
#### 125. Memory
- EVM is a stack based architecture which has call data, volatile memory, and non-volatile storage
	- EVM memory has a linear layout: all the memory locations are stored linearly next to each other
- can be addressed at byte level and accessed with MSTORE/MSTORE8/MLOAD instructions.
- All locations in memory are initialized as zero.
#### 126. Memory Layout
- Solidity places new memory objects at the free memory pointer and memory is never freed.
	- The free memory pointer points to 0x80 initially.
#### 127. Reserved Memory
- The initial value of the free memory pointer in Solidity is 0x80
	- because the first four 32 byte slots are reserved by Solidity and these add up to 128 bytes: therefore the 0x80 value
-  Solidity reserves four 32-byte slots, with specific byte ranges (inclusive of endpoints) being used as follows:
	- 0x00 - 0x3f (64 bytes): scratch space for hashing methods
	- 0x40 - 0x5f (32 bytes): currently allocated memory size (aka. free memory pointer)
	- 0x60 - 0x7f (32 bytes): zero slot (The zero slot is used as initial value for dynamic memory arrays and should never be written to)
#### 128. Memory Arrays
- Elements in memory arrays in Solidity always occupy multiples of 32 bytes (this is even true for byte[], but not for bytes and string).
	- Multi-dimensional memory arrays are pointers to memory arrays
	- The length of a dynamic array is stored at the first slot of the array and followed by the array elements
#### 129. Free Memory Pointer
- There is a “free memory pointer” at position 0x40 in memory.
- If you want to allocate memory, use the memory starting from where this pointer points at and update it.
- Considering the reserved memory, allocatable memory starts at 0x80, which is the initial value of the free memory pointer.
#### 130. Zeroed Memory
- Zeroed memory is memory containing zero bytes
- There is no guarantee that the memory has not been used before and thus you cannot assume that its contents are zero bytes.
- There is no built-in mechanism to release or free allocated memory.
#### 131. Reserved Keywords
- These keywords are reserved in Solidity.
- They might become part of the syntax in the future:
	- _after, alias, apply, auto, case, copyof, default, define, final, immutable, implements, in, inline, let, macro, match, mutable, null, of, partial, promise, reference, relocatable, sealed, sizeof, static, supports, switch, typedef, typeof, unchecked_
#### 132. Inline Assembly
- Inline assembly is a way to access the Ethereum Virtual Machine at a low level.
	- This bypasses several important safety features and checks of Solidity.
- You should only use it for tasks that need it, and only if you are confident with using it.
- The language used for inline assembly in Solidity is called Yul
- An inline assembly block is marked by _assembly { ... }_, where the code inside the curly braces is code in the Yul language
#### 133. Assembly Access
- Yul supports assembly access to various features such as external variables, functions, and libraries
	- You can access Solidity variables and other identifiers by using their name.
	- Local variables of value type are directly usable in inline assembly
	- Local variables that refer to memory/calldata evaluate to the address of the variable in memory/calldata and not the value itself
	- For local storage variables or state variables, a single Yul identifier is not sufficient, since they do not necessarily occupy a single full storage slot.
		- Therefore, their “address” is composed of a slot and a byte-offset inside that slot.
		- To retrieve the slot pointed to by the variable x, you use x.slot, and to retrieve the byte-offset you use x.offset. Using x itself will result in an error.
	- Local Solidity variables are available for assignments
	- Assignments are possible to assembly-local variables and to function-local variables.
		- Take care that when you assign to variables that point to memory or storage, you will only change the pointer and not the data.
	- You can assign to the .slot part of a local storage variable pointer.
		- For these (structs, arrays or mappings), the .offset part is always zero.
		- It is not possible to assign to the .slot or .offset part of a state variable, though
#### 134. Yul Syntax
- Yul parses comments, literals and identifiers in the same way as Solidity.
- Inside a code block, the following elements can be used:
	- literals, i.e. 0x123, 42 or "abc" (strings up to 32 characters)
	- calls to built in functions, e.g. add(1, mload(0))
	- variable declarations, e.g. let x := 7, let x := add(y, 3) or let x (initial value of 0 is assigned)
	- identifiers (variables), e.g. add(3, x)
	- assignments, e.g. x := add(y, 3)
	- blocks where local variables are scoped inside, e.g. { let x := 3 { let y := add(x, 1) } }
	- if statements, e.g. if lt(a, b) { sstore(0, 1) }
	- switch statements, e.g. switch mload(0) case 0 { revert() } default { mstore(0, 1) }
	- for loops, e.g. for { let i := 0} lt(i, 10) { i := add(i, 1) } { mstore(i, 7) }
	- function definitions, e.g. function f(a, b) -> c { c := add(a, b) }
#### 135. Solidity 0.6.0 Breaking
- Breaking versions are versions that are not backwards compatible
	- Significant changes that are not compatible with the previous versions
- Breaking versions increment the number seen in the middle of the version
- 0.6.0 introduced a breaking semantic feature... changed the behavior of the code without changing the syntax
- Changes where existing code changes its behavior without the compiler notifying you about it:
	- The resulting type of an exponentiation is the type of the base.
	- It used to be the smallest type that can hold both the type of the base and the type of the exponent, as with symmetric operations.
	- Additionally, signed types are allowed for the base of the exponentiation.
#### 136. Solidity 0.6.0 Explicitness
- Explicitness is good for security because it reduces ambiguity
- Keywords virtual and override were introduced
- Functions can now only be overridden when they are either marked with the virtual keyword or defined in an interface.
	- Functions without implementation outside an interface have to be marked virtual.
	- When overriding a function or modifier, the new keyword override must be used.
	- When overriding a function or modifier defined in multiple parallel bases, all bases must be listed in parentheses after the keyword like so: override(Base1, Base2).
- Member-access to length of arrays is now always read-only, even for storage arrays.
	- It is no longer possible to resize storage arrays by assigning a new value to their length.
	- Use push(), push(value) or pop() instead, or assign a full array, which will of course overwrite the existing content.
	- The reason behind this is to prevent storage collisions of gigantic storage arrays.
- The new keyword abstract can be used to mark contracts as abstract.
	- It has to be used if a contract does not implement all its functions.
	- Abstract contracts cannot be created using the new operator, and it is not possible to generate bytecode for them during compilation.
- Libraries have to implement all their functions, not only the internal ones.
- The names of variables declared in inline assembly may no longer end in _slot or _offset.
- Variable declarations in inline assembly may no longer shadow any declaration outside the inline assembly block.
	- If the name contains a dot, its prefix up to the dot may not conflict with any declaration outside the inline assembly block.
- State variable shadowing is now disallowed.
	- State variable shadowing is when you have state variables in the base contracts that are shadowed in the derived contracts (they have the same name)
	- A derived contract can only declare a state variable x, if there is no visible state variable with the same name in any of its bases.
#### 137. Solidity 0.6.0 Changes
- Conversions from external function types to address are now disallowed.
	- Instead external function types have a member called address, similar to the existing selector member.
- The function push(value) for dynamic storage arrays does not return the new length anymore (it returns nothing).
- The unnamed function commonly referred to as “fallback function” was split up into a new fallback function that is defined using the fallback keyword and a receive ether function defined using the receive keyword.
- If present, the receive ether function is called whenever the call data is empty (whether or not ether is received).
	- This function is implicitly payable.
- The new fallback function is called when no other function matches (if the receive ether function does not exist then this includes calls with empty call data).
	- You can make this function payable or not.
	- If it is not payable then transactions not matching any other function which send value will revert.
	- You should only need to implement the new fallback function if you are following an upgrade or proxy pattern.
#### 138. Solidity 0.6.0 New Features
- The try/catch statement allows you to react on failed external calls.
- struct and enum types can be declared at file level.
- Array slices can be used for calldata arrays, for example abi.decode(msg.data[4:], (uint, uint)) is a low-level way to decode the function call payload.
- Natspec supports multiple return parameters in developer documentation, enforcing the same naming check as @param.
- Yul and Inline Assembly have a new statement called leave that exits the current function.
- Conversions from address to address payable are now possible via payable(x), where x must be of type address.
#### 139. Solidity 0.7.0 Breaking
- changes where existing code changes its behaviour without the compiler notifying you about it:
	- Exponentiation and shifts of literals by non-literals (e.g. 1 << x or 2 ** x) will always use either the type uint256 (for non-negative literals) or int256 (for negative literals) to perform the operation.
	- Previously, the operation was performed in the type of the shift amount / the exponent which can be misleading.
#### 140. Solidity 0.7.0 Changes
- changes that might cause existing contracts to not compile anymore:
	- In external function and contract creation calls, Ether and gas is now specified using a new syntax:
		- x.f{gas: 10000, value: 2 ether}(arg1, arg2).
		- The old syntax – x.f.gas(10000).value(2 ether)(arg1, arg2) – will cause an error.
	- The global variable now is deprecated, block.timestamp should be used instead.
		- The single identifier now is too generic for a global variable and could give the impression that it changes during transaction processing, whereas block.timestamp correctly reflects the fact that it is just a property of the block.
	- NatSpec comments on variables are only allowed for public state variables and not for local or internal variables
	- The token gwei is a keyword now (used to specify, e.g. 2 gwei as a number) and cannot be used as an identifier
	- String literals now can only contain printable ASCII characters and this also includes a variety of escape sequences, such as hexadecimal (\xff) and unicode escapes (\u20ac).
	- Unicode string literals are supported now to accommodate valid UTF-8 sequences.
		- They are identified with the unicode prefix: unicode"Hello 😃".
	- State Mutability: The state mutability of functions can now be restricted during inheritance.
		- Functions with default state mutability can be overridden by pure and view functions while view functions can be overridden by pure functions.
		- At the same time, public state variables are considered view and even pure if they are constants.
	- Disallow . in user-defined function and variable names in inline assembly.
		- It is still valid if you use Solidity in Yul-only mode.
	- Slot and offset of storage pointer variable x are accessed via x.slot and x.offset instead of x_slot and x_offset.