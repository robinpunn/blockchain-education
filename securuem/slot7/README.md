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