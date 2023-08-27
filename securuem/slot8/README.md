## Slot 8 Audit Findings 201

---
### Table of Contents
1. [Block 1](#block-1)
    102. [Document Edge Cases](#102-document-potential-edge-cases-for-hook-receiver-contracts)
    103. [Document Token Behavior Restrictions](#103-document-token-behavior-restrictions)
    104. [Full Test Suite](#104-full-test-suite-is-recommended)
    105. [Kyber getRates](#105-kyber-getrates-code-is-unclear)
    106. [Return Value Not Used](#106-return-value-is-not-used-for-tokenutilswithdrawtokens)
    107. [Missing Access Control](#107-missing-access-control-for-defisaverloggerlog)
    108. [Remove Stale Comments](#108-remove-stale-comments)
    109. [Discrepency Between Code and Comments](#109-discrepancy-between-code-and-comments)
    110. [Unnecessary Call](#110-remove-unnecessary-call-to-daofiv1factoryformula)
    111. [Deeper Validation of Curve Math](#111-deeper-validation-of-curve-math)
    112. [GovernorAlpha proposals](#112-governoralpha-proposals-may-be-canceled-by-the-proposer-even-after-they-have-been-accepted-and-queued)
    113. [Require a Delay Period](#113-require-a-delay-period-before-granting-kyc_admin_role-acknowledged)
    114. [Improve Inline Documentation and Test Coverage](#114-improve-inline-documentation-and-test-coverage)
    115. [Unspecific Compiler Version Pragma](#115-unspecific-compiler-version-pragma)
    116. [Hardcoded Gas Limits](#116-use-of-hardcoded-gas-limits-can-be-problematic)
    117. [ReferralFeeReceiver](#117-anyone-can-steal-all-the-funds-that-belong-to-referralfeereceiver)
    118. [Unpredicatable Behavior](#118-unpredictable-behavior-for-users-due-to-admin-front-running-or-general-bad-timing)
    119. [Improve System Documentation](#119-improve-system-documentation-and-create-a-complete-technical-specification)
    120. [Ensure System States Roles and Permissions](#120-ensure-system-states-roles-and-permissions-are-sufficiently-restrictive)
2. [Block 2](#block-2)
    121. [Evaluate all Tokens](#121-evaluate-all-tokens-prior-to-inclusion-in-the-system)
    122. [Use Descriptive Names For Contracts and Libraries](#122-use-descriptive-names-for-contracts-and-libraries)
    123. [Used Before Initialized](#123-prevent-contracts-from-being-used-before-they-are-entirely-initialized)
    124. [Resource Exhaustion by External Calls](#124-potential-resource-exhaustion-by-external-calls-performed-within-an-unbounded-loop)
    125. [Owners Can Never Be Removed](#125-owners-can-never-be-removed)
    126. [Manipulation of Stable Interest Rates](#126-potential-manipulation-of-stable-interest-rates-using-flash-loans)
    127. [Only Whitelist Validated Assets](#127-only-whitelist-validated-assets)
    128. [Underflow if Token Decimals Greater Than 18](#128-underflow-if-token_decimals-are-greater-than-18)
    129. [Chainlink Price Volatility](#129-chainlinks-performance-at-times-of-price-volatility)
    130. [Iterative Approach to Launching](#130-consider-an-iterative-approach-to-launching)
    131. [Modifiers for Repeated Checks](#131-use-of-modifiers-for-repeated-checks)
    132. [Switch Modifier Order](#132-switch-modifier-order)
    133. [Address Codebase Fragility](#133-address-codebase-fragility)
    134. [Re-entrancy and Emitted Events](#134-reentrancy-could-lead-to-incorrect-order-of-emitted-events)
    135. [Variable Shadowing](#135-variable-shadowing-from-ousd-to-erc20)
    136. [VaultCore.rebase](#136-vaultcorerebase-functions-have-no-return-statements)
    137. [Missing Inheritances](#137-multiple-contracts-are-missing-inheritances)
    138. [Solidity Compiler Optimizations](#138-solidity-compiler-optimizations-can-be-dangerous)
    139. [Permission Granting](#139-permission-granting-is-too-simplistic-and-not-flexible-enough)
    140. [Lack of Validation](#140-lack-of-validation-when-setting-the-maturity-value)
---

### [Block 1](https://www.youtube.com/watch?v=IXm6JAprhuw)
#### 102. **Document potential edge cases for hook receiver contracts**
- The functions _withdrawTokenAndCall_() and _withdrawTokenAndCallOnBehalf_() make a call to a hook contract designated by the owner of the withdrawing stealth address. 
- There are very few constraints on the parameters to these calls in the Umbra contract itself. 
- Anyone can force a call to a hook contract by transferring a small amount of tokens to an address that they control and withdrawing these tokens, passing the target address as the hook receiver. 
    1. Recommendation: Developers of these _UmbraHookReceiver_ contracts should be sure to validate both the caller of the _tokensWithdrawn_() function and the function parameters.
    2. [ConsenSys's Audit of Umbra](https://consensys.net/diligence/audits/2021/03/umbra-smart-contracts/#document-potential-edge-cases-for-hook-receiver-contracts)

#### 103. **Document token behavior restrictions**
- As with any protocol that interacts with arbitrary ERC20 tokens, it is important to clearly document which tokens are supported. 
- Often this is best done by providing a specification for the behavior of the expected ERC20 tokens and only relaxing this specification after careful review of a particular class of tokens and their interactions with the protocol.   
    1. Recommendation: Known deviations from “normal” ERC20 behavior should be explicitly noted as NOT supported by the Umbra Protocol: 1) Deflationary or fee-on-transfer tokens: These are tokens in which the balance of the recipient of a transfer may not be increased by the amount of the transfer. There may also be some alternative mechanism by which balances are unexpectedly decreased. While these tokens can be successfully sent via the _sendToken()_ function, the internal accounting of the Umbra contract will be out of sync with the balance as recorded in the token contract, resulting in loss of funds. 2) Inflationary tokens: The opposite of deflationary tokens. The Umbra contract provides no mechanism for claiming positive balance adjustments. 3) Rebasing tokens: A combination of the above cases, these are tokens in which an account’s balance increases or decreases along with expansions or contractions in supply. The contract provides no mechanism to update its internal accounting in response to these unexpected balance adjustments, and funds may be lost as a result.
    2. [ConsenSys's Audit of Umbra](https://consensys.net/diligence/audits/2021/03/umbra-smart-contracts/#document-token-behavior-restrictions)

#### 104. **Full test suite is recommended**
- The test suite at this stage is not complete and many of the tests fail to execute. 
- For complicated systems such as DeFi Saver, which uses many different modules and interacts with different DeFi protocols, it is crucial to have a full test coverage that includes the edge cases and failed scenarios. 
- Especially this helps with safer future development and upgrading each module. 
- As we’ve seen in some smart contract incidents, a complete test suite can prevent issues that might be hard to find with manual reviews.
    1. Recommendation: Add a full coverage test suite.
    2. [ConsenSys's Audit of DeFi Saver](https://consensys.net/diligence/audits/2021/03/defi-saver/#full-test-suite-is-recommended)

#### 105. **Kyber getRates code is unclear**
- Function names don’t reflect their true functionalities, and the code uses some undocumented assumptions.  
    1. Recommendation: Refactor the code to separate getting rate functionality with getSellRate and getBuyRate. Explicitly document any assumptions in the code ( slippage, etc).
    2. [ConsenSys's Audit of DeFi Saver](https://consensys.net/diligence/audits/2021/03/defi-saver/#kyber-getrates-code-is-unclear)

#### 106. **Return value is not used for** _**TokenUtils.withdrawTokens**_ 
- The return value of _TokenUtils.withdrawTokens_ which represents the actual amount of tokens that were transferred is never used throughout the repository. 
- This might cause discrepancy in the case where the original value of __amount_ was _type(uint256).max_.
    1. Recommendation: The return value can be used to validate the withdrawal or used in the event emitted
    2. [ConsenSys's Audit of DeFi Saver](https://consensys.net/diligence/audits/2021/03/defi-saver/#return-value-is-not-used-for-tokenutils-withdrawtokens)

#### 107. **Missing access control for** _**DefiSaverLogger.Log**_ 
- _DefiSaverLogger_ is used as a logging aggregator within the entire dapp, but anyone can create logs.
    1. Recommendation: Add access control to all functions appropriately
    2. [Consensys Audit of DeFi Saver](https://consensys.net/diligence/audits/2021/03/defi-saver/#missing-access-control-for-defisaverlogger-log)

#### 108. **Remove stale comments**
- Remove inline comments that suggest the two uint256 values _DAOfiV1Pair.reserveBase_ and _DAOfiV1Pair.reserveQuote_ are stored in the same storage slot. 
- This is likely a carryover from the _UniswapV2Pair_ contract, in which _reserve0_, _reserve1_, and _blockTimestampLast_ are packed into a single storage slot.
    1. Recommendation: Remove stale comments
    2. [ConsenSys's Audit of DAOfi](https://consensys.net/diligence/audits/2021/02/daofi/#remove-stale-comments)

#### 109. **Discrepancy between code and comments**
- There is a mismatch between what the code implements and what the corresponding comment describes that code implements.
    1. Recommendation: Update the code or the comment to be consistent
    2. [ConsenSys's Audit of mstable-1.1](https://consensys.net/diligence/audits/2020/07/mstable-1.1/#discrepancy-between-code-and-comments)

#### 110. **Remove unnecessary call to** _**DAOfiV1Factory.formula**_**()**
- The _DAOfiV1Pair_ functions _initialize_(), _getBaseOut_(), and _getQuoteOut_() all use the private function _getFormula_(), which makes a call to the factory to retrieve the address of the _BancorFormula_ contract. 
- The formula address in the factory is set in the constructor and cannot be changed, so these calls can be replaced with an immutable value in the pair contract that is set in its constructor.
    1. Recommendation: Remove unnecessary calls
    2. [ConsenSys's Audit of DAOfi](https://consensys.net/diligence/audits/2021/02/daofi/#remove-unnecessary-call-to-daofiv1factory-formula)

#### 111. **Deeper validation of curve math**
- Increased testing of edge cases in complex mathematical operations could have identified at least one issue raised in this report. 
- Additional unit tests are recommended, as well as fuzzing or property-based testing of curve-related operations. 
- Improperly validated interactions with the _BancorFormula_ contract are seen to fail in unanticipated and potentially dangerous ways, so care should be taken to validate inputs and prevent pathological curve parameters.
    1. Recommendation: More validation of mathematical operations
    2. [ConsenSys's Audit of DAOfi](https://consensys.net/diligence/audits/2021/02/daofi/#deeper-validation-of-curve-math)

#### 112. _**GovernorAlpha**_ **proposals may be canceled by the proposer, even after they have been accepted and queued**
- _GovernorAlpha_ allows proposals to be canceled via cancel. 
- A proposer may cancel proposals in any of these states: Pending, Active, Canceled, Defeated, Succeeded, Queued, Expired. 
    1. Recommendation: Prevent proposals from being canceled unless they are in the Pending or Active states.
    2. [ConsenSys's Audit of Fei Protocol](https://consensys.net/diligence/audits/2021/01/fei-protocol/#governoralpha-proposals-may-be-canceled-by-the-proposer-even-after-they-have-been-accepted-and-queued)

#### 113. **Require a delay period before granting** _**KYC_ADMIN_ROLE**_  **Acknowledged**
- The KYC Admin has the ability to freeze the funds of any user at any time by revoking the _KYC_MEMBER_ROLE_. 
- The trust requirements from users can be decreased slightly by implementing a delay on granting this ability to new addresses. 
- While the management of private keys and admin access is outside the scope of this review, the addition of a time delay can also help protect the development team and the system itself in the event of private key compromise.
    1. Recommendation: Use a _TimelockController_ as the _KYC_DEFAULT_ADMIN_ of the eRLC contract
    2. [ConsenSys's Audit of eRLC](https://consensys.net/diligence/audits/2021/01/erlc-iexec/#erlc-require-a-delay-period-before-granting-kyc-admin-role)

#### 114. **Improve inline documentation and test coverage**
- The source-units hardly contain any inline documentation which makes it hard to reason about methods and how they are supposed to be used. Additionally, test-coverage seems to be limited. 
- Especially for a public-facing exchange contract system test-coverage should be extensive, covering all methods and functions that can directly be accessed including potential security-relevant and edge-cases. 
- This would have helped in detecting some of the findings raised with this report.
    1. Recommendation: Consider adding natspec-format compliant inline code documentation, describe functions, what they are used for, and who is supposed to interact with them. Document function or source-unit specific assumptions. Increase test coverage.
    2. [ConsenSys's Audit of 1inch Liquidity Protocol](https://consensys.net/diligence/audits/2020/12/1inch-liquidity-protocol/#improve-inline-documentation-and-test-coverage)

#### 115. **Unspecific compiler version pragma**
- For most source-units the compiler version pragma is very unspecific _^0.6.0_. 
- While this often makes sense for libraries to allow them to be included with multiple different versions of an application, it may be a security risk for the actual application implementation itself. 
- A known vulnerable compiler version may accidentally be selected or security tools might fall-back to an older compiler version ending up actually checking a different evm compilation that is ultimately deployed on the blockchain.
    1. Recommendation: Avoid floating pragmas. We highly recommend pinning a concrete compiler version (latest without security issues) in at least the top-level “deployed” contracts to make it unambiguous which compiler version is being used. Rule of thumb: a flattened source-unit should have at least one non-floating concrete solidity compiler version pragma.
    2. [ConsenSys's Audit of 1inch Liquidity Protocol](https://consensys.net/diligence/audits/2020/12/1inch-liquidity-protocol/#unspecific-compiler-version-pragma)

#### 116. **Use of hardcoded gas limits can be problematic**
- Hardcoded gas limits can be problematic as the past has shown that gas economics in ethereum have changed, and may change again potentially rendering the contract system unusable in the future.  
    1. Recommendation: Be conscious about this potential limitation and prepare for the case where gas prices might change in a way that negatively affects the contract system.
    2. [ConsenSys's Audit of 1inch Liquidity Protocol](https://consensys.net/diligence/audits/2020/12/1inch-liquidity-protocol/#use-of-hardcoded-gas-limits-can-be-problematic)

#### 117. **Anyone can steal all the funds that belong to** _**ReferralFeeReceiver**_
- The _ReferralFeeReceiver_ receives pool shares when users _swap()_ tokens in the pool. 
- A _ReferralFeeReceiver_ may be used with multiple pools and, therefore, be a lucrative target as it is holding pool shares. 
- Any token or ETH that belongs to the _ReferralFeeReceiver_ is at risk and can be drained by any user by providing a custom mooniswap pool contract that references existing token holdings. 
- It should be noted that none of the functions in _ReferralFeeReceiver_ verify that the user-provided mooniswap pool address was actually deployed by the linked MooniswapFactory.
    1. Recommendation: Enforce that the user-provided mooniswap contract was actually deployed by the linked factory. Other contracts cannot be trusted. Consider implementing token sorting and de-duplication (_tokenA!=tokenB_) in the pool contract constructor as well. Consider employing a reentrancy guard to safeguard the contract from reentrancy attacks. Improve testing. The methods mentioned here are not covered at all. Improve documentation and provide a specification that outlines how this contract is supposed to be used.
    2. Critical finding in [ConsenSys's Audit of 1inch Liquidity Protocol](https://consensys.net/diligence/audits/2020/12/1inch-liquidity-protocol/#out-of-scope-referralfeereceiver-anyone-can-steal-all-the-funds-that-belong-to-referralfeereceiver)

#### 118. **Unpredictable behavior for users due to admin front running or general bad timing**
- In a number of cases, administrators of contracts can update or upgrade things in the system without warning. 
- This has the potential to violate a security goal of the system. 
- Specifically, privileged roles could use front running to make malicious changes just ahead of incoming transactions, or purely accidental negative effects could occur due to the unfortunate timing of changes. 
- In general users of the system should have assurances about the behavior of the action they’re about to take.  
    1. Recommendation: We recommend giving the user advance notice of changes with a time lock. For example, make all system-parameter and upgrades require two steps with a mandatory time window between them. The first step merely broadcasts to users that a particular change is coming, and the second step commits that change after a suitable waiting period. This allows users that do not accept the change to withdraw immediately.
    2. [ConsenSys's Audit of 1inch Liquidity Protocol](https://consensys.net/diligence/audits/2020/12/1inch-liquidity-protocol/#unpredictable-behavior-for-users-due-to-admin-front-running-or-general-bad-timing)

#### 119. **Improve system documentation and create a complete technical specification**
- A system’s design specification and supporting documentation should be almost as important as the system’s implementation itself. 
- Users rely on high-level documentation to understand the big picture of how a system works. 
- Without spending time and effort to create palatable documentation, a user’s only resource is the code itself, something the vast majority of users cannot understand. 
- Security assessments depend on a complete technical specification to understand the specifics of how a system works. 
- When a behavior is not specified (or is specified incorrectly), security assessments must base their knowledge in assumptions, leading to less effective review. 
- Maintaining and updating code relies on supporting documentation to know why the system is implemented in a specific way. If code maintainers cannot reference documentation, they must rely on memory or assistance to make high-quality changes. 
- Currently, the only documentation for Growth DeFi is a single README file, as well as code comments.
    1. Recommendation: Improve system documentation and create a complete technical specification
    2. [ConsenSys's Audit of Growth DeFi](https://consensys.net/diligence/audits/2020/12/growth-defi-v1/#improve-system-documentation-and-create-a-complete-technical-specification)

#### 120. **Ensure system states, roles, and permissions are sufficiently restrictive**
- Smart contract code should strive to be strict. Strict code behaves predictably, is easier to maintain, and increases a system’s ability to handle nonideal conditions. Our assessment of Growth DeFi found that many of its states, roles, and permissions are loosely defined.
    1. Recommendation: Document the use of administrator permissions. Monitor the usage of administrator permissions. Specify strict operation requirements for each contract.
    2. [ConsenSys's Audit of Growth DeFi](https://consensys.net/diligence/audits/2020/12/growth-defi-v1/#ensure-system-states-roles-and-permissions-are-sufficiently-restrictive)

### [Block 2](https://www.youtube.com/watch?v=yphqu2N35X4)
#### 121. **Evaluate all tokens prior to inclusion in the system**
- Review current and future tokens in the system for non-standard behavior.
- Particularly dangerous functionality to look for includes a callback (ie. ERC777) which would enable an attacker to execute potentially arbitrary code during the transaction, fees on transfers, or inflationary/deflationary tokens.
    1. Recommendation: Evaluate all tokens prior to inclusion in the system
    2. [ConsenSys's Audit of Growth DeFi](https://consensys.net/diligence/audits/2020/12/growth-defi-v1/#evaluate-all-tokens-prior-to-inclusion-in-the-system)

#### 122. **Use descriptive names for contracts and libraries**
- The code base makes use of many different contracts, abstract contracts, interfaces, and libraries for inheritance and code reuse.
- In principle, this can be a good practice to avoid repeated use of similar code.
- However, with no descriptive naming conventions to signal which files would contain meaningful logic, codebase becomes difficult to navigate.
    1. Recommendation: Use descriptive names for contracts and libraries
    2. [ConsenSys's Audit of Growth DeFi](https://consensys.net/diligence/audits/2020/12/growth-defi-v1/#use-descriptive-names-for-contracts-and-libraries)

#### 123. **Prevent contracts from being used before they are entirely initialized**
- Many contracts allow users to deposit / withdraw assets before the contracts are entirely initialized, or while they are in a semi-configured state.
- Because these contracts allow interaction on semi-configured states, the number of configurations possible when interacting with the system makes it incredibly difficult to determine whether the contracts behave as expected in every scenario, or even what behavior is expected in the first place.
    1. Recommendation: Prevent contracts from being used before they are entirely initialized
    2. [ConsenSys's Audit of Growth DeFi](https://consensys.net/diligence/audits/2020/12/growth-defi-v1/#prevent-contracts-from-being-used-before-they-are-entirely-initialized)

#### 124. **Potential resource exhaustion by external calls performed within an unbounded loop**
- _DydxFlashLoanAbstraction_._requestFlashLoan_ performs external calls in a potentially-unbounded loop.
- Depending on changes made to DyDx’s _SoloMargin_, this may render this flash loan provider prohibitively expensive.
- In the worst case, changes to _SoloMargin_ could make it impossible to execute this code due to the block gas limit.
    1. Recommendation: Reconsider or bound the loop
    2. [ConsenSys's Audit of Growth DeFi](https://consensys.net/diligence/audits/2020/12/growth-defi-v1/#potential-resource-exhaustion-by-external-calls-performed-within-an-unbounded-loop)

#### 125. **Owners can never be removed**
- The intention of _setOwners_() is to replace the current set of owners with a new set of owners.
- However, the _isOwner_ mapping is never updated, which means any address that was ever considered an owner is permanently considered an owner for purposes of signing transactions.
    1. Recommendation: In _setOwners__(), before adding new owners, loop through the current set of owners and clear their _isOwner_ booleans
    2. Critical finding in [ConsenSys's Audit of Paxos](https://consensys.net/diligence/audits/2020/11/paxos/#owners-can-never-be-removed)

#### 126. **Potential manipulation of stable interest rates using flash loans**
- Flash loans allow users to borrow large amounts of liquidity from the protocol.
- It is possible to adjust the stable rate up or down by momentarily removing or adding large amounts of liquidity to reserves.
    1. Recommendation: This type of manipulation is difficult to prevent especially when flash loans are available. Aave should monitor the protocol at all times to make sure that interest rates are being rebalanced to sane values.
    2. [ConsenSys's Audit of Aave Protocol V2](https://consensys.net/diligence/audits/2020/09/aave-protocol-v2/#potential-manipulation-of-stable-interest-rates-using-flash-loans)

#### 127. **Only whitelist validated assets**
- Because some of the functionality relies on correct token behavior, any whitelisted token should be audited in the context of this system.
- Problems can arise if a malicious token is whitelisted because it can block people from voting with that specific token or gain unfair advantage if the balance can be manipulated.
    1. Recommendation: Make sure to audit any new whitelisted asset.
    2. [ConsenSys's Audit of Aave Governance DAO](https://consensys.net/diligence/audits/2020/08/aave-governance-dao/#only-whitelist-validated-assets)

#### 128. **Underflow if** _**TOKEN_DECIMALS**_ **are greater than 18**
- In _latestAnswer_(), the assumption is made that _TOKEN_DECIMALS_ is less than 18.
    1. Recommendation: Add a simple check to the constructor to ensure the added token has 18 decimals or less
    2. [ConsenSys's Audit of Aave CPM Price Provider](https://consensys.net/diligence/audits/2020/05/aave-cpm-price-provider/#underflow-if-token-decimals-are-greater-than-18)

#### 129. **Chainlink’s performance at times of price volatility**
- In order to understand the risk of the Chainlink oracle deviating significantly, it would be helpful to compare historical prices on Chainlink when prices are moving rapidly, and see what the largest historical delta is compared to the live price on a large exchange.
    1. Recommendation: Review Chainlink’s performance at times of price volatility
    2. [ConsenSys's Audit of Aave CPM Price Provider](https://consensys.net/diligence/audits/2020/05/aave-cpm-price-provider/#review-chainlink-s-performance-at-times-of-price-volatility)

#### 130. Consider an iterative approach to launching.
- Be aware of and prepare for worst-case scenarios
- The system has many components with complex functionality and no apparent upgrade path.
    1. Recommendation: We recommend identifying which components are crucial for a minimum viable system, then focusing efforts on ensuring the security of those components first, and then moving on to the others. During the early life of the system, have a method for pausing and upgrading the system.
    2. [ConsenSys's Audit of Lien Protocol](https://consensys.net/diligence/audits/2020/05/lien-protocol/#consider-an-iterative-approach-to-launching)

#### 131. **Use of modifiers for repeated checks**
- It is recommended to use modifiers for common checks within different functions.
- This will result in less code duplication in the given smart contract and adds significant readability into the code base.
    1. Recommendation: Use of modifiers for repeated checks
    2. [ConsenSys's Audit of Balancer Finance](https://consensys.net/diligence/audits/2020/05/balancer-finance/#use-of-modifiers-for-repeated-checks)

#### 132. **Switch modifier order**:
- _BPool_ functions often use modifiers in the following order: __logs__, __lock__.
- Because __lock__ is a reentrancy guard, it should take precedence over __logs_._
    1. Recommendation: Place __lock__ before other modifiers; ensuring it is the very first and very last thing to run when a function is called.
    2. [ConsenSys's Audit of Balancer Finance](https://consensys.net/diligence/audits/2020/05/balancer-finance/#switch-modifier-order-in-bpool)

#### 133. **Address codebase fragility**
- Software is considered “fragile” when issues or changes in one part of the system can have side-effects in conceptually unrelated parts of the codebase.
- Fragile software tends to break easily and may be challenging to maintain.
    1. Recommendation: Building an anti-fragile system requires careful thought and consideration outside of the scope of this review. In general, prioritize the following concepts: 1) Follow the single-responsibility principle of functions 2) Reduce reliance on external systems
    2. [ConsenSys's Audit of MCDEX Mai Protocol V2](https://consensys.net/diligence/audits/2020/05/mcdex-mai-protocol-v2/#address-codebase-fragility)

#### 134. **Reentrancy could lead to incorrect order of emitted events**
- The order of operations in the _moveTokensAndETHfromAdjustment_ function in the _BorrowOperations_ contract may allow an attacker to cause events to be emitted out of order.
- In the event that the borrower is a contract, this could trigger a callback into _BorrowerOperations_, executing the _ _adjustTrove_ flow above again.
- As the _moveTokensAndETHfromAdjustment_ call is the final operation in the function the state of the system on-chain cannot be manipulated.
- However, there are events that are emitted after this call.
- In the event of a reentrant call, these events would be emitted in the incorrect order.
- The event for the second operation i s emitted first, followed by the event for the first operation.
- Any off-chain monitoring tools may now have an inconsistent view of on-chain state.
    1. Recommendation: Apply the checks-effects-interactions pattern and move the event emissions above the call to _ _moveTokensAndETHfromAdjustment_ to avoid the potential reentrancy.
    2. [ToB's Audit of Liquidity](https://github.com/trailofbits/publications/blob/master/reviews/Liquity.pdf)

#### 135. **Variable shadowing from OUSD to ERC20**
- OUSD inherits from ERC20, but redefines the _ _allowances_ and _ _totalSupply_ state variables.
- As a result, access to these variables can lead to returning different values.
    1. Recommendation: Remove the shadowed variables (_ _allowances_ and _ _totalSupply_) in OUSD.
    2. [ToB's Audit of Origin Dollar](https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf)

#### 136. **VaultCore.rebase functions have no return statements**
- _VaultCore.rebase()_ and _VaultCore.rebase(bool)_ return a _uint_ but lack a return statement.
- As a result these functions will always return the default value, and are likely to cause issues for their callers.
- Both _VaultCore.rebase()_ and _VaultCore.rebase(bool)_ are expected to return a _uint256_. _rebase()_ does not have a return statement.
- _rebase(bool)_ has one return statement in one branch (return 0), but lacks a return statement for the other paths.
- So both functions will always return zero. As a result, a third-party code relying on the return value might not work as intended.
    1. Recommendation: Add the missing return statement(s) or remove the return type in _VaultCore.rebase()_ and _VaultCore.rebase(bool)_. Properly adjust the documentation as necessary.
    2. [ToB's Audit of Origin Dollar](https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf)

#### 137. **Multiple contracts are missing inheritances**
- Multiple contracts are the implementation of their interfaces, but do not inherit from them.
- This behavior is error-prone and might lead the implementation to not follow the interface if the code is updated.
    1. Recommendation: Ensure contracts inherit from their interfaces
    2. [ToB's Audit of Origin Dollar](https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf)

#### 138. **Solidity compiler optimizations can be dangerous**
- Yield Protocol has enabled optional compiler optimizations in Solidity.
- There have been several bugs with security implications related to optimizations.
- Moreover, optimizations are actively being developed .
- Solidity compiler optimizations are disabled by default, and it is unclear how many contracts in the wild actually use them.
- Therefore, it is unclear how well they are being tested and exercised.
- High-severity security issues due to optimization bugs have occurred in the past .
	- A high-severity bug in the emscripten -generated solc-js compiler used by Truffle and Remix persisted until late 2018.
		- The fix for this bug was not reported in the Solidity CHANGELOG.
	- Another high-severity optimization bug resulting in incorrect bit shift results was patched in Solidity 0.5.6 .
    1. Recommendation: Short term, measure the gas savings from optimizations, and carefully weigh them against the possibility of an optimization-related bug. Long term, monitor the development and adoption of Solidity compiler optimizations to assess their maturity.
    2. [ToB's Audit of Yield Protocol](https://github.com/trailofbits/publications/blob/master/reviews/YieldProtocol.pdf)

#### 139. **Permission-granting is too simplistic and not flexible enough**
- The Yield Protocol contracts implement an oversimplified permission system that can be abused by the administrator.
- The Yield Protocol implements several contracts that need to call privileged functions from each other.
- However, there is no way to specify which operation can be called for every privileged user.
- All the authorized addresses can call any restricted function, and the owner can add any number of them.
- Also, the privileged addresses are supposed to be smart contracts; however, there is no check for that. Moreover, once an address is added, it cannot be deleted.
    1. Recommendation: Rewrite the authorization system to allow only certain addresses to access certain functions
    2. [ToB's Audit of Yield Protocol](https://github.com/trailofbits/publications/blob/master/reviews/YieldProtocol.pdf)

#### 140. **Lack of validation when setting the maturity value
- When a _fyDAI_ contract is deployed, one of the deployment parameters is a maturity date, passed as a Unix timestamp.
- This is the date at which point _fyDAI_ tokens can be redeemed for the underlying Dai.
- Currently, the contract constructor performs no validation on this timestamp to ensure it is within an acceptable range.
- As a result, it is possible to mistakenly deploy a _YDai_ contract that has a maturity date in the past or many years in the future, which may not be immediately noticed.
    1. Recommendation: Short term, add checks to the _YDai_ contract constructor to ensure maturity timestamps fall within an acceptable range. This will prevent maturity dates from being mistakenly set in the past or too far in the future. Long term, always perform validation of parameters passed to contract constructors. This will help detect and prevent errors during deployment.
    2. [ToB's Audit of Yield Protocol](https://github.com/trailofbits/publications/blob/master/reviews/YieldProtocol.pdf)