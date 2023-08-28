### [Race 17](https://ventral.digital/posts/2023/5/1/race-17-of-the-secureum-bootcamp-epoch-infinity)

##### Q1 deposit() can revert
- [ ] A) If insufficient ETH was sent with the call 
- [ ] B) If the caller has insufficient WETH balance 
- [ ] C) With the "cap exceeded" error 
- [ ] D) If called internally
<details>
<summary>Answer</summary>
A,B
<p>
A: If the ether (_msg.value_ > 0) provided with the call to _deposit()_ is less than the specified _amount_, the attempt to call _WETH.deposit()_ may revert.<br>
B: If no ether was provided with the call and the caller has an insufficient balance of WETH, or given insufficient approval to their WETH balance, the attempt to call _WETH.transferFrom()_ will revert.<br>
C: For the "cap exceeded" error to be thrown, `totalContributions + amount > TOTAL_CONTRIBUTION_CAP`. But `TOTAL_CONTRIBUTION_CAP = type(uint72).max` and _totalContributions_ is _uint72_. So the attempt to add an _amount_ to _totalContributions_ that would make it larger than _type(uint72).max_ would revert from an integer overflow error before the _require()_ ever could. This makes the _require()_ basically redundant and it can be removed.<br>
D: The _deposit()_ function is a external. An attempt to call it internally would not revert but never compile in the first place. The contract could still call this function via _this.deposit()_ though, which would make the contract CALL itself like it would an external contract.
</p>
</details> 
##### Q2 What issues pertain to the `deposit()` function?
- [ ] A) Funds can be drained through re-entrancy 
- [ ] B) Accounting mismatch if user specifies `amount` > `msg.value` 
- [ ] C) Accounting mismatch if user specifies `amount` < `msg.value` 
- [ ] D) `totalContributionCap` isn't enforced on an individual level
<details>
<summary>Answer</summary>
C
<p>
A: For a re-entrancy an unsafe external call needs to be made. All the external calls being made within the `deposit()` are to the trusted WETH contract which does also not have any sender callbacks/hooks like an ERC777 would have.<br>
B/C: If the specified _amount_ was larger than the sent _msg.value_, the function would revert. But on the other hand, if the _amount_ was smaller than the actual sent _msg.value_ the deposit would only handle the _amount_ and the rest of the ether would be left in the _Vault_ contract (allowing someone else to pick it up on another deposit).<br>
D: The fact that _totalContributionCap_ isn't enforced on an individual level does not cause an issue as _totalContributions_'s value would revert before any individual contributor would be able to make deposits beyond the cap.
</p>
</details> 
##### Q3 Which of the following is/are true about `withdraw()`?
- [ ] A) Funds can be drained through re-entrancy 
- [ ] B) Funds can be drained due to improper amount accounting in `deposit()` 
- [ ] C) Assuming a sufficiently high gas limit, the function reverts from the recipient (caller) consuming all forwarded gas 
- [ ] D) May revert with "failed to transfer ETH"
<details>
<summary>Answer</summary>
D
<p>
A: The _withdraw()_ function follows the Checks-Effects-Interactions pattern: (Check) Subtracting the amount from the individual's contribution would revert if the integer were to underflow. (Effect) The individual contributor's balance is updated before the value is transferred. (Interactions) The unsafe external call to the _msg.sender_ is only made once all Checks and Effects have been applied. Re-entering the contract would not allow draining any funds.<br>
B: It's true that there's improper accounting, but the effect is that funds that were left over from a _deposit()_ can be recovered/stolen by another depositor and then withdrawn. This does not allow to drain the Vault of any funds that have been properly accounted for though.<br>
C: As only 63/64 gas is forwarded, the function should have sufficient gas remaining for execution (hence the high gas limit assumption).<br>
D: True, if msg.sender reverts (eg. is a contract that lacks payable / fallback function).
</p>
</details> 
##### Q4 Which of the following parameters are correctly emitted in the `ContributorsUpdated()` event?
- [ ] A)`newContributor` 
- [ ] B) `oldNumContributors` 
- [ ] C) `newNumContributors` 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A
<p>
A: Option A is understandably ambiguous: if withdrawals were working, then you could have an existing contributor be recognized as a new one. Nevertheless, in its current state, we can take it to emit for only legitimately new contributors.<br>
B: Generally, it's not save to make assumptions about the evaluation order of expressions in Solidity. How obscure this can be especially for event emissions has been shown in [last year's Underhanded Solidity contest](https://github.com/ethereum/solidity-underhanded-contest/blob/master/2022/submissions_2022/submission9_TynanRichards/SPOILERS.md): "The indexed parameters are evaluated first in right-to-left order, then the non-indexed parameters are evaluated left-to-right". Because of this, the general best practice is to avoid nested expressions whenever possible and do them within separate lines of code.<br>
C: One of the most common gas optimizations seen in Code4rena reports is how the prefix increment (++i) is more efficient than postfix (i++). However, most aren't aware of a key difference: Prefix increments returns the value AFTER the increment, postfix returns the value BEFORE.
</p>
</details> 
##### Q5 The vault deployer can pause the following functions:
- [ ] A) `deposit()` 
- [ ] B) `withdraw()` 
- [ ] C) `requestAllowance()` 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
D
<p>
The contract can't be paused because the pause and unpause functionality aren't exposed.<br>
Author notes: Sort of a trick question that requires knowledge about the Pausable contract. As mentioned in the Spearbit community workshop I gave recently, it can be difficult to spot what's absent, not just what's present.
</p>
</details> 
##### Q6 What is the largest possible allowance given to the controller?
- [ ] A) 40% of `totalContributionCap` 
- [ ] B) 60% of `totalContributionCap` 
- [ ] C) 100% of `totalContributionCap` 
- [ ] D) Unbounded
<details>
<summary>Answer</summary>
C
<p>
The allowance is only capped as long as the specified _amount_ is larger the current _totalContributions_. That means as soon as the _totalContributions_ are larger than _ALLOWANCE_CAP_, it's possible to give an allowance of 100%.
</p>
</details> 
##### Q7 The `requestAllowance()` implementation would have failed after the 1st call for tokens that only allow zero to non-zero allowances. Which of the following mitigations do NOT work?
- [ ] A) `safeApprove(0)` followed by `safeApprove(type(uint256).max)` 
- [ ] B) `safeIncreaseAllowance(type(uint256).max)` 
- [ ] C) `safeIncreaseAllowance(0)` followed by `safeIncreaseAllowance(type(uint256).max)` 
- [ ] D) `safeDecreaseAllowance(0)` followed by `safeApprove(type(uint256).max)`
<details>
<summary>Answer</summary>
B,C,D
<p>
There are some implementations of ERC20 tokens that require an approval to be reset to 0 before it can be updated to another non-zero value.<br>
The _safeIncreaseAllowance()_ / _safeDecreaseAllowance()_ functions request the current allowance, adding/subtracting the specified amount and then update it by calling _approve()_. These functions do not set the approval to 0 in between, so for these tokens the function would still fail after the 1st call.
</p>
</details> 
##### Q8 Which of the following gas optimizations are relevant in reducing runtime gas costs for the vault contract?
- [ ] A) Changing `ALLOWANCE_CAP` type from immutable to constant, ie. `uint256 public constant ALLOWANCE_CAP = 40 * uint256(TOTAL_CONTRIBUTION_CAP) / 100;` 
- [ ] B) Increase number of solc runs (assuming default was 200 runs) 
- [ ] C) Renaming functions so that the most used functions have smaller method IDs 
- [ ] D) Use `unchecked` math in `withdraw()`
<details>
<summary>Answer</summary>
B,C
<p>
A: Changing _ALLOWANCE_CAP_ to be _constant_ would actually consume more runtime gas as the expression would then be evaluated on every call, while with _immutable_ the expression would be calculated during deployment and then become a static value. (Note that there's no difference between these options anymore when the via-IR compilation pipeline and optimization is used).<br>
B: Increasing the optimizer's _runs_ configuration will increase the deployment bytecode size but decrease the gas usage at runtime.<br>
C: (The smaller the function's ID the earlier it can be found by the function selector.) – In hindsight, this is not entirely true: Including the public variable getters, the Vault contract has 9 function signatures exposed. For contracts with more than 4 function IDs the Solidity compiler starts using a [binary search algorithm](https://github.com/0xArcturus/binarysearch/) instead of using a sorted-if-then selector. So in the case of the Vault contract, there's no guarantee that renaming the functions in the described manner would actually ensure reduced runtime costs for all of the most used functions. It's still true that the function with the lowest ID will have the shortest path (one pivot, on EQ), but the same is not guaranteed for the other functions.<br>
D: It wouldn't be safe to use unchecked math in the _withdraw()_ function as it would potentially allow users to withdraw more than they should be able to. (The wording is intended to imply that the entire function's body would be put into an unchecked block.)
</p>
</details> 