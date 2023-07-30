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

