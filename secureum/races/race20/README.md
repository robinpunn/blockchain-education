[Race 20](https://ventral.digital/posts/2023/7/30/race-20-of-the-secureum-bootcamp-epoch-infinity)

---

##### Q1 Select all true statements
- [ ] A) The inline assembly block is `memory-safe` 
- [ ] B) The memory after `toString(...)` call is always 32-byte aligned 
- [ ] C) Instead of allocating memory from 0x40, the function can allocate from 0x0 to save gas (memory expansion cost) and still be correct 
- [ ] D) None of the above 
<details>
<summary>Answer</summary>
A
<p>
A: The inline assembly block is indeed <a href="https://docs.soliditylang.org/en/latest/assembly.html#memory-safety">memory-safe</a>, as it only writes to allowed memory ranges. In this specific case it always allocates memory starting from the free memory pointer. A "pointer" is an address within memory and the free memory pointer is the address pointing to the start of unallocated, free memory. This pointer itself is stored in memory at address 0x40 and, unless the value that was just stored in memory is temporary, it should be updated to skip over any recently allocated memory.<br>
B: While the memory itself is allocated in chunks of 32-byte slots, the values within these slots will not be properly aligned to each slot. First, note that each string stored in memory consists of two components: The first 32 bytes of a string are always its length. After the length, each further 32 bytes slot will contain part of the actual string's value. Therefore, if you want a pointer to the beginning of a string, you have to add 32 bytes to the string's pointer.<br>
Step #0: Initial memory state before _toString(1)_ is executed<br>
Step #1: Memory pointer was updated and initial length of string was written<br>
Step #2: The _char_ for "1" is determined to be 0x31 (48+1), its value is then stored to (_str_ + _k_) 0x80 + 0x4E = 0xCE<br>
Remember that _MSTORE_ writes chunks of 32 bytes, so when it writes 0x31 to 0xCE the byte carrying the value will end up in 0xE0's slot because of all the leading zeros (0x0000000000000000000000000000000000000000000000000000000000000031). The number is being converted to a string from right to left. If it would be done the other way around, previous numbers to the left would be overwritten by the following character being placed in memory. By doing it right to left, the _MSTORE_s won't impact the characters already written on the right.<br>
But this is also why a short number such as 1 would end up with many leading zero-bytes in front of it. To prevent this from happening, the _str_ reference variable is updated to point to the 32 bytes before the string starts – causing the string's start to no longer be aligned with the beginning of a 32 byte slot. This is the place where finally the string's length will be set at<br>
C: The 64 bytes starting at memory address 0x0 are called the "scratch space". While they're usually used for operations like hashing, you're free to use them to temporarily store things there and leave them without having to clean them up. But there's no guarantee that anything placed in scratch space will remain there for long as any other part of the contract may use it for temporary operations as well. This function's purpose would be harmed if the returned string would be overwritten at random, therefore, while it may safe gas to attempt doing so, it cannot be said that it would still be correct to use the memory at 0x0 instead of allocating fresh dedicated memory. Furthermore, for the largest uint256, this function requires more memory than the 64-byte scratch space can offer.
</p>
</details> 

##### Q2 Select all true statements about the expression `mstore(0x40, add(str, 128))
- [ ] A) The expression allocated more memory than required. The value 128 can be replaced by 96. 
- [ ] B) The expression allocates less memory than required. The value 128 can be replaced by 160. 
- [ ] C) The expression is redundant and can be removed to save gas 
- [ ] D) The expression is not `memory-safe` assembly in this context 
<details>
<summary>Answer</summary>
B
<p>
A/B: While the expression allocates sufficient memory to ensure that later allocations won't overwrite the string, there's still an issue of dirty memory being returned when the actual string contents are read once the memory after the string is in use<br>
Loading 32 bytes to obtain the string's length at the _str_ pointer will work correctly: _0x0000000000000000000000000000000000000000000000000000000000000001_<br>
But loading 32 bytes to obtain the actual string's contents at _add(str, 32)_ will partially return data not belonging to the string: _0x31000000000000000000000000000000000000ffffffffffffffffffffffffff_<br>
To prevent this, the expression should allocate another 32 bytes, therefore a sum of 160 bytes instead of 128.<br>
C: Removing the expression would cause later allocations of memory to use the space where the string has been stored, causing it to be overwritten.<br>
D: This expression, as well as the rest of the inline assembly block, is memory-safe as already covered by the previous question.
</p>
</details> 

##### Q3 Select all true statements
- [ ] A) The expression `mstore(str, k)` at the beginning can be removed to save gas 
- [ ] B) The expression `mstore(add(str, k), char)` can be replaced by an equivalent `mstore8(...)` to simplify the code 
- [ ] C) The final expression `mstore(str, sub(78, k))` can be removed to save gas 
- [ ] D) The function does not return the correct output for `n = 2**256 - 1` 
<details>
<summary>Answer</summary>
A,B
<p>
A: The expression storing the string's length at the beginning can indeed be removed to save gas as it's supposed to be overwritten by the actual string's length at the function's end.<br>
B: As explained in one of the previous answers, _MSTORE_ always writes 32 bytes, which is quite unnecessary (as we're only writing one byte each round) and makes the algorithm more complicated to understand. Using _MSTORE8_ this could be significantly simplified as it would only touch a single byte in memory, just as needed by this algorithm.<br>
C: The expression storing the final string's length shouldn't be removed as the string would end up having a length of 0 according to the _str_ pointer pointing at the 32 zero-bytes before the actual string value starts.<br>
D: The function actually does return the correct output for the maximum uint256 integer value.
</p>
</details> 

##### Q4 Select all true statements
- [ ] A) The function correctly cleans all necessary memory regions 
- [ ] B) Solidity will correctly be able to handle the string returned by the function 
- [ ] C) The last bits of memory in the string may be dirty 
- [ ] D) None of the above 
<details>
<summary>Answer</summary>
B,C
<p>
A: The function does not properly clean all the memory regions that it accesses, this allows dirty bits to remain. Remember that using memory that is still marked "free" according to the free-memory-pointer doesn't guarantee that it hasn't been used as a temporary memory by previous operations. Based on the previous _toString(1)_ example, here's how the memory would look like if all of the "free" bytes have been set to 0xff before the function was called...<br>
B: Despite all of the function's imperfections, it'll still be able to appear to be working perfectly fine outside of assembly thanks to Solidity's cleanup measures.<br>
C: This once again references the issue of insufficient memory being allocated (See Q2) causing later memory allocations to overlap with the end of the string.
</p>
</details> 

##### Q5 Select all true statements
- [ ] A) The re-entrancy lock is always unnecessary as it’s never possible to re-enter the contract 
- [ ] B) Calls to `_delegate` are correctly protected for re-entrancy 
- [ ] C) The re-entrancy lock is correctly unlocked in some cases 
- [ ] D) The re-entrancy lock is correctly unlocked in all cases 
<details>
<summary>Answer</summary>
C
<p>
A: This is an abstract contract, meaning it'll need be inherited by another which may have more functions, functions that may allow reentering. Furthermore, the implementation contract's functions are unknown as well and they too may allow to re-enter. Based on the available information it's not possible to come to the conclusion that it's "never possible to re-enter".<br>
B: The fact that it's "protecting" against reentrancy is more of an happy accident of the bug. It'll prevent reentrancy in practice, but it'll also deadlock the contract forever. With that being the case it cannot be said that calls to the delegation function are "correctly protected".<br>
C/D: The function will always either _revert_ or _return_. Returning within assembly is a bit different than returning in Solidity: The _RETURN_ opcode will end the current EVM execution context immediately and return the specified data to the external caller. This means that the code in _nonReentrant_ responsible for unlocking is practically unreachable, leaving the contract in a deadlock state. It may still seemingly correctly unlock if the implementation contract's storage variables re-use the same storage slot and unlock it from there. In the reverting case the code responsible for unlocking will be skipped, as intended, and instead the contract is unlocked by the fact that all changes done to the contract's state are reverted.
</p>
</details> 

##### Q6 Select all true statements
- [ ] A) The assembly block is correctly marked as `memory-safe` 
- [ ] B) The assembly block will always violate the memory requirements needed for `memory-safe` blocks 
- [ ] C) In some cases, the assembly block will not violate the requirement needed for `memory-safe` blocks 
- [ ] D) None of the above 
<details>
<summary>Answer</summary>
C
<p>
A: The assembly block is purposely not memory-safe (it takes "full control of memory") and the reason it gives for it in the first inline comment is that this is not an issue as "it will not return to Solidity code". Meaning that it can do whatever it wants as this EVM context will end after its execution. But that isn't actually true anymore due to the usage of the _nonReentrant_ modifier. Such an inconsistency would be a big hint that something smells here during a secure code review.<br>
B/C: It won't violate the memory requirements as long as the _calldata_ and the _returndata_ is empty or fits into the memory's scratch space.
</p>
</details> 

##### Q7 Select all true statements
- [ ] A) The expression `calldatacopy(0, 0, calldatasize())` violates `memory-safe` assembly annotation 
- [ ] B) The expression `returndatacopy(0, 0, returndatasize())` violates `memory-safe` assembly annotation 
- [ ] C) The expression `delegatecall(gas(), implementation, 0, calldatasize(), 0, 0)` violates `memory-safe` assembly annotation 
- [ ] D) The expression `return(0, returndatasize())` violates `memory-safe` assembly annotation 
- [ ] E) The expression `revert(0, returndatasize())` violates `memory-safe` assembly annotation 
- [ ] F) None of the above 
<details>
<summary>Answer</summary>
A,B
<p>
A: Copies _calldata_ into memory starting in the scratch space. If calldata doesn't fit it'll violate memory-safety.<br>
B: Does the same, but with the data returned from the external delegate-call.<br>
C: The delegate-call operation only reads from memory and the actual execution happens within a fresh EVM context. No violations can happen here.<br>
D/E: Both operations only read from memory and immediately end the current EVM execution context.
</p>
</details> 

##### Q8 Select all true statements
- [ ] A) `delegatecall` can never re-enter as the state is shared 
- [ ] B) `delegatecall` proxies without proper access controls may be prone to `selfdestruct` 
- [ ] C) Proxies are typically used to save deploy-time gas costs 
- [ ] D) Proxies can be used to prevent contract size limit issues
<details>
<summary>Answer</summary>
B,C,D
<p>
A: Nonsensical filler option.<br>
B: It's true that delegate-call operations are very dangerous, especially if an attacker is able to get control over the destination address which could be a self-destructing contract.<br>
C: Extremely small proxies, usually referred to as clones, can be used to deploy code only once and re-use it over and over again.<br>
D: Proxies may delegate to multiple implementations allowing the code size limit to be bypassed.
</p>
</details> 