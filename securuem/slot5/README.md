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