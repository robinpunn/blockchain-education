### [Race 10](https://ventral.digital/posts/2022/10/3/secureum-bootcamp-epoch-october-race-10)

##### Q1 Which statements are true in _Test1()_? 
- [ ] A) The function does not use all supplied extra data 
- [ ] B) The function can revert due to an underflow 
- [ ] C) The function can revert due to an overflow 
- [ ] D) The function accesses memory which it should not
<details>
<summary>Answer</summary>
A,B,C
<p>
Answer A seems a bit confusing when looking at _Test1()_ alone, but seeing the _xtr_ variable of _Test2()_ brings some clarity: The _Test1()_ function signature expects one uint to be passed, but then within the function body it loads 64 bytes directly from calldata. _Test2()_ then shows how the function is intended to be called by concatenating extra data to the ABI encoded calldata. It adds two more uint types which together are 64 bytes of extra data. But then in the _abi.decode_ only the first uint from extra data is actually decoded and used.<br>
Both B and C are true since a Solidity version (^0.8.0) is used, that automatically checks for integer over/underflows and reverts when these happen. In this specific case, an overflow could happen when parameter _n_ or the number supplied from extra data are large enough to wrap. The underflow can happen when the overall supplied calldata is smaller than 64 bytes, making the subtraction within the slicing parameters fail.<br>
You could argue that accessing _msg.data_ directly should be avoided when possible. But this doesn't access memory but read-only calldata. Therefore no memory is accessed that should not be.
</p>
</details> 
##### Q2 Which statements are true in _Test2()_?
- [ ] A) Result of _encodePacked_ is deterministic 
- [ ] B) _abi.decode_ always succeeds 
- [ ] C) It calls function _Test1()_ without any problem 
- [ ] D) It should use _uint256_ instead of _uint_
<details>
<summary>Answer</summary>
A,C
<p>
Deterministic means that you should always get the same predictable output for a given input. As such, _encodePacked_ always encodes passed data the same way.<br>
Test2's _abi.decode_ will only succeed if no error happens in _Test1()_. If _Test1()_ reverts the returned data would not contain a decodable uint but error data. One way to cause this to happen would be supplying a number _n_ that causes an overflow. The best practice is to check the _success_ boolean before attempting to decode the returned data.<br>
Answer D leaves some room for interpretation. _uint_ is an alias of _uint256_ and there should not be an issue using it here. But it's a common best practice to avoid the shorter alias and instead use the longer-named version of the type. While this is generally considered to improve readability, I'd argue that consistency (always using the same type) is more important.
</p>
</details> 
##### Q3 Which statements are true in _NextBookNonce()_?
- [ ] A) _wrap_ and _unwrap_ cost additional gas 
- [ ] B) It is safe to use _unchecked_ 
- [ ] C) There is something suspicious about the increment value 
- [ ] D) It could have used _x.nonce++_
<details>
<summary>Answer</summary>
B,C
<p>
The calls to _wrap_ and _unwrap_ are basically telling Solidity whether it should treat a certain variable as being of a custom type (_Nonce_) or of its native type (_uint256_). This switch is basically just syntactic sugar for handling types within Solidity, the EVM will know nothing of these type switches and no additional gas will be used by doing so.<br>
Using an _unchecked_ block in this function would omit Solidity's over/underflow handling. Especially in the context of a Nonce (Number used only once), you don't want integer values to wrap and overflow to values that were once used before. But usually, a nonce is only increased by such a small value that exploiting this would be very expensive. In this specific case, the function is pure and the nonce is not stored, so whether it's safe to use unchecked block will depend on the function being used correctly.<br>
Answer C sounds rather ominous but it's simply pointing out that Nonces are commonly increased by one and not by such a weird number as 3.<br>
Arithmetic operations cannot be executed on custom types without unwrapping the number first.
</p>
</details> 
##### Q4 Which statements are true in _Test3()_?
- [ ] A) _bookIndex.nonce_ is incremented in the loop 
- [ ] B) _bookIndex.nonce_ cannot be incremented because _NextBookNonce_ is pure 
- [ ] C) _i++_ can be made _unchecked_ 
- [ ] D) _memory_ can be changed to _storage_ without any other changes
<details>
<summary>Answer</summary>
A,C
<p>
Both A and B should be clear from reading the code.<br>
The increment of _i_ within the loop can indeed be made _unchecked_ since it won't be able to overflow no matter what is supplied as _n_.<br>
The _memory_ location can't simply be changed to _storage_ without various further changes such as assigning it to a specific storage slot before being able to make use of it.
</p>
</details> 
##### Q5 Which statements are true In _Test4()_?
- [ ] A) The function always reverts with _ZeroAddress()_ 
- [ ] B) The function always reverts with _ZeroAmount()_ 
- [ ] C) The function never reverts with _ZeroAddress()_ 
- [ ] D) The function never reverts with _ZeroAmount()_
<details>
<summary>Answer</summary>
C,D
<p>
The first array elements of both _a_ and _amounts_ will always be zero-like. Both _1_ for _ZeroAddress_ and _2_ for _ZeroAmount_ will be OR-combined resulting in 3. Once this value is set as an error, further iterations will not influence it. After the loop has finished, this error value is not checked for and instead, the function returns the _total_ without reverting.
</p>
</details> 
##### Q6 Which statements are true in _Test5()_?
- [ ] A) modifier _checkInvariants_ will pause the contract if too much is minted 
- [ ] B) modifier _checkInvariants_ will never pause the contract 
- [ ] C) modifier _checkInvariants_ will always pause the contract 
- [ ] D) There are more efficient ways to handle the _require_
<details>
<summary>Answer</summary>
B,D
<p>
While the _checkInvariants_ modifier does intend to pause the contract if too much is minted, it'll be unable to ever do so since this will be reverted by the second _require_ call.<br>
A single call to _require_ would fix this issue and also be more efficient.
</p>
</details> 
##### Q7 Which statements are true about the _owner_?
- [ ] A) The _owner_ is initialized 
- [ ] B) The _owner_ is not initialized 
- [ ] C) The _owner_ cannot be changed 
- [ ] D) The _owner_ can be changed
<details>
<summary>Answer</summary>
A,D
<p>
Although not visible here, the _owner_ is indeed initialized by the constructor inherited from _Ownable_, which also comes with functions allowing to change the _owner_ at a later point.
</p>
</details> 
##### Q8 Which statements are true In _Test5()_ and related functions?
- [ ] A) _pause_ is unsafe 
- [ ] B) _unpause_ is unsafe 
- [ ] C) The _emit_ is done right 
- [ ] D) The _emit_ is done wrong
<details>
<summary>Answer</summary>
A,D
<p>
The _pause_ function is missing the _onlyOwner_ modifier allowing anyone to arbitrarily pause the contract.<br>
The _minted_ event's parameters appear to be in the wrong order.
</p>
</details> 