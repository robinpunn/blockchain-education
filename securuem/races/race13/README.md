### [Secureum Race 13](https://ventral.digital/posts/2023/1/3/race-13-of-the-secureum-bootcamp-epoch)
##### Q1 In `transferFrom()`, `unchecked` is not used in the allowance subtraction
- [ ] A) To save gas 
- [ ] B) To avoid unauthorized transfers 
- [ ] C) To avoid reentrancy 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B
<p>
The way this question is asked is quite tricky. First of all, you have to correctly identify the line of code where the allowance subtraction happens (_allowed - amount_) and notice that unchecked is not being used there to be able to correctly interpret the question.<br>
Next, you should ask: What would happen if the _unchecked_ block was actually used? Then Solidity's overflow-checks would be omitted, which would mean less bytecode and therefore gas-savings. Therefore, not using _unchecked_ needs more gas, and answer A cannot be true.<br>
Solidity's overflow-checks will make the code revert if the _amount_ is larger than the _allowed_ value. This will ensure that callers are only able to send the amount that they were authorized to handle. Therefore if the _unchecked_ block would have been used and there is no other place that checks this, it would have enabled unauthorized transfers making answer B true.<br>
Whether an _unchecked_ block is used or not has nothing to do with reentrancy, therefore answer C is false.
</p>
</details> 
##### Q2 In `transfer()` and `transferFrom()`, the use of `unchecked` would not be desired:
- [ ] A) When the token uses large number of decimals 
- [ ] B) When the token uses small number of decimals 
- [ ] C) At all times 
- [ ] D) At no times
<details>
<summary>Answer</summary>
D
<p>
Originally, the correct answer was intended to be A with the following explanation from Leo: "Unchecked would be always desired if this operation can never overflow, and never desired if it can easily overflow. Neither case is true. The number of _decimals_ can influence that. The more decimals the token uses, the bigger one's balance is, in terms of tokens. Depending on how large _decimals_ is, it can lead to the case where overflow is possible in a legit use case. In this case, _unchecked_ could lead to bugs."<br>
This assumed though, that the operation can overflow, which it actually can't in the context of this contract since, as mentioned, by the code-comment "Cannot overflow because the sum of all user balances can't exceed the max uint256 value." thanks to the __mint()_ function's _totalSupply_ increase not being in an _unchecked_ block.<br>
Although the use of large decimals doesn't negatively impact the token's own logic, it should still be mentioned that it might cause issues for other contracts that would like to integrate the tokens. An example for this would be the multiplication of two user's balances where, as per best practice, multiplication would happen before division (to avoid loss of precision) and might cause an overflow.
</p>
</details> 
##### Q3 In `name()` and `symbol()`, the returned values are incorrect because 
- [ ] A) The string encoding is too short 
- [ ] B) Inline assembly `return` does not leave the function 
- [ ] C) `MSTORE` does not fill all bytes until 0x5f and function may return junk at the end 
- [ ] D) The code always reverts
<details>
<summary>Answer</summary>
C
<p>
The first MSTORE writes a static 0x20 (32 in decimal) to the first memory slot. This is done since the RETURNed value is expected to be ABI-encoded and the encoding of dynamic types such as string is an offset that points to where the actual string in the return data starts. Since there's no other data being returned, it simply points to the next 32-byte slot starting at address 0x20.<br>
The second MSTORE actually writes two things at the same time: The string length and the actual string contents. Strings always consist of these two parts and it's important to remember that the length is right-aligned (like all numbers in memory) in the first slot, while the string's content is left-aligned (like all strings and dynamic byte-arrays in memory) in the following slots.<br>
Also, remember that MSTORE always writes 32 bytes of data starting at the specified address even when the data you specified is shorter than 32 bytes. In such cases, the data will be left-padded to automatically right-align it like a number. Both functions make use of this fact by not starting at 0x20 but instead increasing the address by the length of the string. That way the first byte of the string in the code will end up at the last byte of the slot while the following bytes are moved to the beginning of the next slot.<br>
While this seems like an elegant approach, the problem now is that only the first few bytes (the string contents) of the third slot have been written to. All of the following bytes are simply assumed to be zero-values although they might contain junk which could cause issues for the receiver of the returned data. In this specific case, the code accesses the memory area where Solidity stores the "free memory pointer". This value is returned as part of the string, which is basically junk.<br>
Finally, the RETURN operation in inline assembly not only leaves the function, but stops the execution of the transaction. It's is told to return 0x60 (3x32) bytes starting at offset 0x0, effectively returning all of the memory slots that had been written to:
</p>
</details>
##### Q4 To correct `name()`, one could make the following change(s)
- [ ] A)
    ```
    assembly {           
	    mstore(0x20, 0x20)           
	    mstore(0x48, 0x0843616c6c6261636b)           
	    return(0x20, 0x60)        
	}
	```
- [ ] B)
```
function name() external pure returns (string memory n) { n = "Callback"; }
```
- [ ] C)
```
return "Callback";
```
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,B,C
<p>
Answer A moves the memory used for the return value by one 32-byte slot "to the right". This way the string won't end up sharing its space with where Solidity stores the "free memory pointer" and no junk will be returned anymore, at least in this specific case. It still clashes with other reserved memory areas of Solidity, but since they are zero in this case it doesn't matter. The fact that reserved memory areas are used also is no problem as long as control is never returned back to Solidity, as is the case here thanks to the use of RETURN.<br>
Answers B and C are basically equivalent and represent the usual ways one would do it in Solidity.
</p>
</details>
##### Q5 The concern(s) with the check in `notify()` is/are
- [ ] A) Selector 0x00000000 is the `fallback` function 
- [ ] B) Selector 0x00000000 is the `receive` function 
- [ ] C) Selector 0x00000000 is possible in which case a valid callback would not be called 
- [ ] D) Selector can never be 0x00000000, so the check is useless
<details>
<summary>Answer</summary>
C
<p>
A and B are simply not true, as _fallback_ and _receive_ don't have selectors. Rather, they are called when no function with the requested selector was implemented in the called contract.<br>
Answer C is regarding the possibility that, although unlikely, a normal external function could end up having 0x00000000 as function selector. In such a case, Solidity will revert (thinking that the variable was not properly initialized) when attempting to call said callback. Therefore a valid callback would not be called.
</p>
</details>
##### Q6 The concern(s) with the call in `notify()` is/are:
- [ ] A) The call always reverts 
- [ ] B) The passed function pointer is internal and therefore not accessible via an external call 
- [ ] C) One should always use `try/catch` in external calls 
- [ ] D) The called contract may not have the called function selector thus falling through to `fallback` or reverting the transfer
<details>
<summary>Answer</summary>
D
<p>
The call should not revert in the success case.<br>
The function pointer is _external_, therefore it has an _address_ and a _selector_, which are used to make an external call.<br>
One doesn't need to always use _try/catch_, which is true especially when they want a failure to bubble up.<br>
There are no checks that the selector exists in the given address when a callback is registered. Therefore both the address and selector may be wrong when this external call is made.
</p>
</details>

##### Q7 Potential change(s) to `notify()` to mitigate further security concern(s) is/are
- [ ] A) Enforce the callback call to use `delegatecall` 
- [ ] B) Enforce the callback call to use `staticcall` 
- [ ] C) Send Ether to the called contract 
- [ ] D) Make the call in inline assembly
<details>
<summary>Answer</summary>
B
<p>
The use of _delegatecall_ would cause immediate exploits here.<br>
Enforcing _staticcall_ instead could prevent unseen potential issues, since it wouldn't allow any state changes from that call. Note that this could of course be different from the intended behavior.
</p>
</details>
##### Q8 How can the contract be exploited for loss-of-funds via notify callback reentrancy?
- [ ] A) During the callback, while being the sender of a transfer, repeat the transfer 
- [ ] B) During the callback, while being the recipient of a transfer, call `transfer` again in the token contract sending the tokens back to the original sender 
- [ ] C) During the callback, while being the recipient of a transfer, burn the received tokens 
- [ ] D) This cannot happen in this contract
<details>
<summary>Answer</summary>
D
<p>
In order to exploit the contract via callback reentrancy, it would need to have an incompletely updated state when the callbacks are called. But the contract follows the checks-effects-interactions pattern and both the subtraction from the sender as well as the addition to the receiver's balance have already happened when the calls are made.
</p>
</details>