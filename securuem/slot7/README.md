## Slot 7 Audit Findings 101

---
### Table of Contents
1. [Block 1](#block-1)
    1. [Unhandled Retunr Values of transfer and trasferfrom](#1-unhandled-return-values-of-transfer-and-transferfrom)
    2. [Random Task Execution](#2-random-task-execution)
    3. [Tokens With More Than 18 Decimal Points](#3-tokens-with-more-than-18-decimal-points-will-cause-issues)
    4. [Error Codes of Compounds Comptrollerentermarket Comptrollerexitmarket are not Checked](#4-error-codes-of-compounds-comptrollerentermarket-comptrollerexitmarket-are-not-checked)
    5. [Reversed Order of Parameters](#5-reversed-order-of-parameters-in-allowance-function-call)
    6. [Token Approvals](#6-token-approvals-can-be-stolen-in-daofiv1router01addliquidity)
    7. [swapExactTokensForETH](#7-swapexacttokensforeth_-checks-the-wrong-return-value)
    8. [DAOfiV1Pair.deposit()](#8-daofiv1pairdeposit-accepts-deposits-of-zero-blocking-the-pool)
    9. [GenesisGroup.commit](#9-genesisgroupcommit-overwrites-previously-committed-values)
    10. [Purchasing and committing still possible after launch](#10-purchasing-and-committing-still-possible-after-launch)
    11. [UniswapIncentive overflow](#11-uniswapincentive-overflow-on-pre-transfer-hooks)
    12. [BondingCurve](#12-bondingcurve-allows-users-to-acquire-fei-before-launch)
    13. [Timed.isTimeEnded](#13-timedistimeended-returns-true-if-the-timer-has-not-been-initialized)
    14. [Overflow/underflow protection](#14-overflowunderflow-protection)
    15. [Unchecked return value for _IWETH.transfer_ call](#15-unchecked-return-value-for-iwethtransfer-call)
    16. [GenesisGroup.emergencyExit](#16-genesisgroupemergencyexit-remains-functional-after-launch)
    17. [ERC20 tokens with no return value will fail to transfer](#17-erc20-tokens-with-no-return-value-will-fail-to-transfer)
    18. [Reentrancy vulnerability in MetaSwap.swap()](#18-reentrancy-vulnerability-in-metaswapswap)
    19. [Malicious Adapter](#19-a-new-malicious-adapter-can-access-users-tokens)
    20. [Adapter Front Run](#20-owner-can-front-run-traders-by-updating-adapters)
2. [Block 2](#block-2)
    21. [Momentary Staking](#21-users-can-collect-interest-from-savingscontract-by-only-staking-mtokens-momentarily)
    22. [Oracel Update Manipulation](#22-oracle-updates-can-be-manipulated-to-perform-atomic-front-running-attack)
    23. [Function Input Validation](#23-certain-functions-lack-input-validation-routines)
    24. [Administrator Backdoor](#24-remove-loihi-methods-that-can-be-used-as-backdoors-by-the-administrator)
    25. [Reverting Fallback](#25-a-reverting-fallback-function-will-lock-up-all-payouts)
    26. [safeRageQuit](#26-saferagequit-makes-you-lose-funds)
    27. [Creating Proposal](#27-creating-proposal-is-not-trustless)
    28. [Emergency Processing](#28-emergency-processing-can-be-blocked)
    29. [Token Overflow](#29-token-overflow-might-result-in-system-halt-or-loss-of-funds)
    30. [Whitelisted Tokens Limit](#30-whitelisted-tokens-limit)
    31. [Steal funds using ``bailout``](#31-summoner-can-steal-funds-using-bailout)
    32. [Sponsorship Front Running](#32-sponsorship-front-running)
    33. [Delegate Assignment Front Running](#33-delegate-assignment-front-running)
    34. [Queued Transactions Cannot Be Canceled](#34-queued-transactions-cannot-be-canceled)
    35. [Proposal.execute](#35-proposal-transactions-can-be-executed-separately-and-block-proposalexecute-call)
    36. [Timelock.admin Takeover](#36-proposals-could-allow-timelockadmin-takeover)
    37. [mintMultiple](#37-reentrancy-and-untrusted-contract-call-in-mintmultiple)
    38. [Lack of Return Value Checks](#38-lack-of-return-value-checks-can-lead-to-unexpected-results)
    39. [External Calls](#39-external-calls-in-loop-can-lead-to-denial-of-service)
    40. [Transfer more than expected](#40-ousd-allows-users-to-transfer-more-tokens-than-expected)

---


### [Block 1](https://www.youtube.com/watch?v=SromSImIpHE)
#### 1. **Unhandled return values of** _**transfer**_ **and** _**transferFrom**_
- ERC20 implementations are not always consistent. 
- Some implementations of _transfer_ and _transferFrom_ could return ‘false’ on failure instead of reverting. 
- It is safer to wrap such calls into _require()_ statements to these failures.
	1. Recommendation: Check the return value and revert on 0/false or use OpenZeppelin’s _SafeERC20_ wrapper functions
	2. Medium severity finding from [Consensys Diligence Audit of Aave Protocol V2](https://consensys.net/diligence/audits/2020/09/aave-protocol-v2/#unhandled-return-values-of-transfer-and-transferfrom)

#### 2. **Random task execution**
- In a scenario where a user takes a flash loan, __parseFLAndExecute()_ gives the flash loan wrapper contract (_FLAaveV2_, _FLDyDx_) the permission to execute functions on behalf of the user’s _DSProxy_. 
- This execution permission is revoked only after the entire recipe execution is finished, which means that in case that any of the external calls along the recipe execution is malicious, it might call _executeAction()_ back, i.e. 
- Reentrancy Attack, and inject any task it wishes (e.g. take user’s funds out, drain approved tokens, etc)
    1. Recommendation: A reentrancy guard (mutex) should be used to prevent such attack
    2. Critical severity finding from [Consensys Diligence Audit of Defi Saver](https://consensys.net/diligence/audits/2021/03/defi-saver/#random-task-execution)

#### 3. Tokens with more than 18 decimal points will cause issues**: 
- It is assumed that the maximum number of decimals for each token is 18. 
- However uncommon, it is possible to have tokens with more than 18 decimals, as an example YAMv2 has 24 decimals. This can result in broken code flow and unpredictable outcomes
    1. Recommendation: Make sure the code won’t fail in case the token’s decimals is more than 18
    2. Major severity finding from [Consensys Diligence Audit of Defi Saver](https://consensys.net/diligence/audits/2021/03/defi-saver/#tokens-with-more-than-18-decimal-points-will-cause-issues)

#### 4. Error codes of Compound’s** _**Comptroller.enterMarket**_**,** _**Comptroller.exitMarket**_ **are not checked**
- Compound’s _enterMarket_/_exitMarket_ functions return an error code instead of reverting in case of failure. DeFi Saver smart contracts never check for the error codes returned from Compound smart contracts.
    1. Recommendation: Caller contract should revert in case the error code is not 0
    2. Major severity finding from [Consensys Diligence Audit of Defi Saver](https://consensys.net/diligence/audits/2021/03/defi-saver/#error-codes-of-compound-s-comptroller-entermarket-comptroller-exitmarket-are-not-checked)

#### 5. Reversed order of parameters in allowance function call
- The parameters that are used for the allowance function call are not in the same order that is used later in the call to _safeTransferFrom_.
    1. Recommendation: Reverse the order of parameters in allowance function call to fit the order that is in the safeTransferFrom function call.
    2. Medium severity finding from [Consensys Diligence Audit of Defi Saver](https://consensys.net/diligence/audits/2021/03/defi-saver/#reversed-order-of-parameters-in-allowance-function-call)

#### 6. Token approvals can be stolen in _**DAOfiV1Router01.addLiquidity()**_ 
- DAOfiV1Router01.addLiquidity() creates the desired pair contract if it does not already exist, then transfers tokens into the pair and calls _DAOfiV1Pair.deposit()_. 
- There is no validation of the address to transfer tokens from, so an attacker could pass in any address with nonzero token approvals to _DAOfiV1Router_. 
- This could be used to add liquidity to a pair contract for which the attacker is the _pairOwner_, allowing the stolen funds to be retrieved using DAOfiV1Pair.withdraw().
    1. Recommendation: Transfer tokens from msg.sender instead of lp.sender
    2. Critical severity finding from [Consensys Diligence Audit of DAOfi](https://consensys.net/diligence/audits/2021/02/daofi/#token-approvals-can-be-stolen-in-daofiv1router01-addliquidity)

#### 7. **swapExactTokensForETH**_ **checks the wrong return value
- Instead of checking that the amount of tokens received from a swap is greater than the minimum amount expected from this swap, it calculates the difference between the initial receiver’s balance and the balance of the router
    1. Recommendation: Check the intended values
    2. Major severity finding from [Consensys Diligence Audit of DAOfi](https://consensys.net/diligence/audits/2021/02/daofi/#the-swapexacttokensforeth-checks-the-wrong-return-value)

#### 8. DAOfiV1Pair.deposit() accepts deposits of zero, blocking the pool 
- DAOfiV1Pair.deposit() is used to deposit liquidity into the pool. 
- Only a single deposit can be made, so no liquidity can ever be added to a pool where deposited == true. 
- The deposit() function does not check for a nonzero deposit amount in either token, so a malicious user that does not hold any of the _baseToken_ or _quoteToken_ can lock the pool by calling deposit() without first transferring any funds to the pool.
    1. Recommendation: Require a minimum deposit amount with non-zero checks
    2. Medium severity finding from [Consensys Diligence Audit of DAOfi](https://consensys.net/diligence/audits/2021/02/daofi/#daofiv1pair-deposit-accepts-deposits-of-zero-blocking-the-pool)

#### 9. GenesisGroup.commit overwrites previously-committed values
- The amount stored in the recipient’s _committedFGEN_ balance overwrites any previously-committed value. 
- Additionally, this also allows anyone to commit an amount of “0” to any account, deleting their commitment entirely.
    1. Recommendation: Ensure the committed amount is added to the existing commitment.
    2. Critical severity finding from [Consensys Diligence Audit of Fei Protocol](https://consensys.net/diligence/audits/2021/01/fei-protocol/#genesisgroup-commit-overwrites-previously-committed-values)

#### 10. Purchasing and committing still possible after launch
- Even after _GenesisGroup.launch_ has successfully been executed, it is still possible to invoke _GenesisGroup.purchase_ and _GenesisGroup.commit_.
	1. Recommendation: Consider adding validation in _GenesisGroup.purchase_ and _GenesisGroup.commit_ to make sure that these functions cannot be called after the launch.
	2. Critical severity finding from [Consensys Diligence Audit of Fei Protocol](https://consensys.net/diligence/audits/2021/01/fei-protocol/#purchasing-and-committing-still-possible-after-launch)

#### 11. UniswapIncentive overflow on pre-transfer hooks 
- Before a token transfer is performed, Fei performs some combination of mint/burn operations via _UniswapIncentive.incentivize_. 
- Both _incentivizeBuy_ and _incentivizeSell_ calculate buy/sell incentives using overflow-prone math, then mint / burn from the target according to the results. 
- This may have unintended consequences, like allowing a caller to mint tokens before transferring them, or burn tokens from their recipient.  
    1. Recommendation: Ensure casts in _getBuyIncentive_ and _getSellPenalty_ do not overflow
    2. Major severity finding from [Consensys Diligence Audit of Fei Protocol](https://consensys.net/diligence/audits/2021/01/fei-protocol/#uniswapincentive-overflow-on-pre-transfer-hooks)

#### 12. BondingCurve **allows users to acquire FEI before launch 
- allocate can be called before genesis launch, as long as the contract holds some nonzero PCV. 
- By force-sending the contract 1 wei, anyone can bypass the majority of checks and actions in allocate, and mint themselves FEI each time the timer expires.
    1. Recommendation: Prevent allocate from being called before genesis launch
    2. Medium severity finding from [Consensys Diligence Audit of Fei Protocol](https://consensys.net/diligence/audits/2021/01/fei-protocol/#bondingcurve-allows-users-to-acquire-fei-before-launch)

#### 13. Timed.isTimeEnded returns true if the timer has not been initialized
- Timed_ initialization is a 2-step process: 
	1) _Timed.duration_ is set in the constructor 
	2) _Timed.startTime_ is set when the method __initTimed_ is called. 
		- Before this second method is called, _isTimeEnded_() calculates remaining time using a _startTime_ of 0, resulting in the method returning true for most values, even though the timer has not technically been started.
    1. Recommendation: If Timed has not been initialized, _isTimeEnded_() should return false, or revert
    2. Medium severity finding from [Consensys Diligence Audit of Fei Protocol](https://consensys.net/diligence/audits/2021/01/fei-protocol/#timed-istimeended-returns-true-if-the-timer-has-not-been-initialized)

#### 14. Overflow/underflow protection 
- Having overflow/underflow vulnerabilities is very common for smart contracts. 
- It is usually mitigated by using SafeMath or using solidity version ^0.8 (after solidity 0.8 arithmetical operations already have default overflow/underflow protection). 
- In this code, many arithmetical operations are used without the ‘safe’ version. 
- The reasoning behind it is that all the values are derived from the actual ETH values, so they can’t overflow.  
    1. Recommendation: In our opinion, it is still safer to have these operations in a safe mode. So we recommend using SafeMath or solidity version ^0.8 compiler.
    2. Medium severity finding from [Consensys Diligence Audit of Fei Protocol](https://consensys.net/diligence/audits/2021/01/fei-protocol/#overflow-underflow-protection)

#### 15. Unchecked return value for _IWETH.transfer_ call
- In _EthUniswapPCVController_, there is a call to _IWETH.transfer_ that does not check the return value. 
- It is usually good to add a require-statement that checks the return value or to use something like _safeTransfer_; unless one is sure the given token reverts in case of a failure.  
    1. Recommendation: Consider adding a require-statement or using _safeTransfer_
    2. Medium severity finding from [Consensys Diligence Audit of Fei Protocol](https://consensys.net/diligence/audits/2021/01/fei-protocol/#unchecked-return-value-for-iweth-transfer-call)

#### 16. GenesisGroup.emergencyExit remains functional after launch
- emergencyExit_ is intended as an escape mechanism for users in the event the genesis launch method fails or is frozen. 
- _emergencyExit_ becomes callable 3 days after launch is callable. 
- These two methods are intended to be mutually-exclusive, but are not: either method remains callable after a successful call to the other. 
- This may result in accounting edge cases.  
    1. Recommendation: 
	    1) Ensure launch cannot be called if _emergencyExit_ has been called 
	    2) Ensure _emergencyExit_ cannot be called if launch has been called        
    2. Medium severity finding from [Consensys Diligence Audit of Fei Protocol](https://consensys.net/diligence/audits/2021/01/fei-protocol/#genesisgroup-emergencyexit-remains-functional-after-launch)

#### 17. ERC20 tokens with no return value will fail to transfer 
- Although the ERC20 standard suggests that a transfer should return true on success, many tokens are non-compliant in this regard. 
- In that case, the .transfer() call here will revert even if the transfer is successful, because solidity will check that the _RETURNDATASIZE_ matches the ERC20 interface.  
    1. Recommendation: Consider using OpenZeppelin’s SafeERC20
    2. Major severity finding from [Consensys Diligence Audit of bitbank](https://consensys.net/diligence/audits/2020/11/bitbank/#erc20-tokens-with-no-return-value-will-fail-to-transfer)

#### 18. Reentrancy vulnerability in MetaSwap.swap()
- If an attacker is able to reenter _swap()_, they can execute their own trade using the same tokens and get all the tokens for themselves.  
    1. Recommendation: Use a simple reentrancy guard, such as OpenZeppelin’s ReentrancyGuard to prevent reentrancy in _MetaSwap.swap()_
    2. Major severity finding from [Consensys Diligence Audit of MetaSwap](https://consensys.net/diligence/audits/2020/08/metaswap/#reentrancy-vulnerability-in-metaswap-swap)

#### 19. A new malicious adapter can access users’ tokens
- The purpose of the _MetaSwap_ contract is to save users gas costs when dealing with a number of different aggregators. 
- They can just approve() their tokens to be spent by _MetaSwap_ (or in a later architecture, the Spender contract). 
- They can then perform trades with all supported aggregators without having to reapprove anything. 
- A downside to this design is that a malicious (or buggy) adapter has access to a large collection of valuable assets. 
- Even a user who has diligently checked all existing adapter code before interacting with _MetaSwap_ runs the risk of having their funds intercepted by a new malicious adapter that’s added later.
    1. Recommendation: Make _MetaSwap_ contract the only contract that receives token approval. It then moves tokens to the Spender contract before that contract _DELEGATECALLs_ to the appropriate adapter. In this model, newly added adapters shouldn’t be able to access users’ funds.
    2. Medium severity finding from [Consensys Diligence Audit of MetaSwap](https://consensys.net/diligence/audits/2020/08/metaswap/#a-new-malicious-adapter-can-access-users-tokens)

#### 20. Owner can front-run traders by updating adapters
- MetaSwap_ owners can front-run users to swap an adapter implementation. 
- This could be used by a malicious or compromised owner to steal from users. 
- Because adapters are _DELEGATECALL’ed_, they can modify storage. 
- This means any adapter can overwrite the logic of another adapter, regardless of what policies are put in place at the contract level. 
- Users must fully trust every adapter because just one malicious adapter could change the logic of all other adapters.  
    1. Recommendation: At a minimum, disallow modification of existing adapters. Instead, simply add new adapters and disable the old ones.
    2. Medium severity finding from [Consensys Diligence Audit of MetaSwap](https://consensys.net/diligence/audits/2020/08/metaswap/#owner-can-front-run-traders-by-updating-adapters)

### [Block 2](https://www.youtube.com/watch?v=KLBi3Uyg0dY)
#### 21. Users can collect interest from SavingsContract **by only staking mTokens momentarily**
- The _SAVE_ contract allows users to deposit _mAssets_ in return for lending yield and swap fees.
- When depositing _mAsset_, users receive a “credit” tokens at the momentary credit/_mAsset_ exchange rate which is updated at every deposit.
- However, the smart contract enforces a minimum timeframe of 30 minutes in which the interest rate will not be updated.
- A user who deposits shortly before the end of the timeframe will receive credits at the stale interest rate and can immediately trigger an update of the rate and withdraw at the updated (more favorable) rate after the 30 minutes window.
- As a result, it would be possible for users to benefit from interest payouts by only staking mAssets momentarily and using them for other purposes the rest of the time.
    1. Recommendation: Remove the 30 minutes window such that every deposit also updates the exchange rate between credits and tokens.
    2. Medium severity finding from [Consensys Diligence Audit of mstable-1.1](https://consensys.net/diligence/audits/2020/07/mstable-1.1/#users-can-collect-interest-from-savingscontract-by-only-staking-mtokens-momentarily)

#### 22. Oracle updates can be manipulated to perform atomic front-running attack
- It is possible to atomically arbitrage rate changes in a risk-free way by “sandwiching” the Oracle update between two transactions.
- The attacker would send the following 2 transactions at the moment the Oracle update appears in the mempool:
	1) The first transaction, which is sent with a higher gas price than the Oracle update transaction, converts a very small amount.
		- This “locks in” the conversion weights for the block since _handleExternalRateChange()_ only updates weights once per block.
		- By doing this, the arbitrageur ensures that the stale Oracle price is initially used when doing the first conversion in the following transaction.
	2) The second transaction, which is sent at a slightly lower gas price than the transaction that updates the Oracle, performs a large conversion at the old weight, adds a small amount of Liquidity to trigger rebalancing and converts back at the new rate.
		- The attacker can obtain liquidity for step 2 using a flash loan. The attack will deplete the reserves of the pool.
    1. Recommendation: Do not allow users to trade at a stale Oracle rate and trigger an Oracle price update in the same transaction.
    2. Critical severity finding from [Consensys Diligence Audit of Bancor v2 AMM](https://consensys.net/diligence/audits/2020/06/bancor-v2-amm-security-audit/#oracle-updates-can-be-manipulated-to-perform-atomic-front-running-attack)

#### 23. Certain functions lack input validation routines
- The functions should first check if the passed arguments are valid first.
- These checks should include, but not be limited to:
	1) uint should be larger than 0 when 0 is considered invalid
	2) uint should be within constraints
	3) int should be positive in some cases
	4) length of arrays should match if more arrays are sent as arguments
	5) addresses should not be 0x0
    1. Recommendation: Add tests that check if all of the arguments have been validated. Consider checking arguments as an important part of writing code and developing the system.
    2. Major severity finding from [Consensys Diligence Audit of Shell Protocol](https://consensys.net/diligence/audits/2020/06/shell-protocol/#certain-functions-lack-input-validation-routines)

#### 24. Remove _**Loihi**_ methods that can be used as backdoors by the administrator
- There are several functions in _Loihi_ that give extreme powers to the shell administrator.
- The most dangerous set of those is the ones granting the capability to add assimilators.
- Since assimilators are essentially a proxy architecture to delegate code to several different implementations of the same interface, the administrator could, intentionally or unintentionally, deploy malicious or faulty code in the implementation of an assimilator.
- This means that the administrator is essentially totally trusted to not run code that, for example, drains the whole pool or locks up the users’ and LPs’ tokens.
- In addition to these, the function _safeApprove_ allows the administrator to move any of the tokens the contract holds to any address regardless of the balances any of the users have.
- This can also be used by the owner as a backdoor to completely drain the contract.
    1. Recommendation: Remove the _safeApprove_ function and, instead, use a trustless escape-hatch mechanism.
	    - For the assimilator addition functions, our recommendation is that they are made completely internal, only callable in the constructor, at deploy time.
	    - Even though this is not a big structural change (in fact, it reduces the attack surface), it is, indeed, a feature loss.
	    - However, this is the only way to make each shell a time-invariant system.
	    - This would not only increase Shell’s security but also would greatly improve the trust the users have in the protocol since, after deployment, the code is now static and auditable.
    2. Major severity finding from [Consensys Diligence Audit of Shell Protocol](https://consensys.net/diligence/audits/2020/06/shell-protocol/#remove-loihi-methods-that-can-be-used-as-backdoors-by-the-administrator)

#### 25. **A reverting fallback function will lock up all payouts**
- In ``BoxExchange.sol``, the internal function ``transferEth()`` reverts if the transfer does not succeed.
- The ``paymen()`` function processes a list of transfers to settle the transactions in an _ExchangeBox_.
- If any of the recipients of an ETH transfer is a smart contract that reverts, then the entire payout will fail and will be unrecoverable.
    1. Recommendation:
	    1) Implement a queuing mechanism to allow buyers/sellers to initiate the withdrawal on their own using a ‘pull-over-push pattern.’
	    2) Ignore a failed transfer and leave the responsibility up to users to receive them properly.
    2. Critical severity finding from [Consensys Diligence Audit of Lien Protocol](https://consensys.net/diligence/audits/2020/05/lien-protocol/#a-reverting-fallback-function-will-lock-up-all-payouts)

#### 26. Saferagequit makes you lose funds:
- ``safeRagequit`` and ``ragequit`` functions are used for withdrawing funds from the LAO.
- The difference between them is that ``ragequit`` function tries to withdraw all the allowed tokens and ``safeRagequit`` function withdraws only some subset of these tokens, defined by the user.
- It’s needed in case the user or ``GuildBank`` is blacklisted in some of the tokens and the transfer reverts.
- The problem is that even though you can quit in that case, you’ll lose the tokens that you exclude from the list.
- To be precise, the tokens are not completely lost, they will belong to the LAO and can still potentially be transferred to the user who quit. But that requires a lot of trust, coordination, time and anyone can steal some part of these tokens.
    1. Recommendation: Implementing pull pattern for token withdrawals should solve the issue. Users will be able to quit the LAO and burn their shares but still keep their tokens in the LAO’s contract for some time if they can’t withdraw them right now.
    2. Critical severity finding from [Consensys Diligence Audit of The Lao](https://consensys.net/diligence/audits/2020/01/the-lao)

#### 27. Creating proposal is not trustless:
- Usually, if someone submits a proposal and transfers some amount of tribute tokens, these tokens are transferred back if the proposal is rejected.
- But if the proposal is not processed before the emergency processing, these tokens will not be transferred back to the proposer.
- This might happen if a tribute token or a deposit token transfers are blocked.
- Tokens are not completely lost in that case, they now belong to the LAO shareholders and they might try to return that money back.
- But that requires a lot of coordination and time and everyone who ragequits during that time will take a part of that tokens with them.
    1. Recommendation: Pull pattern for token transfers would solve the issue
    2. Critical severity finding from [Consensys Diligence Audit of The Lao](https://consensys.net/diligence/audits/2020/01/the-lao)

#### 28. Emergency processing can be blocked
- The main reason for the emergency processing mechanism is that there is a chance that some token transfers might be blocked.
- For example, a sender or a receiver is in the USDC blacklist.
- Emergency processing saves from this problem by not transferring tribute token back to the user (if there is some) and rejecting the proposal.
- The problem is that there is still a deposit transfer back to the sponsor and it could be potentially blocked too. If that happens, proposal can’t be processed and the LAO is blocked.
    1. Recommendation: Pull pattern for token transfers would solve the issue
    2. Critical severity finding from [Consensys Diligence Audit of The Lao](https://consensys.net/diligence/audits/2020/01/the-lao)

#### 29. Token Overflow might result in system halt or loss of funds
- If a token overflows, some functionality such as _processProposal_, _cancelProposal_ will break due to SafeMath reverts.
- The overflow could happen because the supply of the token was artificially inflated to oblivion.
    1. Recommendation: We recommend to allow overflow for broken or malicious tokens. This is to prevent system halt or loss of funds. It should be noted that in case an overflow occurs, the balance of the token will be incorrect for all token holders in the system
    2. Major severity finding from [Consensys Diligence Audit of The Lao](https://consensys.net/diligence/audits/2020/01/the-lao)

#### 30. Whitelisted tokens limit:
- ``ragequit`` function is iterating over all whitelisted tokens.
- If the number of tokens is too big, a transaction can run out of gas and all funds will be blocked forever.
    1. Recommendation: A simple solution would be just limiting the number of whitelisted tokens. If the intention is to invest in many new tokens over time, and it’s not an option to limit the number of whitelisted tokens, it’s possible to add a function that removes tokens from the whitelist. For example, it’s possible to add a new type of proposal that is used to vote on token removal if the balance of this token is zero. Before voting for that, shareholders should sell all the balance of that token.
    2. Major severity finding from [Consensys Diligence Audit of The Lao](https://consensys.net/diligence/audits/2020/01/the-lao)

#### 31. **Summoner can steal funds using bailout**
- The _bailout_ function allows anyone to transfer kicked user’s funds to the summoner if the user does not call ``safeRagequit`` (which forces the user to lose some funds).
	- The intention is for the summoner to transfer these funds to the kicked member afterwards.
	- The issue here is that it requires a lot of trust to the summoner on the one hand, and requires more time to kick the member out of the LAO.
    1. Recommendation: By implementing pull pattern for token transfers, kicked member won’t be able to block the ragekick and the LAO members would be able to kick anyone much quicker. There is no need to keep the _bailout_ function.
    2. Major severity finding from [Consensys Diligence Audit of The Lao](https://consensys.net/diligence/audits/2020/01/the-lao)

#### 32. Sponsorship front-running
- If proposal submission and sponsorship are done in 2 different transactions, it’s possible to front-run the _sponsorProposal_ function by any member.
- The incentive to do that is to be able to block the proposal afterwards.
    1. Recommendation: Pull pattern for token transfers will solve the issue. Front-running will still be possible but it doesn’t affect anything.
    2. Major severity finding from [Consensys Diligence Audit of The Lao](https://consensys.net/diligence/audits/2020/01/the-lao)

#### 33. Delegate assignment front-running
- Any member can front-run another member’s _delegateKey_ assignment.
	- If you try to submit an address as your _delegateKey_, someone else can try to assign your delegate address to themselves.
	- While incentive of this action is unclear, it’s possible to block some address from being a delegate forever.
    1. Recommendation: Make it possible for a _delegateKey_ to approve _delegateKey_ assignment or cancel the current delegation. Commit-reveal methods can also be used to mitigate this attack.
    2. Medium severity finding from [Consensys Diligence Audit of The Lao](https://consensys.net/diligence/audits/2020/01/the-lao)

#### 34. Queued transactions cannot be canceled
- The Governor contract contains special functions to set it as the admin of the _Timelock_.
	- Only the admin can call _Timelock.cancelTransaction_.
	- There are no functions in Governor that call _Timelock.cancelTransaction_.
	- This makes it impossible for _Timelock.cancelTransaction_ to ever be called.
    1. Recommendation: Short term, add a function to the Governor that calls _Timelock.cancelTransaction_. It is unclear who should be able to call it, and what other restrictions there should be around cancelling a transaction. Long term, consider letting Governor inherit from _Timelock_. This would allow a lot of functions and code to be removed and significantly lower the complexity of these two contracts.
    2. High Risk severity finding from [ToB’s Audit of Origin Dollar](https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf)

#### 35. Proposal transactions can be executed separately and block Proposal.execute call
- Missing access controls in the _Timelock.executeTransaction_ function allow Proposal transactions to be executed separately, circumventing the _Governor.execute_ function.
    1. Recommendation: Short term, only allow the admin to call _Timelock.executeTransaction_
    2. High Risk severity finding from [ToB’s Audit of Origin Dollar](https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf)

#### 36. Proposals could allow ``Timelock.admin`` takeover
- The Governor contract contains special functions to let the guardian queue a transaction to change the _Timelock.admin_.
- However, a regular Proposal is also allowed to contain a transaction to change the _Timelock.admin_. This poses an unnecessary risk in that an attacker could create a Proposal to change the _Timelock.admin_.
    1. Recommendation: Short term, add a check that prevents _setPendingAdmin_ to be included in a Proposal
    2. High Risk severity finding from [ToB’s Audit of Origin Dollar](https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf)

#### 37. Reentrancy and untrusted contract call in mintMultiple
- Missing checks and no reentrancy prevention allow untrusted contracts to be called from _mintMultiple_.
- This could be used by an attacker to drain the contracts.
    1. Recommendation: Short term, add checks that cause _mintMultiple_ to revert if the amount is zero or the asset is not supported. Add a reentrancy guard to the _mint_, _mintMultiple_, _redeem_, and _redeemAll_ functions. Long term, make use of Slither which will flag the reentrancy. Or even better, use Crytic and incorporate static analysis checks into your CI/CD pipeline. Add reentrancy guards to all non-view functions callable by anyone. Make sure to always revert a transaction if an input is incorrect. Disallow calling untrusted contracts.
    2. High Risk severity finding from [ToB’s Audit of Origin Dollar](https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf)

#### 38. Lack of return value checks can lead to unexpected results
- Several function calls do not check the return value.
- Without a return value check, the code is error-prone, which may lead to unexpected results.
    1. Recommendation: Short term, check the return value of all calls mentioned above. Long term, subscribe to Crytic.io to catch missing return checks. Crytic identifies this bug type automatically.
    2. High Risk severity finding from [ToB’s Audit of Origin Dollar](https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf)

#### 39. External calls in loop can lead to denial of service
- Several function calls are made in unbounded loops.
- This pattern is error-prone as it can trap the contracts due to the gas limitations or failed transactions.
    1. Recommendation: Short term, review all the loops mentioned above and either: 1) allow iteration over part of the loop, or 2) remove elements. Long term, subscribe to Crytic.io to review external calls in loops. Crytic catches bugs of this type.
    2. High Risk severity finding from [ToB’s Audit of Origin Dollar](https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf)

#### 40. OUSD allows users to transfer more tokens than expected
- Under certain circumstances, the OUSD contract allows users to transfer more tokens than the ones they have in their balance.
- This issue seems to be caused by a rounding issue when the _creditsDeducted_ is calculated and subtracted.
    1. Recommendation: Short term, make sure the balance is correctly checked before performing all the arithmetic operations. This will make sure it does not allow to transfer more than expected. Long term, use Echidna to write properties that ensure ERC20 transfers are transferring the expected amount.
    2. High Risk severity finding from [ToB’s Audit of Origin Dollar](https://github.com/trailofbits/publications/blob/master/reviews/OriginDollar.pdf)