## Slot 4 Security Pitfalls & Best Practices 101

---
### Table of Contents
1. [Block 1](#block-1)
    1. [Solidity Versions](#1-solidity-versions)
    2. [Unlocked Pragma](#2-unlocked-pragma)
    3. [Multiple Solidity Pragma](#3-multiple-solidity-pragma)
    4. [Access Control](#4-access-control)
    5. [Withdraw Funds](#5-withdraw-funds)
    6. [selfdestruct](#6-selfdestruct)
    7. [Modifier Side Effects](#7-modifier-side-effects)
    8. [Incorrect Modifier](#8-incorrect-modifier)
    9. [Constructor Names](#9-constructor-names)
    10. [Void Constructor](#10-void-constructor)
    11. [Constructor callValue](#11-constructor-callvalue)
    12. [delegatecall](#12-delegatecall)
    13. [Reentrancy](#13-reentrancy)
    14. [ERC777](#14-erc777)
    15. [transfer() and send()](#15-transfer-and-send)
    16. [Private Data](#16-private-data)
    17. [PRNG](#17-prng)
    18. [Time](#18-time)
    19. [Overflow/underflow](#19-overflowunderflow)
    20. [Divide before Multiply](#20-divide-before-multiply)
2. [Block 2](#block-2)
    21. [TOD](#21-tod)
    22. [ERC20 Approve](#22-erc20-approve)
    23. [ercrecover](#23-ecrecover)
    24. [transfer](#24-transfer)
    25. [ownerOf()](#25-ownerof)
    26. [Contract Balance](#26-contract-balance)
    27. [fallback vs receive](#27-fallback-vs-receive)
    28. [Strict Equalities](#28-strict-equalities)
    29. [Locked Ether](#29-locked-ether)
    30. [tx.origin](#30-txorigin)
    31. [Contract](#31-contract)
    32. [delete Mapping](#32-delete-mapping)
    33. [Tautology Contradiction](#33-tautology-contradiction)
    34. [Boolean Constant](#34-boolean-constant)
    35. [Boolean Equality](#35-boolean-equality)
    36. [Contract State Modifications](#36-contract-state-modifications)
    37. [Return Values](#37-return-values)
    38. [Account Existence](#38-account-existence)
    39. [Shadowing Built In](#39-shadowing-built-in)
    40. [Shadowing State Variables](#40-shadowing-state-variables)
3. [Block 3](#block-3)
    41. [Pre-declaration](#41-pre-declaration)
    42. [Costly Operations](#42-costly-operations)
    43. [Costly Calls](#43-costly-calls)
    44. [Block Limit Gas](#44-block-limit-gas)
    45. [Events](#45-events)
    46. [Event Parameters](#46-event-parameters)
    47. [Event Signatures](#47-event-signatures)
    48. [Unary Expression](#48-unary-expression)
    49. [Zero Addresses](#49-zero-addresses)
    50. [Critical Addresses](#50-critical-addresses)
    51. [assert()](#51-assert)
    52. [asser() vs required()](#52-assert-vs-require)
    53. [Keywords](#53-keywords)
    54. [Visibility](#54-visibility)
    55. [Incorrect Inheritance](#55-incorrect-inheritance)
    56. [Missing Inheritance](#56-missing-inheritance)
    57. [Gas Griefing](#57-gas-griefing)
    58. [Reference Parameters](#58-reference-parameters)
    59. [Arbitrary Jump](#59-arbitrary-jump)
    60. [Hash Collisions](#60-hash-collisions)
4. [Block 4](#block-4)
    61. [Dirty Bits](#61-dirty-bits)
    62. [Incorrect Shifts](#62-incorrect-shifts)
    63. [Assembly](#63-assembly)
    64. [RTLO](#64-rtlo)
    65. [Constant](#65-constant)
    66. [Variable Names](#66-variables-names)
    67. [Uninitialized Variables](#67-uninitialized-variables)
    68. [Storage Pointers](#68-storage-pointers)
    69. [Function Pointers](#69-function-pointers)
    70. [Number Literals](#70-number-literals)
    71. [Enum](#71-enum)
    72. [Public Functions](#72-public-functions)
    73. [Dead Code](#73-dead-code)
    74. [Return Value](#74-return-value)
    75. [Unused Variables](#75-unused-variables)
    76. [Redundant Statements](#76-redundant-statements)
    77. [Storage Array](#77-storage-array)
    78. [Constructor Arguments](#78-constructor-arguments)
    79. [Arrays](#79-arrays)
    80. [Structs](#80-structs)
5. [Block 5](#block-5)
    81. [Storage](#81-storage)
    82. [Loads](#82-loads)
    83. [Arrays](#83-arrays)
    84. [Escaping](#84-escaping)
    85. [Shift](#85-shift)
    86. [byte Instructions](#86-byte-instruction)
    87. [Assignment](#87-assignment)
    88. [Private Functions](#88-private-functions)
    89. [Tuples](#89-tuples)
    90. [Arrays](#90-arrays)
    91. [Byte Array](#91-byte-array)
    92. [Memory Array](#92-memory-array)
    93. [using for](#93-using-for)
    94. [Free Functions](#94-free-functions)
    95. [Initializers](#95initializers)
    96. [State Variables](#96-state-variables)
    97. [Import Contracts](#97-import-contracts)
    98. [selfdestruct](#98-selfdestruct)
    99. [State Variables in Proxy](#99-state-variables-in-proxy)
    100. [Function ID](#100-function-id)
    101. [Proxy Function Shadowing](#101-proxy-function-shadowing)
6. [Quiz](#quiz)
---

### [Block 1](youtube.com/watch?v=OOzyoaYIw2k)
#### 1. **Solidity versions**
- There are many versions of Solidity for projects and developers to choose from
	- At least one version is released every few months that makes optimizations/fixes bugs
	- A couple of breaking changes are introduced every year or so
- Using very old versions of Solidity prevents benefits of bug fixes and newer security checks.
- Using the latest versions might make contracts susceptible to undiscovered compiler bugs.
- Consider using one of these versions: _0.7.5, 0.7.6 or 0.8.4 ._
#### 2. **Unlocked pragma**
- Contracts should be deployed using the same compiler version/flags with which they have been tested.
- Using the caret symbol "unlocks" the pragma... specifies that any compiler version to the end of the breaking version can be used to compile the contract
	- ``^0.8.0``: any compiler version from ``0.8.0`` all the way to the last version in the ``0.8.z`` range can be used
- The use of unlocked pragma allows one Solidity compiler version to be used for testing and potentially a different one used for compiling while being deployed
	- This is risky as testing and deployment can be different
- It is recommended to not use the caret??
	- Locking the pragma (for e.g. by not using _^_ in _pragma solidity 0.5.10)_ ensures that contracts do not accidentally get deployed using an older compiler version with unfixed bugs.
#### 3. **Multiple Solidity pragma**
- It is better to use one Solidity compiler version across all contracts instead of different versions with different bugs and security checks.
#### 4. **Access control**
- Access control is the most fundamental aspect of smart contract security
- Any user can call public/external functions
- Contract functions executing critical logic should have appropriate access control enforced via address checks (e.g. owner, controller etc.) typically in modifiers.
- Missing checks allow attackers to control critical logic.
#### 5. Withdraw Funds
- Unprotected (_external_/_public_) function calls sending Ether/tokens to user-controlled addresses may allow users to withdraw unauthorized funds.
#### 6. selfdestruct
- An EVM instruction supported by a Solidity primitive which when used within a smart contract, destroys or kills that contract and transfers the balance to the specified recipient address
- A user/attacker can mistakenly/intentionally kill the contract.
- Protect access to such function
#### 7. Modifier side-effects
- Modifiers are used to implement different kinds of security checks, access control checks, or accounting checks
- Modifiers should only implement checks and not make state changes and external calls which violates the [checks-effects-interactions](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern) pattern.
- These side-effects may go unnoticed by developers/auditors because the modifier code is typically far from the function implementation.
#### 8. **Incorrect modifier**
- Modifiers should not only implement the correct access control or accounting checks, but they should also execute __ or revert along all the control flow paths within that modifier
	- The __ in lines the function code on which the modifier is applied
- If a modifier does not execute ___ or _revert_, the function using that modifier will return the default value causing unexpected behavior.
#### 9. Constructor names
- Before _solc 0.4.22_, constructor names had to be the same name as the contract class containing it.
- Misnaming it wouldn’t make it a constructor which has security implications.
- _Solc 0.4.22_ introduced the _constructor_ keyword.
- Until _solc 0.5.0_, contracts could have both old-style and new-style constructor names with the first defined one taking precedence over the second if both existed, which also led to security issues.
- _Solc 0.5.0_ forced the use of the _constructor_ keyword.
#### 10. Void Constructor
- Calls to base contract constructors that are unimplemented leads to misplaced assumptions.
- Check if the constructor is implemented or remove call if not.
#### 11. Constructor callValue
- This pitfall is related to constructors and the checks for any value sent in contract creation transactions triggering those constructors
- The creation code of a contract that does not define a constructor but has a base that does, did not revert for calls with non-zero callValue when such a constructor was not explicitly payable.
- This is due to a compiler bug introduced in _v0.4.5_ and fixed in _v0.6.8_.
- Starting from Solidity 0.4.5 the creation code of contracts without explicit payable constructor is supposed to contain a callvalue check that results in contract creation reverting, if non-zero value is passed.
- However, this check was missing in case no explicit constructor was defined in a contract at all, but the contract has a base that does define a constructor.
- In these cases it is possible to send value in a contract creation transaction or using inline assembly without revert, even though the creation code is supposed to be non-payable.
#### 12. delegatecall
- The calling contract makes a delegate call to called contract where the called contract excutes its logic on the state of the calling contract
- _delegatecall()_ or _callcode()_ to an address controlled by the user allows execution of malicious contracts in the context of the caller’s state.
- Ensure trusted destination addresses for such calls.
#### 13. Reentrancy
- Contract C1 makes a call to C2... C2 can be untrusted/malicious... C2 can call back into C1
- Untrusted external contract calls could callback leading to unexpected results such as multiple withdrawals or out-of-order events.
- Use check-effects-interactions (CEI) pattern or reentrancy guards.
	- External calls are made to contracts only after CEI checks
#### 14. ERC777
- ERC777 is an extension of ERC20 which makes certain improvements
	- One of the improvements is the idea of hooks
- ERC777 tokens allow arbitrary callbacks via hooks that are called during token transfers.
- Malicious contract addresses may cause reentrancy on such callbacks if reentrancy guards are not used.
#### 15. transfer() and send()
- Although _transfer()_ and _send()_ have been recommended as a security best-practice to prevent reentrancy attacks because they only forward 2300 gas, the gas repricing of opcodes may break deployed contracts.
- Use _call()_ instead, without hardcoded gas limits along with checks-effects-interactions pattern or reentrancy guards for reentrancy protection.
#### 16. Private Data
- Marking variables _private_ does not mean that they cannot be read on-chain.
- Private data should not be stored unencrypted in contract code or state but instead stored encrypted or off-chain.
#### 17. PRNG
- Pseudo random number generation
- PRNG relying on _block.timestamp_, _now_ or _blockhash_ can be influenced by miners to some extent and should be avoided.
#### 18. Time
- _block.timestamp_ and _block.number_ are not good proxies (i.e. representations, not to be confused with smart contract proxy/implementation pattern) for time because of issues with synchronization, miner manipulation and changing block times.
#### 19. Overflow/Underflow
- Applicable to any integer arithmetic used in a contract... wrapped values can occur when bounds for these integers aren't checked
- Not using OpenZeppelin’s SafeMath (or similar libraries) that check for overflows/underflows may lead to vulnerabilities or unexpected behavior if user/attacker can control the integer operands of such arithmetic operations.
- _Solc v0.8.0_ introduced default overflow/underflow checks for all arithmetic operations.
#### 20. Divide before Multiply
- Performing multiplication before division is generally better to avoid loss of precision because Solidity integer division might truncate.


### [Block 2](https://www.youtube.com/watch?v=fgXuHaZDenU)
#### 21. TOD
- Transaction Order Dependence
- Transactions submitted by users sit an a data structure known as the mempool
	- These transactions get picked by miners for inclusion within blocks
	- The transactions that are picked and the order of those transactions depends on multiple factors such as gas price
- Race conditions can be forced on specific Ethereum transactions by monitoring the mempool.
- For example, the classic ERC20 _approve()_ change can be front-run using this method.
- Do not make assumptions about transaction order dependence.
#### 22. ERC20 approve()
- The ERC20 token has a notion of an "owner" of a certain balance of those tokens... there is also the notion of a spender who can be approved be approved by the owner for a certain allowance amount which the spender is allowed to transfer
	- An owner can ``approve(100)`` and change their mind to ``approve(50)`` but if the sender address is malicious, they can front run the 100 getting 150
- Use _safeIncreaseAllowance()_ and _safeDecreaseAllowance()_ from OpenZeppelin’s _SafeERC20_ implementation to prevent race conditions from manipulating the allowance amounts.
#### 23. ecrecover
- The _ecrecover_ function is susceptible to signature malleability which could lead to replay attacks.
- Eliptic curve signatures in Ethereum have 3 components
	- Sig -> (v,r,s)
- The ecrecover function takes in a message hash and the signature associated with that message has and returns the Ethereum address that corresponds to the private key that was used to create that signature
	- If the attacker has access to one of these signatures, they can create a second valid signature without having access to the private key
		- This is due to the range of the s value
		- ecrecover allows both the upper and lower range for the s value
- The mitigation is the check that the s component is only in the lower range
- Consider using OpenZeppelin’s [ECDSA library](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/ECDSA.sol).
#### 24. transfer()
- The ERC20 specification says that a transfer function should return a boolean value.
	- A token contract may not adhere to this standard and it may not return a boolean value and this was okay until 0.4.22
- Contracts compiled with _solc >= 0.4.22_ interacting with such functions will revert.
- Use OpenZeppelin’s SafeERC20 wrappers.
#### 25. ownerOf()
- Similar to previous pitfal but applies to the ERC721 ownerOf() function
- The specification states that the function should return and address value
- Contracts compiled with _solc >= 0.4.22_ interacting with ERC721 _ownerOf()_ that returns a _bool_ instead of _address_ type will revert.
- Use OpenZeppelin’s ERC721 contracts.
#### 26. Contract Balance
- Related to the ether balance of a smart contrat
- A contract can receive Ether via _payable_ functions, _selfdestruct(), coinbase_ transaction or pre-sent before creation.
- Contract logic depending on _this.balance_ can therefore be manipulated.
#### 27. fallback vs receive
- The differences and similarties between these functions relate to the visibility, mutability, and the way ether transfers are handled
- Check that all precautions and subtleties of _fallback_/_receive_ functions related to visibility, state mutability and Ether transfers have been considered.
#### 28. Strict Equalities
- Use of strict equalities with tokens/Ether can accidentally/maliciously cause unexpected behavior.
- Consider using ``>=`` or ``<=`` instead of ``==`` for such variables depending on the contract logic.
#### 29. Locked Ether
- Locked ether refers to the situation where the contract has an ether balance that gets locked because ether can be sent to the contract via payable functions, but there is no way for users to withdraw that ether
- Contracts that accept Ether via _payable_ functions but without withdrawal mechanisms will lock up that Ether.
- Remove _payable_ attribute or add withdraw function.
#### 30. tx.origin
- The use of tx.origin is considered dangerous in certain situations
	- tx.origin gives the address of the EOA that originated the transaction
- Use of _tx.origin_ for authorization may be abused by a MITM malicious contract forwarding calls from the legitimate user who interacts with it.
- Use _msg.sender_ instead.
#### 31. Contract?
- A smart contract may want to know if the transaction or call made to it is coming from a contract account or an EOA
	- There are two popular ways to make that determination:
		- check if code size of the account is > 0
		- extcodesize > 0
			- non zero means the account has code, and there is a contract account
		- msg.sender == tx.origin
			- if true, msg.sender is an EOA
- Both have implications that need to be considered.
#### 32. delete Mapping
- Deleting a _struct_ that contains a _mapping_ will not delete the _mapping_ contents which may lead to unintended consequences.
- Best practice is to use an alternative approach such as considering the data structure meant to be deleted as locked to prevent future logic from using the mappings within the struct
#### 33. Tautology Contradiction
- A tautology is something that is always true while a contradiction is always false
- Tautologies (always true) or contradictions (always false) indicate potential flawed logic or redundant checks. e.g. _x >= 0_ which is always true if _x_ is _uint_.
#### 34. Boolean Constant
- Use of Boolean constants (_true_/_false_) in code (e.g. conditionals) is indicative of flawed logic.
#### 35. Boolean Equality
- Boolean variables can be checked within conditionals directly without the use of equality operators to _true_/_false_.
#### 36. Contract State Modifications
- Functions that modify state (in assembly or otherwise) but are labelled _constant_/_pure_/_view_ revert in _solc >=0.5.0_ (work in prior versions) because of the use of _STATICCALL_ opcode.
- When analyzing the security aspects of a contract it's good to pay attention to the mutability of the functions
#### 37. Return Values
- Checking the return values of functions at call sites is a classic software engineering best practice
- Ensure that return values of low-level calls (_call_/_callcode_/_delegatecall_/_send_/etc.) are checked to avoid unexpected failures.
	- The low-level call primitives do not revert under exceptional behavior but instead return success or failure as a return value
#### 38. Account Existence
- Low-level calls _call_/_delegatecall_/_staticcall_ return true even if the account called is non-existent (per EVM design).
- Account existence must be checked prior to calling if needed.
#### 39. Shadowing Built In
- Local variables, state variables, functions, modifiers, or events with names that shadow (i.e. override) builtin Solidity symbols e.g. _now_ or other declarations from the current scope are misleading and may lead to unexpected usages and behavior.
#### 40. Shadowing State Variables
- Shadowing state variables in derived contracts may be dangerous for critical variables such as contract owner (for e.g. where modifiers in base contracts check on base variables but shadowed variables are set mistakenly) and contracts incorrectly use base/shadowed variables.
- Do not shadow state variables.


### [Block 3](https://www.youtube.com/watch?v=YVewx1xVROE)
#### 41. Pre-declaration
- Usage of a variable before its declaration (either declared later or in another scope) leads to unexpected behavior in _solc < 0.5.0_ but _solc >= 0.5.0_ implements C99-style scoping rules where variables can only be used after they have been declared and only in the same or nested scopes.
#### 42. Costly Operations
- Operations such as state variable updates (use SSTOREs) inside a loop cost a lot of gas, are expensive and may lead to out-of-gas errors.
- Optimizations using local variables are preferred.
	- Local variables are allocated in memory and memory updates using MSTORE only costs 3 gas units compared to the 5000 to 20000 that storage updates cost
#### 43. Costly Calls
- Calls to external contracts inside a loop are dangerous (especially if the loop index can be user-controlled) because it could lead to DoS if one of the calls reverts or execution runs out of gas.
- Avoid calls within loops, check that loop index cannot be user-controlled or is bounded.
#### 44. Block Limit Gas
- Ethereum blocks have a notion of a "block gas limit" which limits the total amount of gas units consumed by all the transactions included in a block to a maximum upper bound
- Programming patterns such as looping over arrays of unknown size may lead to DoS when the gas cost of execution exceeds the block gas limit.
- Evaluate loops and ensure expensive operations aren't used inside the loops
#### 45. Events
- Events for critical state changes (e.g. owner and other critical parameters) should be emitted for tracking this off-chain.
- This helps because we can monitor offchain rather than querying the contracts themselves
- Important for transparency and UX
#### 46. Event Parameters
- Parameters are "indexed" with the use of the indexed keyword
- Parameters of certain events are expected to be indexed (e.g. ERC20 Transfer/Approval events) so that they’re included in the block’s bloom filter for faster access.
- Failure to do so might confuse off-chain tooling looking for such indexed events.
- The best practice is to added indexed to critical parameters
	- This comes at the cost of additional gas usage but allows faster query
#### 47. Event Signatures
- Contract types used in events in libraries cause an incorrect event signature hash.
- Instead of using the type `address` in the hashed signature, the actual contract name was used, leading to a wrong hash in the logs.
- This is due to a compiler bug introduced in _v0.5.0_ and fixed in _v0.5.8_.
#### 48. Unary Expression
- Unary expressions are where an operator is used on a single operand as opposed to two operands (binary expression)
- Unary expressions such as _x =+ 1_ are likely errors where the programmer really meant to use _x += 1_. Unary _+_ operator was deprecated in _solc v0.5.0_.
#### 49. Zero Addresses
- An Ethereum address is 20 bytes and if all this bytes are 0, then it is referred to as a zero address
- State variables and local variables of address types have a default value of 0
- Setters of address type parameters should include a zero-address check otherwise contract functionality may become inaccessible or tokens burnt forever.
#### 50. Critical Addresses
- Certain addresses in a contract can be considered critical (owner, addresses of other smart contracts used by the dApp)
- Changing critical addresses in contracts should be a two-step process where the first transaction (from the old/current address) registers the new address (i.e. grants ownership) and the second transaction (from the new address) replaces the old address with the new one (i.e. claims ownership).
- This gives an opportunity to recover from incorrect addresses mistakenly used in the first step.
	- If not, contract functionality might become inaccessible.
#### 51. assert()
- ``assert()`` should only be used to check or verify program invariants within a smart contract
- ``assert()`` should not be used to validate user inputs
	- Should be done by ``require()``
- Invariants in _assert()_ and _require()_ statements should not modify the state per best practices.
#### 52. assert() vs require()
- ``require()`` should be used for checking error conditions on inputs and return values while ``assert()`` should be used for invariant checking.
- Between _solc 0.4.10_ and _0.8.0_, ``require()`` used ``REVERT (0xfd)`` opcode which refunded remaining gas on failure while ``assert()`` used ``INVALID (0xfe)`` opcode which consumed all the supplied gas.
#### 53. Keywords
- Over time, different keywords have been deprecated to favor one over the other
- Use of deprecated functions/operators such as _block.blockhash()_ for _blockhash()_, _msg.gas_ for _gasleft(), throw_ for _revert()_, _sha3()_ for _keccak256()_, _callcode()_ for _delegatecall(),_ _suicide()_ for _selfdestruct(), constant_ for _view_ or _var_ for _actual type name_ should be avoided to prevent unintended errors with newer compiler versions.
- For now, they produce compiler warnings... over time these warning may be converted to compiler errors
- Best practice is to avoid deprecated keywords
#### 54. Visibility
- Functions in Solidity have the notion of visibility (public/external/internal/private)
- Functions without a visibility type specifier are _public_ by default in _solc < 0.5.0_.
	- This can lead to a vulnerability where a malicious user may make unauthorized state changes.
	- _solc >= 0.5.0_ requires explicit function visibility specifiers.
#### 55. Incorrect Inheritance
- Contracts inheriting from multiple contracts with identical functions should specify the correct inheritance order i.e. more general to more specific to avoid inheriting the incorrect function implementation.
- If more than one base contract defines an identical function,  the function implementation that gets included in the derived contract depends on the inheritance order
- Best practice is for order to be from more general to specific
#### 56. Missing Inheritance
- A contract might appear (based on name or functions implemented) to inherit from another interface or abstract contract without actually doing so.
#### 57. Gas Griefing
- Users submit transactions to a smart contract on the blockchain or they can submit meta transactions that are sent to transaction relayers where the relayer is supposed to pay the gas
- Transaction relayers need to be trusted to provide enough gas for the transaction to succeed.
#### 58. Reference Parameters
- Structs/Arrays/Mappings passed as arguments to a function may be by value (memory) or reference (storage) as specified by the data location (optional before _solc 0.5.0_).
- Ensure correct usage of memory and storage in function parameters and make all data locations explicit.
#### 59. Arbitrary Jump
- Function type variables should be carefully handled and avoided in assembly manipulations to prevent jumps to arbitrary code locations.
- Assembly, in general, is very tricky to use... it bypasses many security aspects of Solidity such as type safety
	- If possible, avoid the use of assembly
#### 60. Hash Collisions
- using ``abi.encodePacked()`` with multiple variable length arguments can lead to hash collisions
	- This happens because ``abi.encodePacked()`` does not 0 pad the arguments and it doesn't save any length information for arguments
- Using ``abi.encodePacked()`` with multiple variable length arguments can, in certain situations, lead to a hash collision.
- Do not allow users access to parameters used in ``abi.encodePacked()``, use fixed length arrays or use ``abi.encode()``.

### [Block 4](https://www.youtube.com/watch?v=byA3MLLiKMM)
#### 61. Dirty Bits
- EVM word size is 256bits or 32bytes
	- There are multiple types in Solidity whose size is less than 32 bytes
- Types that do not occupy the full 32 bytes might contain “dirty higher order bits” which does not affect operation on types but gives different results with _msg.data_.
#### 62. Incorrect Shifts
- Solidity supports three different shift operations:
	- shl(x,y): shift left
	- shr(x,y): shift right
	- sar(x,y): shift arithmetic right
- Shift operators (_shl(x, y)_, _shr(x, y)_, _sar(x, y)_) in Solidity assembly apply the shift operation of _x_ bits on _y_ and not the other way around, which may be confusing.
- Check if the values in a shift operation are reversed.
#### 63. Assembly
- The use of assembly is considered a security risk because assembly bypasses multiple security checks such as type safety
	- Developers use assembly to make operations more optimized and efficient from a gas perspective
- Use of EVM assembly is error-prone and should be avoided or double-checked for correctness.
#### 64. RTLO
- Right to Left Override
- Malicious actors can use the Right-To-Left-Override unicode character to force RTL text rendering and confuse users as to the real intent of a contract.
- U+202E character should not appear in the source code of a smart contract.
#### 65. Constant
- Constant variables are state variables that has a constant value throughout the duration of the contract
- Constant state variables should be declared constant to save gas.
- Reading constant variables doesn't require the expensive SLOAD operation
- While this is gas saving, it also improves security as constant variables cannot be accidently changed within the function of the contract
#### 66. Variables names
- Variables with similar names could be confused for each other and therefore should be avoided.
#### 67. Uninitialized Variables
- Uninitialized state/local variables are assigned zero values by the compiler and may cause unintended results e.g. transferring tokens to zero address.
- Explicitly initialize all state/local variables.
#### 68. Storage Pointers
- Uninitialized local storage variables can point to unexpected storage locations in the contract, which can lead to vulnerabilities.
- _Solc 0.5.0_ and above disallow such pointers.
#### 69. Function Pointers
- Calling uninitialized function pointers in constructors of contracts compiled with _solc_ versions _0.4.5-0.4.25_ and _0.5.0-0.5.7_ lead to unexpected behavior because of a compiler bug.
#### 70. Number Literals
- Number literals with many digits should be carefully checked as they are prone to error.
- Best practice is to use Ether/Time suffix supported by Solidity as applicable or use the supported scientific notation
#### 71. Enum
- _Solc < 0.4.5_ produced unexpected behavior with out-of-range enums.
	- Enum{a}... E(1) -> Out of range
		- Enums are 0 indexed
- Check enum conversion or use a newer compiler.
#### 72. Public Functions
- Functions have 4 visibility specifiers: public, external, internal, private
- _Public_ functions that are never called from within the contracts should be declared _external_ to save gas.
	- The arguments of public functions need to be copied from the calldata component of the EVM to the memory component which produces more bytecode... therefore consuming more gas
#### 73. Dead Code
- Dead code is any contract code that is unused from the contract's perspective or unreachable from a control flow perspective
- Dead code increases the code size of the contract which at deployment leads to increased gas costs
- Dead code may be indicative of programmer error, missing logic or potential optimization opportunity, which needs to be flagged for removal or addressed appropriately.
#### 74. Return Value
- Unused return values of function calls are indicative of programmer errors which may have unexpected behavior.
#### 75. Unused Variables
- Unused state/local variables may be indicative of programmer error, missing logic or potential optimization opportunity, which needs to be flagged for removal or addressed appropriately.
#### 76. Redundant Statements
- Statements with no effects that do not produce code may be indicative of programmer error or missing logic, which needs to be flagged for removal or addressed appropriately.
#### 77. Storage Array
- Assigning an array of signed integers to a storage array of different type can lead to data corruption in that array.
	- This was enabled by ABIEncoderV2 which was a pragma directive that needed to be explicitly specified in older versions (now used by default)
- This is due to a compiler bug introduced in _v0.4.7_ and fixed in _v0.5.10_.
#### 78. Constructor Arguments
- A contract's constructor which takes structs or arrays that contain dynamically sized arrays reverts or decodes to invalid data when ABIEncoderV2 is used.
- This is due to a compiler bug introduced in _v0.4.16_ and fixed in _v0.5.9_.
#### 79. Arrays
- Storage arrays containing structs or other statically sized arrays are not read properly when directly encoded in external function calls or in _abi.encode()_.
- This is due to a compiler bug introduced in _v0.4.16_ and fixed in _v0.5.10_.
#### 80. Structs
- Reading from calldata structs that contain dynamically encoded, but statically sized members can result in incorrect values.
- This is due to a compiler bug introduced in _v0.5.6_ and fixed in _v0.5.11_.

### [Block 5](https://www.youtube.com/watch?v=vyWLO5Dlg50)
#### 81. Storage
- Storage structs and arrays with types shorter than 32 bytes can cause data corruption if encoded directly from storage using ABIEncoderV2.
- This is due to a compiler bug introduced in _v0.5.0_ and fixed in _v0.5.7_.
#### 82. Loads
- The Yul optimizer incorrectly replaces _MLOAD_ and _SLOAD_ calls with values that have been previously written to the load location.
- This can only happen if ABIEncoderV2 is activated and the experimental Yul optimizer has been activated manually in addition to the regular optimizer in the compiler settings.
- This is due to a compiler bug introduced in _v0.5.14_ and fixed in _v0.5.15_.
#### 83. Arrays
- Accessing array slices of arrays with dynamically encoded base types (e.g. multi-dimensional arrays) can result in invalid data being read.
- This is due to a compiler bug introduced in _v0.6.0_ and fixed in _v0.6.8_.
#### 84. Escaping
- String literals containing double backslash characters passed directly to external or encoding function calls can lead to a different string being used when ABIEncoderV2 is enabled.
- This is due to a compiler bug introduced in _v0.5.14_ and fixed in _v0.6.8_.
#### 85. Shift
- Double bitwise shifts by large constants whose sum overflows 256 bits can result in unexpected values.
- Nested logical shift operations whose total shift size is ``2**256`` or more are incorrectly optimized.
- This only applies to shifts by numbers of bits that are compile-time constant expressions.
- This happens when the optimizer is used and _evmVersion >= Constantinople._
- This is due to a compiler bug introduced in _v0.5.5_ and fixed in _v0.5.6_.
#### 86. byte Instruction
- The optimizer incorrectly handles byte opcodes whose second argument is 31 or a constant expression that evaluates to 31.
- This can result in unexpected values.
- This can happen when performing index access on _bytesNN_ types with a compile time constant value (not index) of 31 or when using the byte opcode in inline assembly.
- This is due to a compiler bug introduced in _v0.5.5_ and fixed in _v0.5.7_.
#### 87. Assignment
- The Yul optimizer can remove essential assignments to variables declared inside _for_ loops when Yul's _continue_ or _break_ statement is used mostly while using inline assembly with _for_ loops and _continue_ and _break_ statements.
- This is due to a compiler bug introduced in _v0.5.8_/_v0.6.0_ and fixed in _v0.5.16_/_v0.6.1_.
#### 88. Private Functions
- While private methods of base contracts are not visible and cannot be called directly from the derived contract, it is still possible to declare a function of the same name and type and thus change the behaviour of the base contract's function.
- This is due to a compiler bug introduced in _v0.3.0_ and fixed in _v0.5.17_.
#### 89. Tuples
- Tuple assignments with components that occupy several stack slots, i.e. nested tuples, pointers to external functions or references to dynamically sized calldata arrays, can result in invalid values.
- This is due to a compiler bug introduced in _v0.1.6_ and fixed in _v0.6.6_.
#### 90. Arrays
- When assigning a dynamically sized array with types of size at most 16 bytes in storage causing the assigned array to shrink, some parts of deleted slots were not zeroed out.
- This is due to a compiler bug fixed in _v0.7.3_.
#### 91. byte Array
- Copying an empty byte array (or string) from memory or calldata to storage can result in data corruption if the target array's length is increased subsequently without storing new data.
- This is due to a compiler bug fixed in _v0.7.4_.
#### 92. Memory Array
- The creation of very large memory arrays can result in overlapping memory regions and thus memory corruption.
- This is due to a compiler bug introduced in _v0.2.0_ and fixed in _v0.6.5_.
#### 93. using for
- Function calls to internal library functions with calldata parameters called via “_using for”_ can result in invalid data being read.
- This is due to a compiler bug introduced in _v0.6.9_ and fixed in _v0.6.10_.
#### 94. Free Functions
- Free functions are functions that are declared outside of a contract
- The compiler does not flag an error when two or more free functions (functions outside of a contract) with the same name and parameter types are defined in a source unit or when an imported free function alias shadows another free function with a different name but identical parameter types.
- This is due to a compiler bug introduced in _v0.7.1_ and fixed in _v0.7.2_.
#### 95.Initializers
- Proxy based architecture is used for upgradability and other aspects desired in smart contract applications
- There is typically a proxy contract that performs a delegatecall to a logic contract
	- Because of the delegatecall, the logic contract implements logic that executes on the state of the proxy contract
- Proxy-based upgradeable contracts need to use _public_ initializer functions instead of constructors that need to be explicitly called only once.
- Preventing multiple invocations of such initializer functions (e.g. via _initializer_ modifier from OpenZeppelin’s _Initializable_ library) is a must.
#### 96. State Variables
- Initializing state variables in a proxy based setup
	- This should be done in initializer functions and not as part of the state variable declarations in which case they won’t be set.
#### 97. Import Contracts
- Contracts used in a proxy based set up may derive from other libraries or other contracts from the project itself which can be defined in other files (in which case they are imported to be used in the proxy contract)
- Contracts imported from proxy-based upgradeable contracts should also be upgradeable where such contracts have been modified to use initializers instead of constructors.
#### 98. selfdestruct
- Avoid  ``selfdestruct`` or ``delegatecall`` in proxy-based upgradeable contracts
	- This will cause the logic contract to be destroyed and all contract instances will end up delegating calls to an address without any code.
#### 99. State variables in proxy
- The declaration order/layout and type/mutability of state variables in such contracts should be preserved exactly while upgrading to prevent critical storage layout mismatch errors.
#### 100. Function ID
- There is a security pitfall related to Function ID collision between proxy/implementation in proxy-based upgradeable contracts
- Solidity and EVM have the notion of a function selector which is the keccak hash of the function signatures.
	- These selectors are used to determine which contract function is being called
- At runtime, the function dispatcher in the contract bytecode should determine, by looking at the function selector, if one of the functions in the proxy is being called or it needs to be delegated to the implementation contract
- Malicious proxy contracts may exploit function ID collision to invoke unintended proxy functions instead of delegating to implementation functions.
- Check for function ID collisions.
#### 101. Proxy Function Shadowing
- Instead of the proxy contract covertly trying to hijack calls meant for the implementation by declaring functions whose IDs collide with the implementation contract function, the can simply shadow the functions in the implementation contract
	- A proxy contract can declare functions that have the same name and the same parameters/numbers/types as in the implementation contract
	- The function dispatcher would simply call the proxy contract function instead of forwarding it to the implementation contract
- Shadow functions in proxy contract prevent functions in logic contract from being invoked.
#### Compiler bugs
- This module has discussed multiple compiler bugs
	- Many have come form the ABI encoded v2 primitive, some have come from the use of optimization... in these instances, the bugs may appear to be severe or critical in nature but they require very specific data structures or very specific conditions in order to be triggered
- Such complex data structures aren't typically encountered in smart contracts, but compiler bugs should be taken very seriously
	- Unlike smart contracts that may differ from each other (in logic and data structures), the compiler is a common dependency
	- The compiler can be a single point of failure for any smart contract compiled with that version
- It must be recognized that the compiler is another software and just like any software the compiler is bound to have bugs
	- Perhaps even more so as the compiler is significantly more complex than a smart contract or any other general software package
- Know which features of a compiler version is being extensively used and which features are considered experimental... try to stay away from experimental features

### Quiz
#### Q1 The use of pragma in the given contract snippet

```js
pragma solidity ^0.6.0;

contract test {
   // Assume other required functionality is correctly implemented
   // Assume this contract can work correctly without modifications across 0.6.x/0.7.x/0.8.x compiler versions
}
```

- [ ]  A) Is incorrect and will cause a compilation error
- [ ]  B) Allows testing with 0.6.11 but accidental deployment with buggy 0.6.5
- [ ]  C) Is illustrative of risks from using a much older Solidity version (assume current version is 0.8.9)
- [ ]  D) None of the above

<details>
<summary>Answer</summary>
B,C
<p>
Unlocked pragma: Contracts should be deployed using the same compiler version/flags with which they have been tested. Locking the pragma (for e.g. by not using ^ in pragma solidity 0.5.10) ensures that contracts do not accidentally get deployed using an older compiler version with unfixed bugs.<br>
There were bugs that were fixed in versions between 0.6.5 and 0.6.11 which means those fixes were absent in 0.6.5. Choice B was about these aspects.<br>
Illustrative means "serving as an example or explanation." So the use of ^0.6.0 when the latest available version is 0.8.9 (as mentioned in choice C) is an example of using a much older compiler version when newer versions with bug fixes and more security features e.g. built-in overflow checks in ^0.8.0 are available.
</p>
</details>

#### Q2 The given contract snippet has

```js
pragma solidity 0.8.4;

contract test {

   // Assume other required functionality is correctly implemented

   function kill() public {
      selfdestruct(payable(0x0));
   }
}
```

- [ ]  A) Unprotected call to selfdestruct allowing anyone to destroy this contract
- [ ]  B) Dangerous use of zero address leading to burning of contract balance
- [ ]  C) A compiler error because of the use of the kill reserved keyword
- [ ]  D) None of the above

<details>
<summary>Answer</summary>
A,B
<p>
Unprotected call to selfdestruct: A user/attacker can mistakenly/intentionally kill the contract. Protect access to such functions.<br>
Zero Address Check: address(0) which is 20-bytes of 0’s is treated specially in Solidity contracts because the private key corresponding to this address is unknown. Ether and tokens sent to this address cannot be retrieved and setting access control roles to this address also won’t work (no private key to sign transactions). Therefore zero addresses should be used with care and checks should be implemented for user-supplied address parameters.<br>
Reserved Keywords: These keywords are reserved in Solidity. They might become part of the syntax in the future: after, alias, apply, auto, case, copyof, default, define, final, immutable, implements, in, inline, let, macro, match, mutable, null, of, partial, promise, reference, relocatable, sealed, sizeof, static, supports, switch, typedef, typeof, unchecked
</p>
</details>

#### Q3 The given contract snippet has

```js
pragma solidity 0.8.4;

contract test {

    // Assume other required functionality is correctly implemented

    modifier onlyAdmin() {
        // Assume this is correctly implemented
        _;
    }

    function transferFunds(address payable recipient, uint amount) public {
        recipient.transfer(amount);
   }
}
```

- [ ]  A) Missing use of `onlyAdmin` modifier on transferFunds
- [ ]  B) Missing return value check on transfer
- [ ]  C) Unprotected withdrawal of funds
- [ ]  D) None of the above
<details>
<summary>Answer</summary>
A,C
<p>
Incorrect access control: Contract functions executing critical logic should have appropriate access control enforced via address checks (e.g. owner, controller etc.) typically in modifiers. Missing checks allow attackers to control critical logic.<br>
Unprotected withdraw function: Unprotected (external/public) function calls sending Ether/tokens to user-controlled addresses may allow users to withdraw unauthorized funds.<br>
`transferFunds()` clearly lets anyone withdraw any amount to any address. The only hint in the Q is the `onlyAdmin` modifier. While some other access control may also have been acceptable, the focus is on the code snippet provided and hence (A).<br>
transfer (unlike send) does not return a success/failure return value. It reverts on failure. So there is nothing to be checked. Note that ERC20's transfer() returns a boolean which should be checked
</p>
</details>

#### Q4 In the given contract snippet

```js
pragma solidity 0.8.4;

contract test {

    // Assume other required functionality is correctly implemented

    mapping (uint256 => address) addresses;
    bool check;

    modifier onlyIf() {
        if (check) {
            _;
        }
    }

    function setAddress(uint id, address addr) public {
        addresses[id] = addr;
    }

    function getAddress(uint id) public onlyIf returns (address) {
        return addresses[id];
    }
}
```

- [ ]  A) getAddress returns the expected addresses if check is true
- [ ]  B) getAddress returns zero address if check is false
- [ ]  C) getAddress reverts if check is false
- [ ]  D) None of the above
<details>
<summary>Answer</summary>
A,B
</details>

#### Q5 The security concern(s) in the given contract snippet is/are

```js
pragma solidity 0.8.4;

contract test {

    // Assume other required functionality is correctly implemented

    modifier onlyAdmin {
     // Assume this is correctly implemented
        _;
    }

    function delegate (address addr) external {  addr.delegatecall(abi.encodeWithSignature("setDelay(uint256)"));
    }
}
```

- [ ]  A) Potential controlled delegatecall risk
- [ ]  B) delegatecall return value is not checked
- [ ]  C) `delegate()` may be missing `onlyAdmin` modifier
- [ ]  D) `delegate()` does not check for contract existence at addr
<details>
<summary>Answer</summary>
A,B,C,D
<p>
Controlled delegatecall: delegatecall() or callcode() to an address controlled by the user allows execution of malicious contracts in the context of the caller’s state. Ensure trusted destination addresses for such calls.<br>
Return values of low-level calls: Ensure that return values of low-level calls (call/callcode/delegatecall/send/etc.) are checked to avoid unexpected failures.<br>
Incorrect access control: Contract functions executing critical logic should have appropriate access control enforced via address checks (e.g. owner, controller etc.) typically in modifiers. Missing checks allow attackers to control critical logic.<br>
Account existence check for low-level calls: Low-level calls call/delegatecall/staticcall return true even if the account called is non-existent (per EVM design). Account existence must be checked prior to calling if needed.
</p>
</details>

#### Q6 The vulnerability/vulnerabilities present in the given contract snippet is/are

```js
pragma solidity 0.7.0;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// which works with 0.7.0

contract test {

 // Assume other required functionality is correctly implemented
 // For e.g. users have deposited balances in the contract
 // Assume nonReentrant modifier is always applied

    mapping (address => uint256) balances;

    function withdraw(uint256 amount) external nonReentrant {
        msg.sender.call{value: amount}("");
        balances[msg.sender] -= amount;
    }
}
```

- [ ]  A) Reentrancy
- [ ]  B) Integer underflow leading to wrapping
- [ ]  C) Missing check on user balance in `withdraw()`
- [ ]  D) All of the above
<details>
<summary>Answer</summary>
B,C or A,B,C or A,B,C,D or D
<p>
Note: While the initial platform-specified correct answer for Q6 was B,C, it was determined that this Q&A had some latent ambiguity with answer choice A. Therefore, all answer combinations indicated above were considered as valid and scores adjusted accordingly.
</p>
<p>
The code in this question was unintentionally missing inheritance from the ReentrancyGuard Contract. While there's a lot of discussion about the correct meaning of the term "underflow", this is how it is used in the <a href="https://docs.soliditylang.org/en/v0.8.9/control-structures.html?highlight=underflow#checked-or-unchecked-arithmetic">Solidity Documentation</a> and other related literature.
</p>
<p>
Reentrancy vulnerabilities: Untrusted external contract calls could callback leading to unexpected results such as multiple withdrawals or out-of-order events. Use check-effects-interactions pattern or reentrancy guards.<br>
Integer overflow/underflow: Not using OpenZeppelin’s SafeMath (or similar libraries) that check for overflows/underflows may lead to vulnerabilities or unexpected behavior if user/attacker can control the integer operands of such arithmetic operations. Solc v0.8.0 introduced default overflow/underflow checks for all arithmetic operations.<br>
</p>
</details>

#### Q7 The security concern(s) in the given contract snippet is/are

```js
pragma solidity 0.8.4;

contract test {

 // Assume other required functionality is correctly implemented

    uint256 private constant secret = 123;

    function diceRoll() external view returns (uint256) {
        return (((block.timestamp * secret) % 6) + 1);
    }
}
```

- [ ]  A) `diceRoll()` visibility should be public instead of external
- [ ]  B) The private variable secret is not really hidden from users
- [ ]  C) `block.timestamp` is an insecure source of randomness
- [ ]  D) Integer overflow
<details>
<summary>Answer</summary>
B,C
<p>
Private on-chain data: Marking variables private does not mean that they cannot be read on-chain. Private data should not be stored unencrypted in contract code or state but instead stored encrypted or off-chain.<br>
Weak PRNG: PRNG relying on block.timestamp, now or blockhash can be influenced by miners to some extent and should be avoided.<br>
Making it public in this case should not affect gas given that there are no function arguments to copy over (if there were parameters/arguments, making it public would increase gas). Even otherwise, making it public from external should not affect the attack surface of the contract because it will only further allow (trusted) contract functions to call it.<br>
E.: The logic of diceRoll() is broken as it returns only 1 or 4 🙂
</p>
</details>

#### Q8 The security concern(s) in the given contract snippet is/are

```js
pragma solidity 0.8.4;

contract test {

    // Assume other required functionality is correctly implemented
    // Contract admin set to deployer in constructor (not shown)
    address admin;

    modifier onlyAdmin {
        require(tx.origin == admin);
        _;
    }

    function emergencyWithdraw() external payable onlyAdmin {
        msg.sender.transfer(address(this).balance);
    }
}
```

- [ ]  A) Incorrect use of `transfer()` instead of using `send()`
- [ ]  B) Potential man-in-the-middle attack on admin address authentication
- [ ]  C) Assumption on contract balance might cause a revert
- [ ]  D) Missing event for critical `emergencyWithdraw()` function
<details>
<summary>Answer</summary>
B,D
<p>
Neither transfer nor send are recommended anymore.
</p>
<p>
Avoid transfer()/send() as reentrancy mitigations: Although transfer() and send() have been recommended as a security best-practice to prevent reentrancy attacks because they only forward 2300 gas, the gas repricing of opcodes may break deployed contracts. Use call() instead, without hardcoded gas limits along with checks-effects-interactions pattern or reentrancy guards for reentrancy protection.<br>
Dangerous usage of tx.origin: Use of tx.origin for authorization may be abused by a MITM malicious contract forwarding calls from the legitimate user who interacts with it. Use msg.sender instead.<br>
[Regarding C.:] 0 transfers should not revert 😅. Even if they did, in this context, it wouldn't be considered a "security" concern because there would be nothing to withdraw and so a revert wouldn't be a concern w.r.t. any locked funds as such.<br>
Missing events: Events for critical state changes (e.g. owner and other critical parameters) should be emitted for tracking this off-chain.
</p>
</details>

#### Q9 The given contract snippet is vulnerable because of

```js
pragma solidity 0.8.4;

contract test {

    // Assume other required functionality is correctly implemented

    uint256 private constant MAX_FUND_RAISE = 100 ether;
    mapping (address => uint256) contributions;

    function contribute() external payable {
        require(address(this).balance != MAX_FUND_RAISE);
        contributions[msg.sender] += msg.value;
    }
}
```

- [ ]  A) Integer overflow leading to wrapping
- [ ]  B) Overly permissive function visibility of `contribute()`
- [ ]  C) Incorrect use of `msg.sender`
- [ ]  D) Use of strict equality (`!=`) may break the `MAX_FUND_RAISE` constraint
<details>
<summary>Answer</summary>
D
<p>
Visibility of external or public is required for a function to be payable. This use of message sender is very common and correct.
</p>
<p>
Dangerous strict equalities: Use of strict equalities with tokens/Ether can accidentally/maliciously cause unexpected behavior. Consider using >= or <= instead of == for such variables depending on the contract logic.<br>
Unexpected Ether and this.balance: A contract can receive Ether via payable functions, selfdestruct(), coinbase transaction or pre-sent before creation. Contract logic depending on this.balance can therefore be manipulated.<br>
Given the compiler version, even if there is an attempted integer overflow at runtime, it will revert before overflowing (because of inbuilt checks) with an exception but will not wrap. So A is not a vulnerability. While this is true in general, this snippet cannot be overflowed because of its dependence on msg.value.
</p>
</details>


#### Q10 In the given contract snippet, the require check will

```js
pragma solidity 0.8.4;

contract test {

    // Assume other required functionality is correctly implemented

    function callMe (address target) external {
        (bool success, ) = target.call("");
        require(success);
    }
}
```

- [ ]  A) Pass only if target is an existing contract address
- [ ]  B) Pass for a non-existent contract address
- [ ]  C) Pass always
- [ ]  D) Fail always
<details>
<summary>Answer</summary>
B
<p>
Account existence check for low-level calls: Low-level calls call/delegatecall/staticcall return true even if the account called is non-existent (per EVM design). Account existence must be checked prior to calling if needed.
</p>
</details>

#### Q11 The security concern(s) in the given contract snippet is/are

```js
pragma solidity 0.8.4;

contract test {

    // Assume other required functionality is correctly implemented
    // Assume admin is set correctly to contract deployer in constructor
    address admin;

    function setAdmin (address _newAdmin) external {
        admin = _newAdmin;
    }
}
```

- [ ]  A) Missing access control on critical function
- [ ]  B) Missing zero-address validation
- [ ]  C) Single-step change of critical address
- [ ]  D) Missing event for critical function
<details>
<summary>Answer</summary>
A,B,C,D
<p>
Incorrect access control: Contract functions executing critical logic should have appropriate access control enforced via address checks (e.g. owner, controller etc.) typically in modifiers. Missing checks allow attackers to control critical logic.<br>
Missing zero address validation: Setters of address type parameters should include a zero-address check otherwise contract functionality may become inaccessible or tokens burnt forever.<br>
Critical address change: Changing critical addresses in contracts should be a two-step process where the first transaction (from the old/current address) registers the new address (i.e. grants ownership) and the second transaction (from the new address) replaces the old address with the new one (i.e. claims ownership). This gives an opportunity to recover from incorrect addresses mistakenly used in the first step. If not, contract functionality might become inaccessible.<br>
Missing events: Events for critical state changes (e.g. owner and other critical parameters) should be emitted for tracking this off-chain.
</p>
</details>

#### Q12 The security concern(s) in the given contract snippet is/are

```js
pragma solidity 0.8.4;

contract test {

    // Assume other required functionality is correctly implemented

    address admin;
    address payable pool;

   constructor(address _admin) {
        admin = _admin;
    }

    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    }

    function setPoolAddress(address payable _pool) external onlyAdmin {
        pool = _pool;
    }

    function addLiquidity() payable external {
        pool.transfer(msg.value);
    }
}
```

- [ ]  A) Uninitialized pool storage variable which assumes `setPoolAddress()` will be called before addLiquidity()
- [ ]  B) Incorrect use of modifier onlyAdmin on `setPoolAddress()`
- [ ]  C) Missing zero-address validation for _pool in `setPoolAddress()`
- [ ]  D) Transaction order dependence risk from admin front-running with pool address change
<details>
<summary>Answer</summary>
A,C,D
<p>
Function invocation order: Externally accessible functions (external/public visibility) may be called in any order (with respect to other defined functions). It is not safe to assume they will only be called in the specific order that makes sense to the system design or is implicitly assumed in the code. For e.g., initialization functions (used with upgradeable contracts that cannot use constructors) are meant to be called before other system functions can be called.<br>
Uninitialized state/local variables: Uninitialized state/local variables are assigned zero values by the compiler and may cause unintended results e.g. transferring tokens to zero address. Explicitly initialize all state/local variables.<br>
Missing zero address validation: Setters of address type parameters should include a zero-address check otherwise contract functionality may become inaccessible or tokens burnt forever.<br>
Transaction order dependence: Race conditions can be forced on specific Ethereum transactions by monitoring the mempool. For example, the classic ERC20 approve() change can be front-run using this method. Do not make assumptions about transaction order dependence.
</p>
</details>

#### Q13 The security concern(s) in the given proxy-based implementation contract snippet is/are

```js
pragma solidity 0.8.4;
import "https://github.com/OpenZeppelin/openzeppelin-contracts-upgradeable/blob/master/contracts/proxy/utils/Initializable.sol";

contract test is Initializable {

    // Assume other required functionality is correctly implemented

    address admin;
    uint256 rewards = 10;

    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    }

    function initialize (address _admin) external {
        require(_admin != address(0));
        admin = _admin;
    }

    function setRewards(uint256 _rewards) external onlyAdmin {
        rewards = _rewards;
    }
}
```

- [ ]  A) Imported contracts are not upgradeable
- [ ]  B) Multiple `initialize()` calls possible which allows anyone to reset the admin
- [ ]  C) rewards will be 0 in the proxy contract before `setRewards()` is called by it
- [ ]  D) All the above
<details>
<summary>Answer</summary>
B,C
<p>
There are no imported contracts that need to be made upgradable (by implementing Initializable).
</p>
<p>
Import upgradeable contracts in proxy-based upgradeable contracts: Contracts imported from proxy-based upgradeable contracts should also be upgradeable where such contracts have been modified to use initializers instead of constructors.<br>
Unprotected initializers in proxy-based upgradeable contracts: Proxy-based upgradeable contracts need to use public initializer functions instead of constructors that need to be explicitly called only once. Preventing multiple invocations of such initializer functions (e.g. via initializer modifier from OpenZeppelin’s Initializable library) is a must.<br>
Initializing state-variables in proxy-based upgradeable contracts: This should be done in initializer functions and not as part of the state variable declarations in which case they won’t be set.
</p>
</details>

#### Q14 The security concern(s) in the given contract snippet is/are

```js
pragma solidity 0.8.4;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/IERC20.sol";

contract test {

    // Assume other required functionality is correctly implemented

    address admin;
    address token;

    constructor(address _admin, address _token) {
        require(_admin != address(0));
        require(_token != address(0));
        admin = _admin;
        token = _token;
    }

    modifier onlyAdmin {
        require(msg.sender == admin);
        _;
    }

    function payRewards(address[] calldata recipients, uint256[] calldata amounts) external onlyAdmin {
        for (uint i; i < recipients.length; i++) {
            IERC20(token).transfer(recipients[i], amounts[i]);
        }
    }
}
```

- [ ]  A) Potential out-of-gas exceptions due to unbounded external calls within loop
- [ ]  B) ERC20 `approve()` race condition
- [ ]  C) Unchecked return value of `transfer()` (assuming it returns a boolean/other value and does not revert on failure)
- [ ]  D) Potential reverts due to mismatched lengths of recipients and amounts arrays
<details>
<summary>Answer</summary>
A,C,D
<p>
There's no guarantee that the passed arrays are of same length, so if one would be longer than the other one it can cause an Out Of Bounds error, which is why D is correct.
</p>
<p>
Calls inside a loop: Calls to external contracts inside a loop are dangerous (especially if the loop index can be user-controlled) because it could lead to DoS if one of the calls reverts or execution runs out of gas. Avoid calls within loops, check that loop index cannot be user-controlled or is bounded.<br>
ERC20 transfer() does not return boolean: Contracts compiled with solc >= 0.4.22 interacting with such functions will revert. Use OpenZeppelin’s SafeERC20 wrappers.<br>
This is ERC20 token transfer and not Ether transfer (which throws on failure). <a href="https://github.com/OpenZeppelin/openzeppelin-contracts/blob/342265d29066e98c5dc88900d001cab3d0c4f0c5/contracts/token/ERC20/ERC20.sol#L113">ERC20 transfer is typically expected to return a boolean</a> but non-ERC20-conforming tokens may return nothing or even revert which is typically why <a href="https://github.com/OpenZeppelin/openzeppelin-contracts/blob/342265d29066e98c5dc88900d001cab3d0c4f0c5/contracts/token/ERC20/utils/SafeERC20.sol">SafeERC20</a> is recommended.
</p>
</details>


#### Q15 The vulnerability/vulnerabilities present in the given contract snippet is/are

```js
pragma solidity 0.8.4;
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/security/ReentrancyGuard.sol";

contract test {

 // Assume other required functionality is correctly implemented
 // For e.g. users have deposited balances in the contract

    mapping (address => uint256) balances;

    function withdrawBalance() external {
        msg.sender.call{value: balances[msg.sender]}("");
        balances[msg.sender] = 0;
    }
}
```

- [ ]  A) Reentrancy
- [ ]  B) Integer overflow leading to wrapping
- [ ]  C) Integer underflow leading to wrapping
- [ ]  D) None of the above
<details>
<summary>Answer</summary>
A
<p>
Reentrancy vulnerabilities: Untrusted external contract calls could callback leading to unexpected results such as multiple withdrawals or out-of-order events. Use check-effects-interactions pattern or reentrancy guards.<br>
Integer overflow/underflow: Not using OpenZeppelin’s SafeMath (or similar libraries) that check for overflows/underflows may lead to vulnerabilities or unexpected behavior if user/attacker can control the integer operands of such arithmetic operations. Solc v0.8.0 introduced default overflow/underflow checks for all arithmetic operations.
</p>
</details>

#### Q16 The security concern(s) in the given contract snippet is/are

```js
pragma solidity 0.8.4;

contract test {
// Assume other required functionality is correctly implemented
// Assume that hash is the hash of a message computed elsewhere in contract
// Assume that the contract does not make use of chainID or nonces in its logic

function verify(address signer, bytes32 memory hash, bytes32 sigR, bytes32 sigS, uint8 sigV) internal view returns (bool) {
   return signer == ecrecover(hash, sigV, sigR, sigS);
}
```

- [ ]  A) Signature malleability risk of ecrecover
- [ ]  B) Missing use of nonce in message hash may allow replay attacks across transactions
- [ ]  C) Missing use of chainID in message hash may allow replay attacks across chains
- [ ]  D) Missing zero-address check for ecrecover return value may allow invalid signatures
<details>
<summary>Answer</summary>
A,B,C,D
<p>
Signature malleability: The ecrecover function is susceptible to signature malleability which could lead to replay attacks. Consider using OpenZeppelin’s ECDSA library.<br>
Insufficient Signature Information: The vulnerability occurs when a digital signature is valid for multiple transactions, which can happen when one sender (say Alice) sends money to multiple recipients through a proxy contract (instead of initiating multiple transactions). In the proxy contract mechanism, Alice can send a digitally signed message off-chain (e.g., via email) to the recipients, similar to writing personal checks in the real world, to let the recipients withdraw money from the proxy contract via transactions. To assure that Alice does approve a certain payment, the proxy contract verifies the validity of the digital signature in question. However, if the signature does not give the due information (e.g., nonce, proxy contract address), then a malicious recipient can replay the message multiple times to withdraw extra payments. This vulnerability was first exploited in a replay attack against smart contracts [36]. This vulnerability can be prevented by incorporating the due information in each message, such as a nonce value and timestamps<br>
Indistinguishable Chains: This vulnerability was first observed from the cross-chain replay attack when Ethereum was divided into two chains, namely, ETH and ETC [10]. Recall that Ethereum uses ECDSA to sign transactions. Prior to the hard fork for EIP-155 [7], each transaction consisted of six fields (i.e., nonce, recipient, value, input, gasPrice, and gasLimit). However, the digital signatures were not chain-specific, because no chain-specific information was even known back then. As a consequence, a transaction created for one chain can be reused for another chain. This vulnerability has been eliminated by incorporating chainID into the fields.<br>
`ecrecover() returns (address)`: recover the address associated with the public key from elliptic curve signature or return zero on error.
</p>
</details>