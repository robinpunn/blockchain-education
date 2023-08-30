### [Race 15](https://ventral.digital/posts/2023/2/27/race-15-of-the-secureum-bootcamp-epoch-infinity)

---

##### Q1 What is/are the correct implementation(s) of the `nonReentrant()` modifier?** 
- [ ] A)
```
require (reentrancy_lock == 1);         
	reentrancy_lock = 0;         
	_;        
	reentrancy_lock = 1;
```
- [ ] B)
```
require (reentrancy_lock == 0);         
	reentrancy_lock = 1;         
	_;        
	reentrancy_lock = 0;`
```
- [ ] C)
```
require (reentrancy_lock == 1);         
	reentrancy_lock = 1;         
	_;        
	reentrancy_lock = 0;`
```
- [ ] D)
```
require (reentrancy_lock == 0);         
	reentrancy_lock = 2;        
	_;        
	reentrancy_lock = 0;`
```
<details>
<summary>Answer</summary>
B, D
<p>
The correct implementation of a mutex-modifier must change the value of a storage variable and only reset it once the execution of the function's body (triggered by __;_) has been completed. This storage variable must also be checked by the modifier: If the value is in its initial state (which in this case is zero since _reentrancy_lock_ is not initialized with any specific value) then the execution of the function may proceed. But if it's in the non-default state (meaning the modifier is being executed again while the function body has yet to complete) then the check should error.<br>
Answer A) cannot be correct since it assumes a starting value of 1 instead of 0.<br>
Answer B) does indeed assume the default of 0 as the starting point and uses 1 to signify the "function body is executing" state.<br>
Answer C) requires the starting value to be 1, which is not the default.<br>
Answer D) works just like B) with the only difference that it uses the number 2 instead of 1.
</p>
</details> 

##### Q2 Who can claim fees using `claimFees()`?
- [ ] A) Only the owner, due to `onlyOwner` modifier 
- [ ] B) The owner 
- [ ] C) Anyone who can trick owner into signing an arbitrary transaction 
- [ ] D) No one 
<details>
<summary>Answer</summary>
B, C
<p>
The _claimFees()_ function uses the _onlyOwner_ modifier which checks the origin address (the signer of the transaction being executed, not the sender of the message) and requires it to match the address stored within the _owner_ state variable. This state variable is only set once during the creation of the contract and can only be changed, once again, by passing through the _onlyOwner_ modifier.<br>
The problem with using the transaction origin for authentication purposes is, that anyone can be the caller of the _claimFees()_ and _setOwner()_ function of this contract. Meaning that one could trick the owner into signing a seemingly unrelated transaction to another contract and that other contract may then call these functions as if it were acting with the approval of the owner. Due to this potential "phishing vector" it is generally considered a bad practice to use _tx.origin_ for authentication and one should normally use _msg.sender_ instead.
</p>
</details> 

##### Q3 In `buyEth()`, we put an `unchecked` block on “`current_eth -= amount`” 
- [ ] A: Because `current_eth` is `uint` 
- [ ] B) Because the compiler is protecting us from overflows 
- [ ] C) Only if we add a prior check:  
    `require(current_eth > amount);` 
- [ ] D) Only if we add a prior check: 
	`require(current_eth >= amount);`
<details>
<summary>Answer</summary>
D
<p>
A so-called "unchecked-block" will disable overflow protections provided by the Solidity compiler of versions 0.8.0 and higher. If a unchecked-block were used, a buyer may obtain more ether than the SimpleDEX contract is holding if such value was injected into the contract through means other than a normal transfer (eg. via selfdestruct()).<br>
While the type of _current_eth_ is indeed uint, standing for unsigned integer, meaning an integer that can not represent negative values, that doesn't mean that it can't underflow. For example, if the value in a uint8 is currently 0 and 1 would be subtracted from it in an unchecked-block, then it would roll over to the biggest value it can represent: 255.<br>
Option D) will prevent _current_eth_ from underflowing below 0.
</p>
</details> 

##### Q4 In `buyEth()`, are there any reentrancy concerns assuming the `nonReentrant` modifier is implemented correctly?
- [ ] A) No, because it has the `nonReentrant` modifier 
- [ ] B) No, and even without the modifier you can't exploit any issue 
- [ ] C) Yes, there is a cross-contract reentrancy concern via `Seller` 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
C
<p>
While the _nonReentrant_ modifier prevents re-entering the same contract to exploit an "incomplete state", the same cannot be said for other contracts that might make use of the _SimpleDEX_'s state before the state is completely updated.<br>
Specifically state variables involved in determining the price (_token_balance_ & _current_eth_) are relevant here: _current_eth_ is updated before the _call()_ to the message sender is made. But _token_balance_ is only updated after.<br>
If the _msg.sender_ is actually a contract, it will have a chance to call another protocol that is relying on the _SimpleDEX_'s reported price to be correct (such as the _Seller_ contract). If the malicious contract calls this victim contract while the state of _SimpleDEX_ is incomplete (ie. cross-contract read-only reentrancy) the victim would make use of this incorrect price data which might give the attacker an advantage. (Not in this case though. There's no advantage to exploiting this in _Seller_ since the attacker would actually have to pay a higher price than without exploiting this issue).
</p>
</details> 

##### Q5 What will happen when calling `buyEth()` via `SimpleDexProxy`?
- [ ] A) `buyEth()` will be called and successfully executed 
- [ ] B) You can’t call a function that way; it must be called directly 
- [ ] C) `buyEth()` will be called but ETH won't be transferred 
- [ ] D) Transaction will be reverted
<details>
<summary>Answer</summary>
D
<p>
The transaction would be reverted since the SimpleDEX's _buyEth()_ function would attempt transferring the tokens from the _msg.sender_, which in this case would be a proxy that has no way to give it the appropriate allowance even if the user were to transfer their tokens to the proxy first.
</p>
</details> 

##### Q6 In `buyEth()`
- [ ] A) If `amount` is less than 100, it will lead to an incorrect calculation of `fee` 
- [ ] B) If `token_balance` is already at its `MAX_UINT256`, it will result in overflow and won't revert 
- [ ] C) If `token_amount` is > `MAX_UINT64`, it will result in a casting issue 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,C
<p>
In _buyEth()_ the _amount_ is divided by 100 before being multiplied with _fees_percentage_. Since we're dealing with integer division there are no rational numbers. Dividing anything lower than 100 will result in 0 causing the _fee_ to be 0 as well. The general best practice is "multiplication before division" to prevent such issues involving loss of precision.<br>
Starting Solidity 0.8.0, an overflow happening outside of an "unchecked-block" will always result in the transaction reverting. Therefore B) is incorrect.<br>
When the _token_amount_ is added to the _token_balance_ there's indeed a casting issue when the amount's value does not fit into a uint64 type.
</p>
</details> 

##### Q7 Can `getEthPrice()` return zero?
- [ ] A) Yes, if the owner initializes the contract with more ETH than `token_balance` 
- [ ] B) Yes, a carefully crafted `buyEth()` transaction can result in `getEthPrice()` returning zero 
- [ ] C) Yes, once all the ETH are sold 
- [ ] D) No, there is no issue
<details>
<summary>Answer</summary>
A
<p>
The _getEthPrice()_ function calculates the price with `token_balance / current_eth`. Since this is integer division, if the token balance would be smaller than the current ether balance the result would not be a integer but a rational. So the result would end up being a zero.<br>
There isn't anything special you can "craft" for a call to _buyEth()_ to result in the price function returning zero.<br>
Once all the ETH are sold, _getEthPrice()_ won't return zero but revert instead due to a division-by-zero.
</p>
</details> 

##### Q8 Which of the following invariants (written in propositional logic) hold on a correct implementation of the code?
- [ ] A): `this.balance == current_eth` <=> `token.balanceOf(this) == token_balance` 
- [ ] B) `this.balance >= current_eth` && `token.balanceOf(this) >= token_balance` 
- [ ] C) `this.balance <= token.balanceOf(this)` && `token.balanceOf(this) <= token_balance` 
- [ ] D) `this.balance >= current_eth` || `token.balanceOf(this) >= token_balance`
<details>
<summary>Answer</summary>
B,D
<p>
The symbol _<=>_ is called the biconditional operator, meaning that the expressions on either side are logically equivalent. But the actual balance of ether being equal to the balance tracked within the state variable _current_eth_ does not imply that the actual and tracked token balances are equal too. So the biconditional is invalid. But even if it were an AND operator it would not be an invariant that could hold: The invariant would be simple to break by sending unsolicited tokens to the contract (eg. via selfdestruct()).<br>
Option B) includes the fact that the actual token and ether balances may be higher than the tracked balances. In a correct implementation this invariant should always hold.<br>
Option C)'s second part allows the tracked _token_balance_ to be larger than the actual token balance. This should not be the case in a correct implementation.<br>
Option D) seems similar to B) but would allow for there to be either too little ether to match the tracked balance or too little tokens to match the tracked token balance. So it doesn't sound like a good invariant to test for since you'd want both things to hold true and not just one of them. But that wasn't the question - would it hold true in a correct implementation? Yes.
</p>
</details> 