### [Race 11](https://ventral.digital/posts/2022/10/31/race-11-of-the-secureum-bootcamp-epoch)

##### Q1 Which statements are true in withdraw()?
- [ ] A) Can be successfully executed when contract is paused 
- [ ] B) User can withdraw only after _minDepositLockTime elapsed since last withdrawal 
- [ ] C) Follows checks-effects-interaction pattern best practice 
- [ ] D) User can withdraw more than deposited
<details>
<summary>Answer</summary>
D
<p>
The _require_ statement right at the start of the function ensures that any attempt to call it will revert when the contract is paused.<br>
The time is not measured since the last withdrawal but since the last deposit.<br>
Does not follow the CEI pattern since calling _safeTransferFrom()_ on the __token_ is an interaction with an external contract, and effects like the balance update happen after it.<br>
When a user attempts to withdraw an _amount_ larger than their current balance, it'll simply be set to 0 and the requested amount would be send without any issue as long as the user does not attempt to send more tokens than the contract owns.
</p>
</details> 
##### Q2 Which mitigations are applicable to withdraw()?
- [ ] A) Transferred amount should be minimum of amount and _userBalances[msg.sender] 
- [ ] B) Move if/else block before safeTransferFrom 
- [ ] C) Require amount to be <= user’s balance deposited earlier 
- [ ] D) Remove if/else block and add _userBalances[msg.sender] -= amount before safeTransferFrom
<details>
<summary>Answer</summary>
A,C,D
<p>
Checking which one of _amount_ or the actual current balance is smaller, then using that as the amount of tokens to transfer to the user, does indeed seem like an easy way to mitigate the bug allowing to withdraw arbitrary amounts.<br>
Moving the _if/else_ block before _safeTransferFrom_ would bring the function closer to following the CEI pattern. Altough, it likely wouldn't mitigate any exploitable issue, since the __token_ is set by the deployer and, assuming it follows typical ERC20 implementations, it wouldn't allow for reentrancy by the token receiver. It still wouldn't follow the CEI pattern completely though, since Events too are considered effects.<br>
Using a _require_ to ensure the _amount_ isn't larger than the users actual balance is a more typical way to handle these situations. At least more typical than sending the minimum of _amount_ and the users actual balance instead. With this change, the _else_ block can also be removed since it'll become unreachable.<br>
The last mitigation suggestion makes use of the fact that Solidity ^0.8.0 will automatically check whether there'd be an integer underflow when subtracting the _amount_ from the user's balance. This is likely the most gas efficient solution, although it won't offer a good error message for the user when it happens.
</p>
</details> 
##### Q3 The security concern(s) in pause() is/are:** 
- [ ] A) Does not emit an event 
- [ ] B) Access control is not strict enough 
- [ ] C) Will always revert 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A
<p>
The general best practice is, that all state changing functions should emit an event. This is especially true for functions that one wants to monitor off-chain, the _pause/unpause_ functions being a perfect example for that.<br>
The access control is actually very strict. So strict in fact that the _pause()_ function will always revert unless both __operator_ and __governance_ are the same address. The inline comment makes it clear that this behavior is unintentional and a bug.<br>
But the constructor isn't preventing both from being the same address and even then, anyone can call _changeGovernance()_ and make it the same. So claiming it would always revert isn't correct either.
</p>
</details> 
##### Q4 Which statement(s) is/are true for unpause()?
- [ ] A) Will unpause deposits and withdrawals 
- [ ] B) Will unpause withdrawals only 
- [ ] C) Anyone can successfully call the function 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B,C
<p>
Although the _withdraw()_ function does, the _deposit()_ function does not ensure that nobody can use it while the contract is paused. The best practice would be, if possible, to have it the other way around. When a contract needs to be paused due to an emergency, such as a discovered bug, it should become impossible for users to deposit new funds into the vulnerable contract while still allowing users to withdraw their funds.<br>
Even though _unpause()_ function appears to correctly _require_ the caller to be the __governance_ address, anyone can call _changeGovernance()_ to set it to themselves.
</p>
</details> 
##### Q5 Which statement(s) is/are true in depositFor()?
- [ ] A) Can be executed when contract is paused 
- [ ] B) Allows a user to deposit for another user 
- [ ] C) Allows a user to fund the deposit for another user 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,B
<p>
Although the _withdraw()_ function does, the _deposit()_ function does not ensure that nobody can use it while the contract is paused. The best practice would be, if possible, to have it the other way around. When a contract needs to be paused due to an emergency, such as a discovered bug, it should become impossible for users to deposit new funds into the vulnerable contract while still allowing users to withdraw their funds.<br>
In order to make a deposit for another _user_, that user needs to have approved the contract to make use of their tokens. It's not possible for one user to use their funds for a deposit for another user.
</p>
</details> 
##### Q6 The issue(s) in depositFor() is/are:
- [ ] A) Cannot be paused for emergency 
- [ ] B) Exploitable re-entrancy attack 
- [ ] C) User withdrawals can be delayed indefinitely via DoS attack 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,C
<p>
Although the _withdraw()_ function does, the _deposit()_ function does not ensure that nobody can use it while the contract is paused. The best practice would be, if possible, to have it the other way around. When a contract needs to be paused due to an emergency, such as a discovered bug, it should become impossible for users to deposit new funds into the vulnerable contract while still allowing users to withdraw their funds.<br>
The only external call made is one to the __token_. The token is chosen by the operator and, assuming that it can be trusted and doesn't behave in an unexpected way, there should be no other external call that give the caller an opportunity to re-enter.<br>
There's indeed an opportunity to Deny another user the Service to withdraw their funds. That is because anyone can call the function with an _amount_ of 0 and the victim's address as depositor. In that case, no matter whether the victim has an open allowance with the contract, an attacker can keep increasing __userLastDeposit_ indefinitely to delay when the withdrawal is possible. The attacker would have to regularly keep calling the function and pay for the gas that uses though.
</p>
</details> 
##### Q7 Which of the following statement(s) is/are true?
- [ ] A) Withdraw event is emitted with incorrect amount 
- [ ] B) Withdraw event is emitted with correct user 
- [ ] C) Deposit event is always emitted incorrectly 
- [ ] D) Deposit event is emitted with incorrect user    
<details>
<summary>Answer</summary>
B,D
<p>
The event emitted during withdrawal appears to be used correctly.<br>
It seems more correct to log the user that the deposit is being made for instead of the calling address.
</p>
</details> 
##### Q8 Potential gas optimization(s) is/are
- [ ] A) Use immutable for all variables assigned in constructor 
- [ ] B) Use immutable for _token, _operator and _minDepositLockTime 
- [ ] C) Use unchecked 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B,C
<p>
Most _internal_ variables assigned in the constructor are currently using expensive storage space. It would cost much less gas to use _immutable_ variables which are placed into the bytecode during the deployment of the contract.<br>
There is however the __governance()_ variable which is intended to be changeable through the _changeGovernance()_ function. This one should stay a storage variable, although one could argue it should become _public_ to make its current state more easily readable.<br>
There are a few places where _unchecked_ blocks can be used without much risk to skip integer overflow checks and save gas. These are places that are unlikely to overflow due to their nature such as adding an amount of tokens to a balance or adding seconds to a timestamp.
</p>
</details> 