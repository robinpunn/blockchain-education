### [Race 27](https://ventral.digital/posts/2024/3/4/race-27-of-the-secureum-bootcamp-epoch-infinity/)

#### Q1 
> Functions depositing and withdrawing from the Gauge:
- [ ]  A. Should use a reentrancy guard
- [ ]  B. Should have a `minOut` parameter
- [ ]  C. Should verify that we have sufficient balance before making the call
- [ ]  D. Are perfectly safe because it's an official Curve gauge

<details>
<summary>Answer</summary>
D
<p>
A: The `invest()` and `divest()` functions, which are the only ones depositing or withdrawing from the gauge, are already using a reentrancy guard thanks to the `nonReentrant` modifier. This option implies that such a guard was missing, which is incorrect and makes this option false.
</p>
<p>
B: The `divest()` function already has such a parameter, for the `invest()` function its called `minMint` instead. Again both already have it, while the option implies that its missing. It can furthermore be noted that gauge contracts have no slippage, so these parameters aren't actually related to the fact that the gauge is being called.
</p>
<p>
C: Since the gauge does not want to get scammed, it'll check whether we have sufficient balance for us and there's no need to check this before making the call. If we had insufficient balance it would revert.
</p>
<p>
D: The gauge used is hardcoded and is indeed an official Curve gauge which will behave as expected by this code
</p>
</details>

#### Q2
> The function `shouldDivest`:
- [ ]  A. Can never return `true` as the `investedBalance` function will not revert
- [ ]  B. Can revert because `this` may be `selfdestructed` when we `delegatecall` to a `proxy`
- [ ]  C. Can never return `true` because the catch clause doesn't catch `Bytes Error`
- [ ]  D. None of the above

<details>
<summary>Answer</summary>
D
<p>
A: The `investedBalance()` function will revert when the `uint256` value returned by `balanceInPool()` is too large to fit into `uint128` when multiplied in `bal_1 * PRECISION * balanceInPool()`. This is because the expression is casted to `uint128` because of `bal_1`, the fact that it is back-cast to `uint256` in the end does not matter.
</p>
<p>
B: Random gibberish option.
</p>
<p>
C: The `} catch {` will catch all errors, even if it is some "`Bytes Error`", because it's not specifying anything specific that it is trying to catch.
</p>
</details>

#### Q3
> The owner can:
- [ ]  A. Steal all funds by withdrawing them to a malicious strategy
- [ ]  B. Lose their private key
- [ ]  C. Be impersonated due to Multicall and Meta Transactions support
- [ ]  D. Set only one strategy per `reward` and `want` combination

<details>
<summary>Answer</summary>
A,B,C
<p>
A: The owner is capable of arbitrarily adding new strategies, and using `invest()` and `divest()` to move funds between them. A malicious owner could indeed simply add a strategy that allows stealing all of the funds after moving them there.
</p>
<p>
B: Protocol owners can indeed lose their private key, a simple and true statement. Sadly it happens all the time, or is used to cover up a rug pull. Since this is off-chain operational security, it's hard to tell and often not much thought is put into preventing it.
</p>
<p>
C: Account Impersonation is indeed possible through combining ERC-2771 and Multicall with the used version of OpenZeppelin which does not contain the appropriate fix yet. If you're unfamiliar with this bug, take a look at the detailed [write-up about it(opens in a new tab)](https://ventral.digital/posts/2024/1/19/ethereum-smart-contract-auditors-2023-rewind/#erc-2771--multicall--account-impersonation) in the Ethereum Smart Contract Auditor's 2023 Rewind.
</p>
<p>
D: While there's code that prevents adding the same swap route in `allowedSwap`, this check is directional. Even if `[reward][want]` has already been set, there's always a second combination involving both of these values that is still allowed (basically `[want][reward]`).
</p>
</details>

#### Q4
> The System is:
- [ ]  A. Using a swapper to allow custom swaps in the future
- [ ]  B. A Template system for generating NFTs
- [ ]  C. Using a Controller and a Strategy where the Controller can work with only one strategy
- [ ]  D. None of the above

<details>
<summary>Answer</summary>
A
<p>
A: It indeed appears to be using a "swapper".
</p>
<p>
B: Just random gibberish again.
</p>
<p>
C: The controller appears to work with many Strategies.
</p>
</details>

#### Q5
> The Strategy:
- [ ]  A. Cannot be forced to invest and divest due to ownership checks in the `Controller`
- [ ]  B. Can be made to lose all of its rewards by claiming on behalf of the strategy
- [ ]  C. Can be made to lose all of its rewards because the reward token is Fee-on-Transfer
- [ ]  D. Can send tokens to the wrong address

<details>
<summary>Answer</summary>
A,B
<p>
A: These operations are indeed permissioned by an ownership check.
</p>
<p>
B: Is true when exploiting a gauge <a href="https://github.com/code-423n4/2023-07-tapioca-findings/issues/1429" target="_blank">loss-of-yield attack</a>
</p>
<p>
C/D: More gibberish.
</p>
</details>

#### Q6
> Harvest for the Strategy:
- [ ]  A. Will claim reward tokens and send them to the Controller
- [ ]  B. Doesn't use `safeTransfer` and so it will revert
- [ ]  C. `transfer` will not revert because the reward token is known
- [ ]  D. Can overflow via a donation during gauge execution that requires no changes in the external contracts

<details>
<summary>Answer</summary>
A,C
<p>
A: That's indeed what the code appears to do.
</p>
<p>
B/C: The token we're calling `transfer()` on is a hardcoded Curve token that is known to work as expected by this code. A `safeTransfer` wrapper would only be necessary if it's unknown how the used token handles errors.
</p>
<p>
D: You guessed it, gibberish it is.
</p>
</details>

#### Q7
> The mapping `lastSafeBalanceOfWant[strategy]`:
- [ ]  A. Is always zero
- [ ]  B. Should be zero if no direct donation has happened
- [ ]  C. Will track the balance of `want` of the controller
- [ ]  D. Will prevent sweep exploits in invest

<details>
<summary>Answer</summary>
B
<p>
As you can tell from the code comment, the way that `lastSafeBalanceOfWant[strategy]` is currently used is incorrect and should be swapped.
</p>
<p>
A/B: Although it is most likely to be zero indeed, it can't be said that it's always zero because there's the possibility that a "direct donation" (ie. a injection of funds) happened.
</p>
<p>
C: It's not tracking as intended since setting the mapping's value and checking it are swapped.
</p>
<p>
D: Incorrect, this offers no protection.
</p>
</details>

#### Q8
> The function `invest`:
- [ ]  A. Allows the owner to deposit want, convert it into Tricrypto LP and stake in the gauge
- [ ]  B. Allows an attacker to deposit in the wrong strategy
- [ ]  C. Allows an attacker to cause loss of value because `lastSafeBalanceOfWant[strategy]` is ineffective
- [ ]  D. None of the above

<details>
<summary>Answer</summary>
A,B,C
<p>
A: That's factually what it does. You can see that it's indeed "Tricrypto LP" by checking the gauge's token tracker in <a href="https://arbiscan.io/address/0x555766f3da968ecBefa690Ffd49A2Ac02f47aa5f" target="_blank">arbiscan</a>.
</p>
<p>
B/C: Both are possible thanks to the ERC-2771 + Multicall bug mentioned in Question 3
</p>
</details>