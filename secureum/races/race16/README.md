### [Race 16](https://ventral.digital/posts/2023/4/1/race-16-of-the-secureum-bootcamp-epoch-infinity)

##### Q1 Which of the following is an explanation of why `flashLoan()` could revert? 
- [ ] A) The transaction reverts because a user requested to borrow more than `maxFlashLoan()` 
- [ ] B) The transaction reverts because the receiver’s `onFlashLoan()` did not return `CALLBACK_SUCCESS` 
- [ ] C) The transaction reverts because the user returned more than `retAmt` funds 
- [ ] D) The transaction reverts because a user tried to spend more funds than their allowance in `onFlashLoan()`
<details>
<summary>Answer</summary>
A,B,D
<p>
A. Is implicitly checked in the require with message "Too many funds requested"<br>
B. Is explicitly checked in the require with message "Callback failed"<br>
C. The user may return more but not less than _retAmt_<br>
D. An ERC20 _transferFrom()_ would revert in that case
</p>
</details> 
##### Q2 If the `FlashLoan` contract were safe, which of the following invariants should hold at the end of any given transaction for some ERC20 token t? Note: old(expr) evaluates expr at the beginning of the transaction.
- [ ] A) t.balanceOf(address(this)) >= old(t.balanceOf(address(this))) 
- [ ] B) t.balanceOf(address(this)) == old(t.balanceOf(address(this))) 
- [ ] C) t.balanceOf(address(this)) > old(t.balanceOf(address(this))) 
- [ ] D) t.balanceOf(address(this)) == old(t.balanceOf(address(this))) + fee
<details>
<summary>Answer</summary>
A
<p>
For the flashloan to be safe, the contract's token balance must be maintained no matter which function is called. It must be (A) because flashloan will cause the token balance to either increase or stay the same (depending on fee) and all other functions should maintain token balances
</p>
</details> 
##### Q3 Which of the following tokens would be unsafe for the above contract to loan as doing so could result in theft?
- [ ] A) ERC223 
- [ ] B) ERC677 
- [ ] C) ERC777 
- [ ] D) ERC1155 
<details>
<summary>Answer</summary>
C
<p>
This can be attacked by ERC20 contracts with sender-callbacks in _transferFrom()_. ERC777 and ERC1155 are the only ones with callbacks. But ERC1155 will revert as its APIs doesn't match the ones in the flashloan contract, even even then, it would only have receiver-callbacks.
</p>
</details> 
##### Q4 Which external call made by `flashLoan()` could result in theft if the token(s) identified in the previous question were to be used?
- [ ] A) `onFlashLoan()` 
- [ ] B) `balanceOf()` 
- [ ] C) `transferFrom()` 
- [ ] D) `approve()` 
<details>
<summary>Answer</summary>
C
<p>
ERC777 tokens have potentially dangerous callbacks on _transfer()_/_transferFrom()_ that can result in theft.
</p>
</details> 
##### Q5 What is the purpose of the fee in the `FlashLoan` contract as is?
- [ ] A) To increase the size of available flashloans over time 
- [ ] B) To pay the owner of the flashloan contract 
- [ ] C) To pay those who staked their funds to be flashloaned 
- [ ] D) It has no purpose
<details>
<summary>Answer</summary>
A
<p>
In the current _FlashLoan_ contract, as it is, the sole purpose of the fee is to increase the available funds to loan.
</p>
</details> 
##### Q6 Which of the following describes the behavior of `maxFlashLoan` for a standard ERC20 token over time?
- [ ] A) Strictly-increasing 
- [ ] B) Non-decreasing 
- [ ] C) Constant 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B
<p>
Can't be A since fee may be 0. It could still increase from people injecting tokens, but it may never decrease.
</p>
</details> 
##### Q7 For some arbitrary ERC20 token t, which of the following accurately describes the `FlashLoan` contract's balance of t after a successful (i.e. non-reverting) call to `flashLoan()` (where t is the token requested for the flashloan)?
- [ ] A) The `FlashLoan` contract's balance of token t will INCREASE OR STAY THE SAME 
- [ ] B) The `FlashLoan` contract's balance of token t will DECREASE OR STAY THE SAME 
- [ ] C) The `FlashLoan` contract's balance of token t will STAY THE SAME 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
D
<p>
_flashLoan()_ can hypothetically finish successfully with any token that implements the ERC20 interface, even if it is a bogus implementation. Therefore, there are no guarantees on the output of _IERC20(token).balanceOf(user)._
</p>
</details> 
##### Q8 Which of the following are guaranteed to hold after a successful (i.e., non-reverting) execution of `flashLoan()`, assuming the token for which the flashloan is requested uses OpenZeppelin’s Standard ERC20 implementation?
- [ ] A) The receiver’s balance of “token” increases 
- [ ] B) The funds that the `FlashLoan` contract has approved the `receiver` to spend has either stayed the same or decreased 
- [ ] C) The sum of all flashloans granted by the `FlashLoan` contract is less than the `maxFlashLoan` amount 
- [ ] D) The token balance of any contract/user other than the `FlashLoan` contract, the caller of the `flashLoan()`, and the “receiver” contract will remain the same as before the call to `flashLoan()`
<details>
<summary>Answer</summary>
B
<p>
A. The token balance of the receiver could increase, decrease, or remain the same in the call to _onFlashLoan()_<br>
B. This is ensured by the last if-statement<br>
C. _maxFlashLoan_ has no relationship to the sum of all flashloans<br>
D. Other user token balances could be adjusted in the call to _onFlashLoan()_
</p>
</details> 