### [Race 14](https://ventral.digital/posts/2023/1/30/race-14-of-the-secureum-bootcamp-epoch-infinity)

---

##### Q1 Lending platforms have a few options to configure when it comes to adding new tokens as collateral. For example, you’ll have to set up an oracle for the price of the collateral, and you have to configure a margin requirement. The security concern with using the given collateral configuration is:
- [ ] A) The periodic fee parameter is static 
- [ ] B) The collateral ratio of loans is too low 
- [ ] C) USDC should not be used as collateral for loans 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B
<p>
It's unknown whether the _periodicFee_ paramter is static or not from the given code, but either way it wouldn't be a security issue.<br>
While it might seem okay to keep collateralisation of a stable coin at 100% it has a problem: The user can borrow at a price determined by an oracle without slippage. A smart arbitrageur would, after every trade on every other AMM, go in and trade until the price of the AMM is the same as the price reported by the oracle used by this lending platform. It would even be possible to sandwich oracle updates for profit. It's also risky to maintain collateralisation of positions.<br>
There's no general reason to not use USDC as collateral.
</p>
</details> 

##### Q2 Assuming payFees() is periodically called by a function, which iteratively calls payFees() of all collateral contracts, the security concern(s) is/are
- [ ] A) Collateral tokens can define their own fee rewards and have the protocol pay too much fees 
- [ ] B) There could be many lenders 
- [ ] C) payFees() might re-enter the contract, paying all fees again 
- [ ] D) You can deposit at any point during the period
<details>
<summary>Answer</summary>
B,D
<p>
The collateral contracts are deployed via the lending platform which is assumed to be correctly implemented. Under this assumption it wouldn't be possible for one of them to be malicious in terms of reward distribution.<br>
There could be so many lenders to iterate that the gas necessary for the function to complete is too large preventing the function to be called, effectively causing a Denial of Service.<br>
The token in question is USDC, an ERC20 token that does not have hooks allowing a receiver to reenter the function. A good recommendation would be the use of safeTransferFrom(), but it's not necessarily required.<br>
Nothing prevents someone to game the reward system by sandwiching the payFees() call with a large deposit() and withdrawal(). The current reward system does not incentivice that depositors keep their money in the system for a long time.
</p>
</details> 

##### Q3 The developers want to prevent people from accidentally sending ETH instead of WETH and have implemented a noETH modifier, as defined above, and annotated the deposit function with it. They have also not implemented a receive function. Which of the following statements is true?
- [ ] A) Developers can either use the modifier or achieve the same effect by omitting the payable keyword on deposit function 
- [ ] B) Developers should use the modifier because it achieves a different effect from omitting the payable keyword on deposit function 
- [ ] C) Developers should remove the modifier but achieve the required effect by omitting the payable keyword on deposit function 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
C
<p>
Omitting the payable keyword does not have the same effect. The modifier checks the contract's current balance while the payable keyword checks the actual ether that was sent with the message (_msg.value_).<br>
The developers should NOT use the modifier because of this difference since it will lead to Denial of Service once the contract's balance becomes non-zero (it's possible forcefully injecting ether into a contract, eg. via _SELFDESTRUCT_).
</p>
</details> 

##### Q4 Developers have used assembly to make their code a bit less repetitive. They use it to annotate a bunch of functions that have as their last argument a pool address. Unfortunately they made a mistake. Which of the following options fixes the bug?
- [ ] A) Replace the modifier with require(isValid(pool)); in every function with the modifier 
- [ ] B) Make all functions using checkedPool external 
- [ ] C) Everything is fine; this code has no problems 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A
<p>
Dropping the modifier in favor of a single _require()_ fixes the issue and even improves code readability to what was attempted here with assembly. If the developers insist on the use of modifiers they should pass the pool value directly as an argument to it instead: _checkedPool(pool)_.<br>
Making all of the function external (therefore preventing them to be called internally) would certainly increase the likelyhood that the assembly snippet will pick up the correct value. But there's still no guarantee that the last 32 bytes of the calldata are always the pool argument. A caller can send more data than defined in the function's signature and the ABI decoding would work just fine while ignoring the extra data. But the modifier would load the extra data instead of the pool value. This would potentially allow to bypass the pool validation and allow for exploitation.<br>
As mentioned, the code snippet is certainly not fine. It attempts loading the pool parameter from the calldata and assumes that it would always be located in the last 32 bytes - there's no guarantee for that being the case.
</p>
</details> 

##### Q5 The lending protocol has also built in a liquidation function to be called in the case of under-collateralization. Anyone can call the function and be rewarded for calling it by taking a small percentage of the liquidation. The liquidation function has a vulnerability which can be exploited because
- [ ] A) The lender can open a position with a low amount of collateral and the fee payout reverts 
- [ ] B) The lender can make the position “unliquidatable” with reentrancy 
- [ ] C) The lender can liquidate other positions with his callback and make more money 
- [ ] D) The liquidator can take the full collateral amount with reentrancy
<details>
<summary>Answer</summary>
B
<p>
At first the code might look like the checks-effects-interactions pattern is followed (ie. no harmful reentrancy is possible) but there's actually another check happening when the _Liquidation_ event is emitted: If the current _balance_ is suddenly larger than the _oldDeposit_. Since the lender is _call_ed before this check happens, they could reenter via the _deposit()_ function and increase the _balance_ causing the liquidation to fail (ie. potentially making the position “unliquidatable”).<br>
Aside from answer B, the other options are mostly nonsensical decoys.
</p>
</details> 

##### Q6 Assume that the vulnerability referenced in the previous question has been fixed by changing the line with the Liquidation event emission to emit Liquidation(lender, oldDeposit). The protocol team has built a bot that monitors and liquidates under-collateralized positions automatically. Even though the bot does not monitor the mempool, it simulates the full transaction and, if successful, sends transactions with the exact amount to be able to execute the function + 100000 gas for minimal execution in the onLiquidation() callback. Which of these attacks can be executed in a harmful way towards the protocol?
- [ ] A) An attacker can liquidate positions, reenter the contract and steal tokens 
- [ ] B) The liquidated lender can monitor the mempool and frontrun the protocol bot with a deposit, griefing it 
- [ ] C) The lender can make their position “unliquidatable” by consuming all the gas provided in the callback 
- [ ] D) The liquidated lender can tokenize the extra gas in the callback and make a profit
<details>
<summary>Answer</summary>
B
<p>
First option is nonsensical.<br>
Although the revert via reentrancy in the _deposit()_ function has been fixed, it's still possible that the bot is simply frontrun by a lender who increases their collateral via _deposit()_ just in time to make the bot's liquidation attempt fail.<br>
A liquidated lender could, when called, only use up all of the gas it was given via the _CALL_, which is 63/64 of the total gas. With a sufficiently high gas limit it is still possible to liquidate the lender.<br>
Gas tokenization is no longer viable since EIP-3529 has reduced refunds.
</p>
</details> 

##### Q7 In the context of Questions 5 and 6, someone built a MEV frontrunner bot that is exploiting liquidations in different protocols. It monitors the mempool for collateral contracts deployed from the lending factory and simulates transactions in a mainnet fork within Foundry to check whether it should attack them. The logic behind the bot is that it checks only the token’s “Transfer” events for its success conditions. More precisely, it checks if there is liquidity in an AMM to exchange to ETH and make sure it turns a profit at the end. If so, it sends a Flashbot bundle to make a profit by frontrunning the liquidator. Knowing the factory for this new contract is permissionless, how could you extract assets out of this bot?
- [ ] A) Open a position with a low collateral amount to grief the bot 
- [ ] B) Build a similar bot that frontruns this one 
- [ ] C) Deploy a collateral contract with your own custom token and seed an AMM pool with some ETH and this token, tricking the bot 
- [ ] D) There is no way to do it
<details>
<summary>Answer</summary>
C
<p>
Griefing the bot would not extract assets from it.<br>
Option C actually happened on mainnet and was labelled ["Salmonella Attack"](https://github.com/Defi-Cartel/salmonella)<br>
Since it's using Flashbot Bundles, frontrunning it should not be possible since the transaction would be private.
</p>
</details> 

##### Q8 The protocol implemented a function to transfer collateral from lender A to lender B with a signature from A, as shown above. Is there a way you can break it?
- [ ] A) Lender B can get more than the intended amount from lender A (assuming there is more than double the amount in A’s account) 
- [ ] B) Lender A can pretend to transfer to lender B but then steal amount from him 
- [ ] C) Lender A can grief lender B by sending a malformed signature (assuming the S parameter is correct) 
- [ ] D) Lender B can steal from another lender C, by submitting a malformed signature.
<details>
<summary>Answer</summary>
A
<p>
There's nothing preventing the same signature to be re-used over and over again. So as long as the _signer_ has a balance higher than the signed _amount_, the _receiver_ can transfer their collateral.<br>
Even if the code would keep track of the signatures that were already used once, the code would still be exploitable via signature malleability. A correct way to fix it would be to track a nonce for each _signer_.<br>
A malformed signature would cause _ecrecover_ to return a zero-address, but is prevented since the return value must be equal to the _signer_ who may not be the zero-address.
</p>
</details> 