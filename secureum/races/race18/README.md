### [Race 18](https://ventral.digital/posts/2023/5/29/race-18-of-the-secureum-bootcamp-epoch-infinity)

---

##### Q1 What risk(s) should be considered when reviewing this contract?
- [ ] A) Reentrancy risks 
- [ ] B) Logic bugs 
- [ ] C) Front-running risks 
- [ ] D) Arithmetic risks 
<details>
<summary>Answer</summary>
A,B,C,D
<p>
During an audit all risks should be _considered_! (Duh)<br>
This question wasn't about what _issues_ the contract actually has, but these specific issues will be asked about later in this quiz.
</p>
</details> 

##### Q2 Which of the following statement(s) is/are true?
- [ ] A) No overflow can ever occur in a contract compiled with solc version 0.8 
- [ ] B) `IERC20.decimals returns(uint256)` is not a correct ERC20 function according to the ERC20 specification 
- [ ] C) The contract does not follow Natspec for all the documentation 
- [ ] D) None of the above 
<details>
<summary>Answer</summary>
B,C
<p>
A: With Solidity version 0.8, overflows (eg. from addition or multiplication) can still happen within _unsafe_ blocks.<br>
B: According to the ERC20 specification, the _decimals()_ function should return _uint8_.<br>
C: It's not followed everywhere, eg.: The _mint()_ function's _@param_ is not following Natspec because it's missing one slash.
</p>
</details> 

##### Q3 Which of the following is an/are invariant(s) that should hold true? (assuming no bug)
- [ ] A) The contract's ether balance must be strictly equal to the sum of all the balances (in the `balances` mapping) 
- [ ] B) For any user, `minted[user] <= balances[user] * 10` 
- [ ] C) For any user, `token.balanceOf(user) == balances[user]` 
- [ ] D) None of the above 
<details>
<summary>Answer</summary>
B
<p>
A: Strict equality with a contract's ether balance is an invariant that would be broken by an injection of ether value into the contract (eg. via _SELFDESTRUCT_)<br>
B: This one will hold. A user is able to mint 10 times as many tokens as their ether balance. But they might have a larger balance than actually minted tokens. And most importantly, they should never have more minted token than what they have locked.<br>
C: A user could transfer their token balance breaking the invariant.
</p>
</details> 

##### Q4 Which of the following sentence(s) is/are true regarding `getBalances`?
- [ ] A) `getBalances(msg.sender)` returns the sender's balance 
- [ ] B) `getBalances` reverts if the user's balance is zero 
- [ ] C) `getBalances` always returns zero 
- [ ] D) None of the above 
<details>
<summary>Answer</summary>
C
<p>
While the function never reverts, it doesn't actually return the sender's balance. That's because the _balance_ return variable is shadowed within the function's body (ie. a new variable with the same name is declared and used instead of the correct one). As the default value of unused variables is always zero-like the number returned by this function will always be 0 too.
</p>
</details> 

##### Q5 Which of the following sentence(s) is/are true regarding the `balances` mapping?
- [ ] A) An attacker can increase their `balances` (theft) from `balances[victim]` 
- [ ] B) An attacker can reset `balances[victim]` 
- [ ] C) An attacker can increase their `balances` to any amount 
- [ ] D) An attacker cannot compromise the `balances` mapping 
<details>
<summary>Answer</summary>
B
<p>
There are no vectors for A and C.<br>
But the _depositTo()_ function is mistakenly using _=_ instead of _=+_, therefore resetting the destination's balance. Attacker's can use this to set the _balances[victim]_ to arbitrary values, most likely very small ones.
</p>
</details> 

##### Q6 Which of the following sentence(s) is/are true regarding reentrancies in this contract?
- [ ] A) `nonReentrant` protects the contract from reentrancies 
- [ ] B) A correct reentrancy protection modifier is not needed if `withdraw` is refactored to follow the CEI pattern 
- [ ] C) There are no reentrancy risks 
- [ ] D) None of the above 
<details>
<summary>Answer</summary>
B
<p>
A: The _nonReentrant_ modifier is not correctly implemented and won't protect the contract from reentrancies. (Its require should check for strict equality)<br>
B: That's correct, following the CEI pattern would mean updating the user's balance before calling the _msg.sender_, making reentering the contract pointless.<br>
C: The _withdraw_ function does not follow the CEI pattern at this moment and the reentrancy-guard is broken, therefore there is a reentrancy risk.
</p>
</details> 

##### Q7 The `mint` function has the following risks (assuming there are no bugs in the other functions)
- [ ] A) The user can generate tokens without having locked ether 
- [ ] B) An attacker can front-run a call to `mint` and make it revert 
- [ ] C) `minted[msg.sender] = amount * decimals_factor;` should be replaced by `minted[msg.sender] = amount / decimals_factor;` 
- [ ] D) None of the above 
<details>
<summary>Answer</summary>
A
<p>
A: Is possible by exploiting a loss of precision error due to division-before-multiplication in __has_enough_balance()_. This effectively allows minting up to 9 tokens without locking any ether.<br>
B: There's nothing that a frontrunner could do to make a call to _mint_ revert.<br>
C: That change would not make sense.
</p>
</details> 

##### Q8 The `burn` and `_has_enough_balance` functions have the following risks (assuming there are no bugs in the other functions)
- [ ] A) The user can unlock their balance without burning the underlying tokens 
- [ ] B) An attacker can front-run a call to `burn` and make it revert 
- [ ] C) `burn` should use `tx.origin` instead of `msg.sender` to prevent access control issues 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B
<p>
A: No way to do this.<br>
B: Due to the strict equality requirement in _burn_, a frontrunner can transfer 1 wei of token to the user to make the burn-call revert.<br>
C: Making this change would likely make the contract less secure (opens phishing vector) and would also be bad for composability (only EOAs could be users).
</p>
</details> 