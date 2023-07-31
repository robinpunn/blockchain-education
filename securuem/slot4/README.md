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