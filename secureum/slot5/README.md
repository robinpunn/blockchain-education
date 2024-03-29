## Slot 5 Security Pitfalls and Best Practices 201

---

### Table of Contents

1. [Block 1](#block-1)
    102. [ERC20 Transfers](#102-erc20-transfers)
    103. [ERC20 Optional](#103-erc20-optional)
    104. [ERC20 Decimals](#104-erc20-decimals)
    105. [ERC20 Approve](#105-erc20-approve)
    106. [ERC777 Hooks](#106-erc777-hooks)
    107. [Token Deflation](#107-token-deflation)
    108. [Token Inflation](#108-token-inflation)
    109. [Token Complexity](#109-token-complexity)
    110. [Token Functions](#110-token-functions)
    111. [Token Address](#111-token-address)
    112. [Token Upgradeable](#112-token-upgradeable)
    113. [Token Mint](#113-token-mint)
    114. [Token Pause](#114-token-pause)
    115. [Token Blacklist](#115-token-blacklist)
    116. [Token Team](#116-token-team)
    117. [Token Ownership](#117-token-ownership)
    118. [Token Supply](#118-token-supply)
    119. [Token Listing](#119-token-listing)
    120. [Token Balance](#120-token-balance)
2. [Block 2](#block-2)
    121. [Token Minting](#121-token-minting)
    122. [ERC1400 Addresses](#122-erc1400-addresses)
    123. [ERC1400 Transfers](#123-erc1400-transfers)
    124. [ERC1644 Transfers](#124-erc1644-transfers)
    125. [ERC621 totalSupply](#125-erc621-totalsupply)
    126. [ERC884 Reissue](#126-erc884-reissue)
    127. [ERC884 Whitelisting](#127-erc884-whitelisting)
    128. [Asset Limits](#128-asset-limits)
    129. [Asset Types](#129-asset-types)
    130. [User Limits](#130-user-limits)
    131. [Usage Limits](#131-usage-limits)
    132. [Composability Limits](#132-composability-limits)
    133. [Escrow](#133-escrow)
    134. [Circuit Breaker](#134-circuit-breaker)
    135. [Emergency Shutdown](#135-emergency-shutdown)
    136. [System Specification](#136-system-specification)
    137. [System Documentation](#137-system-documentation)
    138. [Function Parameters](#138-function-parameters)
    139. [Function Arguments](#139-function-arguments)
    140. [Function Visibility](#140-function-visibility)
3. [Block 3](#block-3)
    141. [Function Modifiers](#141-function-modifiers)
    142. [Function Returns](#142-function-returns)
    143. [Functon Timeliness](#143-function-timeliness)
    144. [Function Repetitiveness](#144-function-repetitiveness)
    145. [Function Order](#145-function-order)
    146. [Function Inputs](#146-function-inputs)
    147. [Conditionals](#147-conditionals)
    148. [Access Control Specification](#148-access-control-specification)
    149. [Access Control Implementation](#149-access-control-implementation)
    150. [Access Control Modifiers](#150-access-control-modifiers)
    151. [Modifiers Implementation](#151-modifiers-implementation)
    152. [Modifiers Usage](#152-modifiers-usage)
    153. [Access Control Changes](#153-access-control-changes)
    154. [Comments](#154-comments)
    155. [Testing](#155-testing)
    156. [Unused](#156-unused)
    157. [Redundant](#157-redundant)
    158. [Eth](#158-eth)
    159. [Tokens](#159-tokens)
    160. [Actors](#160-actors)
4. [Block 4](#block-4)
    161. [Privileged Roles](#161-privileged-roles)
    162. [Two Step Privileged Roles](#162-two-step-privileged-roles)
    163. [Critical Parameters](#163-critical-parameters)
    164. [Explicit vs Implicit](#164-explicit-vs-implicit)
    165. [Configuration](#165-configuration)
    166. [Initialization](#166-initialization)
    167. [Cleanup](#167-cleanup)
    168. [Data Processing](#168-data-processing)
    169. [Data Validation](#169-data-validation)
    170. [Numerical Values](#170-numerical-issues)
    171. [Accounting Issues](#171-accounting-issues)
    172. [Access Control](#172-access-control)
    173. [Auditing and Logging](#173-auditing-and-logging)
    174. [Cryptography](#174-cryptography)
    175. [Error Reporting](#175-error-reporting)
    176. [DoS](#176-dos)
    177. [Timing](#177-timing)
    178. [Ordering](#178-ordering)
    179. [Undefined Behavior](#179-undefined-behavior)
    180. [Interactions](#180-interactions)
5. [Block 5](#block-5)
    181. [Trust](#181-trust)
    182. [Gas](#182-gas)
    183. [Dependency](#183-dependency)
    184. [Constant](#184-constant)
    185. [Fresh](#185-fresh)
    186. [Scarcity](#186-scarcity)
    187. [Incentive](#187-incentive)
    188. [Clarity](#188-clarity)
    189. [Privacy](#189-privacy)
    190. [Cloning](#190-cloning)
    191. [Business Logic](#191-business-logic)
    192. [Principle of Least Privilege](#192-principle-of-least-privilege)
    193. [Principle of Separation of Privilege](#193-principle-of-separation-of-privilege)
    194. [Principle of Least Common Mechanism](#194-principle-of-least-common-mechanism)
    195. [Principle of Fail Safe Defaults](#195-principle-of-fail-safe-defaults)
    196. [Principle of Complete Mediation](#196-principle-of-complete-mediation)
    197. [Principle of Economy Mechanism](#197-principle-of-economy-of-mechanism)
    198. [Principle of Open Design](#198-principle-of-open-design)
    199. [Principle of Psychological Acceptability](#199-principle-of-psychological-acceptability)
    200. [Principle of Work Factor](#200-principle-of-work-factor)
    201. [Principle of Compromise Recording](#201-principle-of-compromise-recording)
6. [Quiz](#quiz)
---

### [Block 1](https://www.youtube.com/watch?v=WGM1SF8twmw)
#### 102. ERC20 Transfers

- Related to the `transfer()` and `transferFrom()` functions between addresses
- Should return a boolean.
- Several tokens do not return a boolean on these functions.
- As a result, their calls in the contract might fail.

#### 103. ERC20 Optional

- Name, decimals, and symbol functions are present if used.
- These functions are optional in the ERC20 standard and might not be present.
- Do not make an assumption that these primitives will always be implemented.

#### 104. ERC20 Decimals

- They are typically 18 digits in precision and there for the token standard
  specified using a uint8.
- Several tokens incorrectly return a uint256.
- If this is the case, ensure the value returned is below 255.

#### 105. ERC20 approve()

- The ERC20 standard has a known ERC20 race condition that must be mitigated to
  prevent attackers from stealing tokens.
  - A token owner can give an allowance of 100 to a spender and later decrease
    that allowance to 50.
  - The spender may be able to observe the decrease operation and before it
    happens can front run to first spend the 100 and then also get the 50
- The best practice is to not use the `approve()` function but instead use
  `increaseAllowance()` or `decreaseAllowance()` functions that do not have this
  risk

#### 106. ERC777 Hooks

- ERC777 tokens have the concept of a hook function that is called before any
  calls to send, transfer, operatorSend, minting and burning.
- While these hooks enable a lot of interesting use cases, care should be taken
  to make sure they do not make external calls because that can lead to
  reentrancies.

#### 107. Token Deflation

- Some tokens may take a fee when one tokens are being transferred form one
  address to another.
  - Because of this fee, the number of tokens across all the user addresses will
    decrease over time
- Transfer and transferFrom should not take a fee.
- Deflationary tokens can lead to unexpected behavior.

#### 108. Token Inflation

- Potential interest earned from the token should be taken into account.
- Some tokens distribute interest to token holders.
- This interest might be trapped in the contract if not taken into account.

#### 109. Token Complexity

- Token contract avoids unneeded complexity.
- The token should be a simple contract; a token with complex code requires a
  higher standard of review.

#### 110. Token Functions

- In computer science there is the notion of separation of concerns
  - There should be different sections each of which address a very specific
    concern
  - This should also apply to smart contracts that work with ERC20 token
    contracts
- Token contract has only a few non–token-related functions.
- Non–token-related functions increase the likelihood of an issue in the
  contract.

#### 111. Token Address

- ERC20 contracts should be working with a single token address.
  - Tokens with multiple entry points for balance updates can break internal
    bookkeeping based on the address
    (e.g. `balances[token_address][msg.sender]` might not reflect the actual
    balance).

#### 112. Token Upgradeable

- Upgrading is interesting in smart contract applications, but when it comes to
  ERC20 token contracts, upgradability is a concern.
- Upgradeable contracts might change their rules over time.
  - This is detrimental to the trust users place in these contracts

#### 113. Token Mint

- In the context of token contracts, minting refers to the act of incrementing
  the account balances of addresses to which those new tokens are credited
- Token owner should have limited minting capabilities.
- Malicious or compromised owners can abuse minting capabilities.

#### 114. Token Pause

- The ability to pause certain functionality is part of a guarded launch
- However, pausing is a risk with ERC20 tokens.
- Malicious or compromised owners can trap contracts relying on pausable tokens.

#### 115. Token Blacklist

- Token owner should not be able to blacklist the contract.
- Malicious or compromised owners can trap contracts relying on tokens with a
  blacklist.

#### 116. Token Team

- Token development team should be known so they can be held responsible for
  abuse.
- Contracts with anonymous development teams, or that reside in legal shelters
  should require a higher standard of review.

#### 117. Token Ownership

- No token user should own most of the supply.
- If a few users own most of the tokens, they can influence operations based on
  the token's repartition.

#### 118. Token Supply

- Token supply refers to the number of ERC20 tokens that is supported by the
  contract.
  - The supply can be low or high
- Token total supply has to be sufficient.
- Tokens with a low total supply can be easily manipulated.
  - Ownership can be concentrated to a few owners.

#### 119. Token Listing

- ERC20 tokens can be listed in various placed to allow trading between users.
  - They can be listed on a CEX or a DEX
- Tokens should be located in more than a few exchanges.
  - If all the tokens are in one exchange, a compromise of the exchange can
    compromise the contract relying on the token.

#### 120. Token Balance

- Assumptions on taken balances pose a security risk.
  - Logic that assumes a balance is always below a certain threshold stand a
    risk of those assumptions breaking if the balance exceeds those thresholds.
  - This may be triggered by flash loans or whales
- A flash loan is a capability where a user is allowed to borrow a significant
  number of tokens without providing any collateral but the loan has to be
  repaid within the same transaction
- Users understand the associated risks of large funds or flash loans.
- Contracts relying on the token balance must carefully take in consideration
  attackers with large funds or attacks through flash loans.


### [Block 2](https://www.youtube.com/watch?v=HqHo1jKUnmU)
#### 121. Token Minting
- Flash minting is a concept similar to flash loans
	- Unlike flash loans where the amount of tokens that can be borrowed is limited by the amount of tokens in the protocol, flash minting simply mints the new tokens that are handed to the user
	- Only available in the context of a transaction... at the end of the transaction, the flash minting will destroy all the tokens that were just minted
- Token should not allow flash minting.
- Flash minting can lead to substantial swings in the balance and the total supply, which necessitate strict and comprehensive overflow checks in the operation of the token.

#### 122. ERC1400 Addresses
- ERC1400 introduced the concept of permissioned addresses
	- Standard was driven by PolyMath and related to the concept of "security tokens"
	- Security tokens are tokens that represent ownership in a financial security
- Can block transfers from/to specific addresses.
- Not encountered very often, but runs a DOS risk

#### 123. ERC1400 Transfers
- ERC1400 also introduced the concept of forced transfers
	- Trusted actors in the context of the standard that can perform unbounded transfers
- Trusted actors have the ability to transfer funds however they choose.

#### 124. ERC1644 Transfers
- Related to ERC1400 allowing forced transfers
	- In the context of a controller role, allowed to perform arbitrary transfers from one account to another
- Controller has the ability to steal funds.

#### 125. ERC621 totalSupply
- Allows for control over total supply
- totalSupply can be changed by trusted actors
	- Allowed by using increaseSupply and decreaseSupply functions

#### 126.  ERC884 Reissue
- The standard defines actors known as token implementers
- Token implementers have the ability to cancel an address and move its tokens to a new address

#### 127. ERC884 Whitelisting
- Tokens can only be sent to whitelisted addresses

#### 128. Asset Limits
- Guarded launch asset limits
- Limiting the total asset value managed by a system initially upon launch and gradually increasing it over time may reduce impact due to initial vulnerabilities or exploits.

#### 129. Asset Types
- Guarded launch asset types
- Limiting types of assets that can be used in the protocol initially upon launch and gradually expanding to other assets over time may reduce impact due to initial vulnerabilities or exploits.

#### 130. User Limits
- Guarded launch user limits
- Limiting the total number of users that can interact with a system initially upon launch and gradually increasing it over time may reduce impact due to initial vulnerabilities or exploits.
- Initial users may also be whitelisted to limit to trusted actors before opening the system to everyone

#### 131. Usage Limits
- Guarded launch usage limits
- Launch with limited usage and over time allow more usage
- Enforcing transaction size limits, daily volume limits, per-account limits, or rate-limiting transactions may reduce impact due to initial vulnerabilities or exploits.

#### 132. Composability Limits
- Guarded launch composability limits
- Composability is a defining feature of web3 where every application can expect to interact with or be interacted with any other application in the ecosystem
- Restricting the composability of the system to interface only with whitelisted trusted contracts before expanding to arbitrary external contracts may reduce impact due to initial vulnerabilities or exploits.

#### 133. Escrow
- Guarded Launch escrow
- Escrowing high value transactions/operations with time locks and a governance capability to nullify or revert transactions may reduce impact due to initial vulnerabilities or exploits

#### 134. Circuit Breaker
- Guarded launch circuit breaker
	- Perhaps the most widely used guarded launch approach
- Implementing capabilities to pause/unpause a system in extreme scenarios may reduce impact due to initial vulnerabilities or exploits.
- Start off with circuit breaker on launch and later renounce these capabilities
#### 135. Emergency Shutdown
- Guarded launch emergency shutdown
- An extended or extreme version of the circuit breaker
- Implement capabilities that allow governance to shutdown new activity in the system and allow users to reclaim assets may reduce impact due to initial vulnerabilities or exploits.
- Allows for resetting and restarting a dApp
- Launch with emergency shutdown and remove after gaining confidence in system
	- Removal involves removing authorized users who can trigger the emergency shutdown (same with other mechanisms)
#### 136. System Specification
- The design of any system starts with "requirements gathering"
	- Requirements are determined based on the target application category, the target market, or the target users
- Ensure that the specification of the entire system is considered, written and evaluated to the greatest detail possible.
- Specification describes how (and why) the different components of the system behave to achieve the design requirements.
- Without specification, a system implementation cannot be evaluated against the requirements for correctness.

#### 137. System Documentation
- Specification deals with design and requirements of the system whereas documentation deals with the actual implementation itself
- Ensure that roles, functionalities and interactions of the entire system are well documented to the greatest detail possible.
- Documentation describes what (and how) the implementation of different components of the system does to achieve the specification goals.
- Without documentation, a system implementation cannot be evaluated against the specification for correctness and one will have to rely on analyzing the implementation itself.

#### 138. Function Parameters
- Ensure input validation for all function parameters especially if the visibility is external/public where (untrusted) users can control values.
- This is especially required for address parameters where maliciously/accidentally used incorrect/zero addresses can cause vulnerabilities or unexpected behavior.
- Make sure there are valid sanity and threshold checks

#### 139. Function Arguments
- Ensure that the arguments to function calls at the caller sites are the correct ones and in the right order as expected by the function definition.

#### 140. Function Visibility
- Functions have 4 visibility specifiers: public, external, internal, private
- Ensure that the strictest visibility is used for the required functionality.
- An accidental external/public visibility will allow (untrusted) users to invoke functionality that is supposed to be restricted internally.


### [Block 3](https://www.youtube.com/watch?v=pXoEIjHupXk)
#### 141. Function Modifiers
- Ensure that the right set of function modifiers are used (in the correct order) for the specific functions so that the expected access control or validation is correctly enforced.
- Modifiers affect both control and data flow
	- From a control flow perspective they can implement authorization checks that can revert
	- They can perform different types of validation for the data that is being passed to the modifiers
#### 142. Function Returns
- Ensure that the appropriate return value(s) are returned from functions and checked without ignoring at function call sites, so that error conditions are caught and handled appropriately.

#### 143. Function Timeliness
- Externally accessible functions (_external_/_public_ visibility) may be called at any time (or never).
- It is not safe to assume they will only be called at specific system phases (e.g. after initialization, when unpaused, during liquidation) that is meaningful to the system design.
- The reason for this can be accidental or malicious.
- Function implementation should be robust enough to track system state transitions, determine meaningful states for invocations and withstand arbitrary calls.
- For e.g., initialization functions (used with upgradeable contracts that cannot use constructors) are meant to be called atomically along with contract deployment to prevent anyone else from initializing with arbitrary values.

#### 144. Function Repetitiveness
- Externally accessible functions (_external_/_public_ visibility) may be called any number of times.
- It is not safe to assume they will only be called only once or a specific number of times that is meaningful to the system design.
- Function implementation should be robust enough to track, prevent, ignore or account for arbitrarily repetitive invocations.
- For e.g., initialization functions (used with upgradeable contracts that cannot use constructors) are meant to be called only once.

#### 145. Function Order
- Externally accessible functions (_external_/_public_ visibility) may be called in any order (with respect to other defined functions).
- It is not safe to assume they will only be called in the specific order that makes sense to the system design or is implicitly assumed in the code.
- For e.g., initialization functions (used with upgradeable contracts that cannot use constructors) are meant to be called before other system functions can be called.

#### 146. Function Inputs
- Externally accessible functions (_external_/_public_ visibility) may be called with any possible arguments.
- Without complete and proper validation (e.g. zero address checks, bound checks, threshold checks etc.), they cannot be assumed to comply with any assumptions made about them in the code.

#### 147. Conditionals
- Ensure that in conditional expressions (e.g. if statements), the correct variables are being checked and the correct operators, if any, are being used to combine them.
- For e.g. using || instead of && is a common error.

#### 148. Access Control Specification
- Access control deals with assets, actors, and actions
	- Which actors have access to which assets and how much of those assets
	- What actions can the actors use to access those assets
- Access control specification should detail who can access what, etc.
- Ensure that the various system actors, their access control privileges and trust assumptions are accurately specified in great detail so that they are correctly implemented and enforced across different contracts, functions and system transitions/flows.
- Without access controls, it has hard to evaluate whether the implementation enforces these aspects

#### 149. Access Control Implementation
- Ensure that the specified access control is implemented uniformly across all the subjects (actors) seeking access and objects (variables, functions) being accessed so that there are no paths/flows where the access control is missing or may be side-stepped.

#### 150. Access Control Modifiers
- Access control is typically enforced on functions using modifiers that check if specific addresses/roles are calling these functions.
- Ensure that such modifiers are present on all relevant functions which require that specific access control.

#### 151. Modifiers Implementation
- Access control is typically enforced on functions using modifiers that check if specific addresses/roles are calling these functions.
- A system can have multiple roles with different privileges.
- Ensure that modifiers are implementing the expected checks on the correct roles/addresses with the right composition e.g. incorrect use of || instead of && is a common vulnerability while composing access checks.

#### 152. Modifiers Usage
- Access control is typically enforced on functions using modifiers that check if specific addresses/roles are calling these functions.
- A system can have multiple roles with different privileges.
- Ensure that correct modifiers are used on functions requiring specific access control enforced by that modifier.

#### 153. Access Control Changes
- Ensure that changes to access control (e.g. change of ownership to new addresses) are handled with extra security so that such transitions happen smoothly without contracts getting locked out or compromised due to use of incorrect credentials.
- Access control changes should be validated for correctness, use a two step process to allow recovery from mistakes, and log changes for transparency and offchain monitoring

#### 154. Comments
- Ensure that the code is well commented both with NatSpec and inline comments for better readability and maintainability.
- The comments should accurately reflect what the corresponding code does.
- Stale comments should be removed.
- Discrepancies between code and comments should be addressed.
- Any TODO’s indicated by comments should be addressed.
- Commented code should be removed.

#### 155. Testing
- Tests indicate that the system implementation has been validated against the specification.
- Unit tests, functional tests and integration tests should have been performed to achieve good test coverage across the entire codebase.
- Any code or parameterisation used specifically for testing should be removed from production code.

#### 156. Unused
- Unused constructs may negatively impact security
- Any unused imports, inherited contracts, functions, parameters, variables, modifiers, events or return values should be removed (or used appropriately) after careful evaluation.
- This will not only reduce gas costs but improve readability and maintainability of the code.
- This could also be an indicator of missing logic

#### 157. Redundant
- Redundant code and comments can be confusing and should be removed (or changed appropriately) after careful evaluation.
- This will not only reduce gas costs but improve readability and maintainability of the code.

#### 158. Eth
- Contracts that accept/manage/transfer ETH should ensure that functions handling ETH are using _msg.value_ appropriately, logic that depends on ETH value accounts for less/more ETH sent, logic that depends on contract ETH balance accounts for the different direct/indirect (e.g. _coinbase_ transaction, _selfdestruct_ recipient) ways of receiving ETH and transfers are reentrancy safe.
- Functions handling ETH should be checked extra carefully for access control, input validation and error handling.

#### 159. Tokens
- Contracts that accept/manage/transfer ERC tokens should ensure that functions handling tokens account for different types of ERC tokens (e.g. ERC20 vs ERC777), deflationary/inflationary tokens, rebasing tokens and trusted/external tokens.
- Functions handling tokens should be checked extra carefully for access control, input validation and error handling.

#### 160. Actors
- Ideally there should be no trusted actors while interacting with smart contracts.
- However, in guarded launch scenarios, the goal is to start with trusted actors and then progressively decentralize towards automated governance by community/DAO.
- For the trusted phase, all the trusted actors, their roles and capabilities should be clearly specified, implemented accordingly and documented for user information and examination.


### [Block 4](https://www.youtube.com/watch?v=IVbEIbIpWUY)
#### 161. Privileged Roles
- Trusted actors who have privileged roles with capabilities to deploy contracts, change critical parameters, pause/unpause system, trigger emergency shutdown, withdraw/transfer/drain funds and allow/deny other actors should be addresses controlled by multiple, independent, mutually distrusting entities.
- They should not be controlled by private keys of EOAs but with Multisigs with a high threshold (e.g. 5-of-7, 9-of-11) and eventually by a DAO of token holders.
- EOA has a single point of failure.

#### 162. Two Step Privileged Roles
- When privileged roles are being changed, it is recommended to follow a two-step approach:
	1) The current privileged role proposes a new address for the change
	2) The newly proposed address then claims the privileged role in a separate transaction.
- This two-step change allows accidental proposals to be corrected instead of leaving the system operationally with no/malicious privileged role.
- For e.g., in a single-step change, if the current admin accidentally changes the new admin to a zero-address or an incorrect address (where the private keys are not available), the system is left without an operational admin and will have to be redeployed.

#### 163. Critical Parameters
- When critical parameters of systems need to be changed, it is required to broadcast the change via event emission and recommended to enforce the changes after a time-delay.
- This is to allow system users to be aware of such critical changes and give them an opportunity to exit or adjust their engagement with the system accordingly.
- For e.g. reducing the rewards or increasing the fees in a system might not be acceptable to some users who may wish to withdraw their funds and exit.

#### 164. Explicit vs Implicit
- As a general principle, everything in security is about being explicit
- While Solidity has progressively adopted explicit declarations of intent for e.g. with function visibility and variable storage, it is recommended to do the same at the application level where all requirements should be explicitly validated (e.g. input parameters) and assumptions should be documented and checked.
- Implicit requirements and assumptions should be flagged as dangerous.

#### 165. Configuration
- Misconfiguration of system components such contracts, parameters, addresses and permissions may lead to security issues.
- Test configurations and production configurations should be clearly marked as such and separated appropriately
	- Testing is typically done with lower thresholds of different values

#### 166. Initialization
- Lack of initialization, initializing with incorrect values or allowing untrusted actors to initialize system parameters may lead to security issues.
- Default or incorrect values can be used to exploit the system

#### 167. Cleanup
- Missing to clean up old state or cleaning up incorrectly/insufficiently will lead to reuse of stale state which may lead to security issues.
- Applicable to contract state maintaining state variables within storage or even local variables within contract functions
- Cleaning up storage state use the delete primitive provides gas refunds

#### 168. Data Processing
- At a very high level, data processing issues may lead to security issues
- Processing data incorrectly will cause unexpected behavior which may lead to security issues.
- Processing can be missing or incorrectly implemented
- All aspects of data processing should be reviewed for potential security impact

#### 169. Data Validation
- Contract functions check if the received data from external users is valid based on aspects of variable types, low or high thresholds, or any other application logic specific context
- Missing validation of data or incorrectly/insufficiently validating data, especially tainted data from untrusted users, will cause untrustworthy system behavior which may lead to security issues.
- Sanity and threshold checks are critical aspects of data validation

#### 170. Numerical Issues
- Numerical processing is where the logic operates on numerical values
- Incorrect numerical computation will cause unexpected behavior which may lead to security issues.
- These may be related to overflow/underflow, precision handling,  type casting,  parameter/return values, decimals, ordering of operations, and loop indices(??) among other things
- The recommended best practice is to adopt widely used libraries

#### 171. Accounting Issues
- Incorrect or insufficient tracking or accounting of business logic related aspects such as states, phases, permissions, roles, funds (deposits/withdrawals) and tokens (mints/burns/transfers) may lead to security issues.

#### 172. Access Control
- Access control is central and critical to security
- Incorrect or insufficient access control or authorization related to system actors, roles, assets and permissions may lead to security issues.
- The notion of assets, actors, actions in the context of trust and threat models should be reviewed with care

#### 173. Auditing and Logging
- Recording or accessing snapshots or logs of important events within a system is known as audit logging
	- The recorded events are called audit logs
	- This is different from the concept of external reviews (which is also called auditing)
- In the context of smart contracts, this applies to event emissions, the ability to query values of public state variables, exposed getter functions, and recording appropriate error strings from requires, asserts, and reverts
- Incorrect or insufficient emission of events will impact off-chain monitoring and incident response capabilities which may lead to security issues.

#### 174. Cryptography
- Incorrect or insufficient cryptography especially related to on-chain signature verification or off-chain key management will impact access control and may lead to security issues.
- Aspects of keys, accounts, hashes, signatures, and randomness need to be paid attention to along with the fundamental concepts of  ecdsa signatures and keccak256 hashes
	- There are also deeper and newer cryptographic aspects: BLS, RANDAO, VDF, ZK

#### 175. Error Reporting
- Incorrect or insufficient detecting, reporting and handling of error conditions will cause exceptional behavior to go unnoticed which may lead to security issues.
- At a high level, security exploits almost always focus on exceptional behavior that is normally not encountered or validated or noticed
- Such exceptional behavior is what is caught and reported by error conditions and any deviations from the specification are errors that should be detected, reported, and handled appropriately

#### 176. DoS
- Traditionally, security has been considered as a triad referred to as CIA
	- Confidentiality
	- Integrity
	- Availability
- DoS affects availability
- Preventing other users from successfully accessing system services by modifying system parameters or state causes denial-of-service issues which affects the availability of the system.
- This may also manifest as security issues if users are not able to access their funds locked in the system.

#### 177. Timing
- Incorrect assumptions on timing of user actions, system state transitions or blockchain state/blocks/transactions may lead to security issues.
- Any timing aspects of a contract should be checked for such issues

#### 178. Ordering
- Incorrect assumptions on ordering of user actions or system state transitions may lead to security issues.
- For e.g.,  a user may accidentally/maliciously call a finalization function even before the initialization function if the system allows.
- Attackers can front run/back run user interactions to force assumptions or ordering to fail
	- Front running is when attackers race to finish their transaction or interaction before the user
	- Back running is when attackers race to be behind or right after the user's transaction or interaction
	- Combining these two aspects can be exploited in "sandwich attacks" where the user's interaction is sandwiched between those of the attacker
- Evaluate if ordering and timing can be abused in any manner

#### 179. Undefined Behavior
- Any behavior that is undefined in the specification but is allowed in the implementation will result in unexpected outcomes which may lead to security issues.
- Any behavior that is not defined in the specification  but is allowed either explicitly or inadvertently in the implementation is undefined behavior
	- Such behavior may never be triggered in normal operations but if they are triggered accidently in exceptional conditions, that may result in reverts

#### 180. Interactions
- External interactions can have a security impact
	- Such interactions could be with assets, actions, or actors that are outside of adopted threat models
- Interacting with external components (e.g. tokens, contracts, oracles) forces system to trust or make assumptions on their correctness/availability requiring validation of their existence and outputs without which may lead to security issues.
- Increasing dependencies and composability makes this a significant challenges


### [Block 5](https://www.youtube.com/watch?v=QSsfkmcdbPw&t)
#### 181. Trust
- Trusted assets, actors, and actions can become compromised
- Trust minimalization is a foundational value of web3 and a key tenant of decentralization
- Incorrect or Insufficient trust assumption about/among system actors and external entities will lead to privilege escalation/abuse which may lead to security issues.
- Never trust, always verify

#### 182. Gas
- The notion of gas in Ethereum stems from the need to bound computation because of the turing completeness of the underlying EVM
- Incorrect assumptions about gas requirements especially for loops or external calls will lead to out-of-gas exceptions which may lead to security issues such as failed transfers or locked funds.
- Gas usage must be considered when reviewing smart contracts

#### 183. Dependency
- Dependencies on external actors/assets/actions or software (imports, contracts, libraries, tokens, oracles, relayers, etc.) will lead to trust/availability/correctness assumptions which if/when broken may lead to security issues.
- Dependencies should be well documented and evaluated

#### 184. Constant
- Incorrect assumptions about system actors, entities or parameters being constant may lead to security issues if/when such factors change unexpectedly.
- This affects hardcoded parameters such as block time, addresses, permissions, roles

#### 185. Fresh
- Freshness of on object as an aspect that indicates if it is the latest in some relevant timeline or of it is stale indicating that there is an updated value or version in that corresponding timeline
- Using state values and not the most recent values leads to freshness issues which can manifest into security issues
	- The use of nonce in transactions to prevent replay attacks
- Incorrect assumptions about the status of or data from system actors or entities being fresh (i.e. not stale), because of lack of updation or availability, may lead to security issues if/when such factors have been updated. For e.g., getting a stale price from an Oracle.

#### 186. Scarcity
- Scarcity is the notion that something is available in only few numbers
- Incorrect assumptions about the scarcity of tokens/funds available to any system actor will lead to unexpected outcomes which may lead to security issues.
	- Flash loans/mints or related overflows where a vulnerable contract makes a scarcity related assumption and applies that to the size or type of variables used to maintain token balances
		- If not mitigated appropriately, can lead to overflows
	- Also related to Sybil attacks... an attacker subverts a system by creating a large number of identities and uses them to gain a disproportionately large influence

#### 187. Incentive
- Incorrect assumptions about the incentives of system/external actors to perform or not perform certain actions will lead to unexpected behavior being triggered or expected behavior not being triggered, both of which may lead to security issues.
	- For e.g., incentive to liquidate positions, lack of incentive to DoS or grief system.

#### 188. Clarity
- Lack of clarity in system specification, documentation, implementation or UI/UX will lead to incorrect expectations/outcome which may lead to security issues.

#### 189. Privacy
- Data and transactions on the Ethereum blockchain are not private.
	- Anyone can observe contract state and track transactions (both included in a block and pending in the mempool).
	- Incorrect assumptions about privacy aspects of data or transactions can be abused which may lead to security issues.

#### 190. Cloning
- Copy-pasting code from other libraries, contracts or even different parts of the same contract may result in incorrect code semantics for the context being copied to, copy over any vulnerabilities or miss any security fixes applied to the original code.
- All these may lead to security issues.

#### 191. Business Logic
- Incorrect or insufficient assumptions about the higher-order business logic being implemented in the application will lead to differences in expected and actual behavior, which may result in security issues.
- Business logic should be translated from requirements to the specification and then implementation with all of it validated and documented accurately

#### 192. **Principle of Least Privilege**
- “Every program and every user of the system should operate using the least set of privileges necessary to complete the job” — Ensure that various system actors have the least amount of privilege granted as required by their roles to execute their specified tasks.
- Granting excess privilege is prone to misuse/abuse when trusted actors misbehave or their access is hijacked by malicious entities.
- Privileges should be need based

#### 193. **Principle of Separation of Privilege**
- “Where feasible, a protection mechanism that requires two keys to unlock it is more robust and flexible than one that allows access to the presenter of only a single key” — Ensure that critical privileges are separated across multiple actors so that there are no single points of failure/abuse.
- A good example of this is to require a multisig address (not EOA) for privileged actors (e.g. owner, admin, governor, deployer) who control key contract functionality such as pause/unpause/shutdown, emergency fund drain, upgradeability, allow/deny list and critical parameters.
	- The multisig address should be composed of entities that are different and mutually distrusting/verifying.

#### 194. **Principle of Least Common Mechanism**
- “Minimize the amount of mechanism common to more than one user and depended on by all users”
	- Ensure that only the least number of security-critical modules/paths as required are shared amongst the different actors/code so that impact from any vulnerability/compromise in shared components is limited and contained to the smallest possible subset.

#### 195. **Principle of Fail-safe Defaults**
- “Base access decisions on permission rather than exclusion”
	- Ensure that variables or permissions are initialized to fail-safe default values which can be made more inclusive later instead of opening up the system to everyone including untrusted actors.

#### 196. **Principle of Complete Mediation**
- “Every access to every object must be checked for authority.”
	- Ensure that any required access control is enforced along all access paths to the object or function being protected
- Missing modifiers, permissive visibility,  missing auth flows
- Complete mediation requires access control enforcement on every asset/actor/action along all paths at all times

#### 197. **Principle of Economy of Mechanism**
- “Keep the design as simple and small as possible”
	- Ensure that contracts and functions are not overly complex or large so as to reduce readability or maintainability.
- Complexity typically leads to insecurity.

#### 198. **Principle of Open Design**
- “The design should not be secret”
	- Smart contracts are expected to be open-sourced and accessible to everyone.
- Security by obscurity of code or underlying algorithms is not an option.
- Security should be derived from the strength of the design and implementation under the assumption that (byzantine) attackers will study their details and try to exploit them in arbitrary ways.

#### 199. **Principle of Psychological Acceptability**
- “It is essential that the human interface be designed for ease of use, so that users routinely and automatically apply the protection mechanisms correctly”
	- Ensure that security aspects of smart contract interfaces and system designs/flows are user-friendly and intuitive so that users can interact with minimal risk.

#### 200. **Principle of Work Factor**
- “Compare the cost of circumventing the mechanism with the resources of a potential attacker”
	- Given the magnitude of value managed by smart contracts, it is safe to assume that byzantine attackers will risk the greatest amounts of intellectual/financial/social capital possible to subvert such systems.
	- Therefore, the mitigation mechanisms must factor in the highest levels of risk.

#### 201. **Principle of Compromise Recording**
- “Mechanisms that reliably record that a compromise of information has occurred can be used in place of more elaborate mechanisms that completely prevent loss”
	- Ensure that smart contracts and their accompanying operational infrastructure can be monitored/analyzed at all times (development/deployment/runtime) for minimizing loss from any compromise due to vulnerabilities/exploits.
	- For e.g., critical operations in contracts should necessarily emit events to facilitate monitoring at runtime.
- It is theoretically and practically impossible to create bug free code in a smart contract, therefore one should strive for the best in performing all security due diligence and reduce attack surface as much as possible
	- At the same time, anticipate residual risk to exist in the deployed system
	- Anticipate that there will be potential incidents of exploitation
		- Have an instant response planned
- Critical operations in contracts should emit events to facilitate off chain monitoring at run time


### Quiz
```js
pragma solidity 0.7.0;

contract InSecureumToken {

  mapping(address => uint) private balances;

  uint public decimals = 10**18; // decimals of the token
  uint public totalSupply; // total supply
  uint MAX_SUPPLY = 100 ether; // Maximum total supply

  event Mint(address indexed destination, uint amount);

  function transfer(address to, uint amount) public {
    // save the balance in local variables
    // so that we can re-use them multiple times
    // without paying for SLOAD on every access
    uint balance_from = balances[msg.sender];
    uint balance_to = balances[to];
    require(balance_from >= amount);
    balances[msg.sender] = balance_from - amount;
    balances[to] = safeAdd(balance_to, amount);
  }


  /// @notice Allow users to buy token. 1 ether = 10 tokens
  /// @dev Users can send more ether than token to be bought, to donate a fee to the protocol team.
  function buy(uint desired_tokens) public payable {
    // Check if enough ether has been sent
    uint required_wei_sent = (desired_tokens / 10) * decimals;
    require(msg.value >= required_wei_sent);

    // Mint the tokens
    totalSupply = safeAdd(totalSupply, desired_tokens);
    balances[msg.sender] = safeAdd(balances[msg.sender], desired_tokens);
    emit Mint(msg.sender, desired_tokens);
  }


  /// @notice Add two values. Revert if overflow
  function safeAdd(uint a, uint b) pure internal returns(uint) {
    if (a + b < a) {
        revert();
    }
    return a + b;
  }
}
```

#### Q1 The InSecureumToken contract strictly follows the specification of

- [ ]  A) ERC20
- [ ]  B) ERC777
- [ ]  C) ERC721
- [ ]  D) None of the above
<details>
<summary>Answer</summary>
D
<p>
Since decimals was defined as uint (same as uint256) and not as uint8 as ERC20 or ERC777 standardized, it can't strictly be either of them. And since this is clearly a fungible token contract, it can't be ERC721.
</p>
</details>

#### Q2 To avoid lock of funds, the following feature(s) MUST be implemented before contract deployment

- [ ]  A) A `transferFrom()` function
- [ ]  B) A `burn()` function
- [ ]  C) A way to withdraw/exchange/use Ether from the contract
- [ ]  D) None of the above
<details>
<summary>Answer</summary>
C
<p>
Locked Ether: Contracts that accept Ether via payable functions but without withdrawal mechanisms will lock up that Ether. Remove payable attribute or add withdraw function.
</p>
</details>

#### Q3 Which of the following assertion(s) is/are true (without affecting the security posture of the contract)?

- [ ]  A) `buy()` does not need payable keyword
- [ ]  B) balances must be private
- [ ]  C) `transfer()` can be external
- [ ]  D) `safeAdd()` can be public
<details>
<summary>Answer</summary>
C,D
<p>
buy() cannot function without being payable. There's no reason the visibility of balances needs to be private. transfer() can be external since it's not called internally. safeAdd() can be public since it is a pure function.
</p>
</details>

#### Q4 The total supply is limited by

- [ ]  A) 10**18
- [ ]  B) 100 * 10**18
- [ ]  C) 100
- [ ]  D) None of the above
<details>
<summary>Answer</summary>
D
<p>
It would be B, but `MAX_SUPPLY` isn't actually used anywhere in the code.
</p>
</details>

#### Q5 The following issue(s) is/are present in the codebase

- [ ]  A) An integer underflow allows one to drain Ether
- [ ]  B) Unsafe rounding allows one to receive new tokens for free
- [ ]  C) A division by zero allows one to trap/freeze the system
- [ ]  D) None of the above
<details>
<summary>Answer</summary>
B
<p>
It's impossible to get any Ether out of this contract, so no draining either. It divides desired_tokens first and only then multiplies by the decimals, this causes any amount of tokens below 10 to result in 0 required_wei_sent. There are no divisions here that could allow a division by 0.
</p>
</details>

#### Q6 The following issue(s) is/are present in the codebase

- [ ]  A) A front-running allows one to pay less than expected for tokens
- [ ]  B) A lack of access control allows one to receive tokens for free
- [ ]  C) Incorrect balance update allows one to receive new tokens for free
- [ ]  D) None of the above
<details>
<summary>Answer</summary>
C
<p>
No requests made before/after a function call would be able to change the token price. All of the functions are intended to be used by users, so no "access control" would be possible without excluding users. A user can send all of their tokens to themselves, which will double their balance due to the pre-loaded variable reuse.
</p>
</details>

#### Q7 The following issue(s) is/are present in the codebase

- [ ]  A) A reentrancy allows one to drain Ether
- [ ]  B) A reentrancy allows one to drain the tokens
- [ ]  C) A reentrancy allows one to receive new tokens for free
- [ ]  D) None of the above
<details>
<summary>Answer</summary>
D
<p>
No reentrancies are possible since no external calls are made.
</p>
</details>

#### Q8 The following issue(s) is/are present in the codebase

- [ ]  A) An integer overflow allows one to drain Ether
- [ ]  B) An integer overflow allows one to receive new tokens for free
- [ ]  C) An integer overflow allows one to trap/freeze the system
- [ ]  D) None of the above
<details>
<summary>Answer</summary>
D or B or C or B,C<br>
<p>Note: While the initial platform-specified correct answer for Q8 was D, it was determined that this Q&A had some latent ambiguity with answer choices B & C.<br>
Therefore, all answer combinations indicated above were considered as valid and scores adjusted accordingly.
</p>
<p>
While it is indeed possible to exploit an overflow at the multiplication ((desired_tokens / 10) * decimals), it doesn't allow you to receive FREE tokens (although it makes them a bargain).
</p>
</details>