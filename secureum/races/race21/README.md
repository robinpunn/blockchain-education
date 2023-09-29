### [Race 21](https://ventral.digital/posts/2023/9/5/race-21-of-the-secureum-bootcamp-epoch-infinity)

#### Questions
##### Q1 Which of the following statement(s) is/are true about the _burry()_ function?
- [ ]  A. The function always reverts when an out of bounds index (_idx_) is passed
- [ ]  B. The function always reverts when _localBunnies[idx].rabies_ is not Rabies.Symptomatic
- [ ]  C. The function always reverts when less than 7 days have passed since the Rabbit was minted
- [ ]  D. None of the above
<details>
<summary>Answer</summary>
A
<p>
A: Solidity automatically checks for out-of-bounds index access and will revert.

B/C: There is an error in the function, the _&&_ should be _||_ as it should revert when either side is true. At the moment it would require both conditions to be true in order to revert.
</p>
</details> 

##### Q2 [clones-with-immutable-args](https://ventral.digital/posts/2023/9/5/%E2%80%9Dhttps://github.com/wighawag/clones-with-immutable-args%E2%80%9D) are used to deploy ResearchLabs. Which of the following statement(s) about this pattern is/are true?
- [ ]  A. Arguments originating from the proxy to the implementation are immutable
- [ ]  B. All arguments passed to the implementation are immutable
- [ ]  C. Gas costs are lower when cloning versus deploying new implementations
- [ ]  D. The implementation can be _selfdestruct_’ed by a malicious caller
<details>
<summary>Answer</summary>
A,C,D
<p>
This is based on the Astaria disclosure ([described here by @devtooligan](https://twitter.com/devtooligan/status/1671310173896585216). Don’t let the name fool you, the proxy is where args are immutable; the implementation receives these arguments as calldata.

When called by the proxy, everything works as intended. When the implementation is called directly, the caller controls the arguments and _delegatecalls_ become particularly problematic.

A: As long as the proxy is involved, the arguments originating directly from it are indeed immutable.

B: The proxy may receive calldata from the _msg.sender_. It appends the immutable arguments to this before forwarding the call.

C: This is true because the bytecode of a proxy is usually much smaller and therefore cheaper to deploy than the actual implementation it points to (proxy clone pattern)

D: The ResearchLab contract can be directly called (without a proxy passing a valid immutable argument). This means that the address it delegate-calls to can be pointed to a contract that makes it self-destruct.
</p>
</details> 


##### Q3 The _adopt()_ function has a random calculation. Which of the following statement(s), if any, about the source of randomness is/are true?
- [ ]  A. By using Flashbots a caller can guarantee that _Bunny.rabies == Rabies.None_
- [ ]  B. There is an error present that can be corrected by hashing _randomSeed_ before using it
- [ ]  C. Integer overflow introduces unexpected behavior in this function
- [ ]  D. None of the above
<details>
<summary>Answer</summary>
D
<p>
There is certainly a problem with the randomSeed, it is not random at all. The use of _blockhash_ for the current block returns 0 (see [evm.codes](https://www.evm.codes/?fork=shanghai)) meaning randomSeed behaves more like a constant than a random number.

A: Misdirection: Not block hash will always be 0, can't be influenced using Flashbots.

B: Misdirection: Hashing a constant value will just return another constant.

C: Misdirection: No overflows possible in this Solidity version without the use of "unchecked" blocks
</p>
</details> 


##### Q4 Which of the following statement(s) is/are true about the _adopt()_ function?
- [ ]  A. Minting does not take place unless precisely _ADOPTION_PRICE_ is paid in _lidoToken_
- [ ]  B. _lidoToken_ is a known token and is immutable in this contract, therefore _transferFrom_ is safe to use
- [ ]  C. In some but not all cases the _burry()_ function can cause the _adopt()_ function to be DOS’d
- [ ]  D. Duplicate bunnies array entries will be produced if they burn their Rabbits NFT using the Rabbits ERC721 contract directly instead of using the _RabidRabbits.burry()_ function
<details>
<summary>Answer</summary>
C
<p>
A/B: The use of Lido token introduces [MiniMe](https://etherscan.io/token/0x5a98fcbea516cf06857215779fd812ca3bef1b32#code) Token to the system. These tokens do not revert on failure and instead return false. Even though a user cannot introduce a problematic token to the system, we have caused the issue ourselves in the constructor. The unchecked return value, i.e. not using _safeTransferFrom_, allows calls to succeed even when no tokens are transferred.

C: _burry()_ reduces the length of the bunnies storage array. In the adopt function bunnies.length is used to decide which token id to mint. If any but the last bunnies index is buried, the array length decrements and the next call to adopt fails due to attempting to mint a duplicate token id.

D: While the array entries of those burned bunnies will remain, this won't cause duplicates as the array length isn't decreased, and therefore later bunnies will have a non-duplicate id.
</p>
</details> 


##### Q5 _TrulyRandomOracleMock.oracleResult()_ calls _calculateResult()_ passing a struct in memory. _calculateResult()_ attempts to modify the memory struct and does not return a value. Finally, _revealResearchResult()_ writes the entropy struct to storage; this is going to:
- [ ]  A. Silently fail to update the _newEntropy_ struct and will store the original
- [ ]  B. Correctly update and then store the _newEntropy_ struct
- [ ]  C. Revert at runtime
- [ ]  D. Fail at compile time
<details>
<summary>Answer</summary>
B
<p>
When an internal function operates on memory, memory is updated in place. Contrasted with external calls where memory may be passed but is not updated in the calling contract.

A/B: The _oracleResult_ function calls _calculateResult_ and passes it the entropy state variable's value as a reference in memory. Since _calculateResult_ is an internal function, it's able to adjust the _Entropy_ values as _oracleResult_ uses the same memory. This updated memory reference variable is then used to update the value in storage.

C/D: Misdirecting answers. It doesn't revert and compiles fine.
</p>
</details> 


##### Q6 Which of the following statement(s) about the constructor is/are true?
- [ ]  A. Gas can be saved by not double casting _lidoToken = IERC20(_lidoToken)_
- [ ]  B. Gas can be saved by making _rabbitToken_ immutable
- [ ]  C. Gas can be saved by storing _cloneArgsTarget_ as bytes
- [ ]  D. __lidoToken_ as an argument helps in deploying on multiple networks
<details>
<summary>Answer</summary>
B,D
<p>
A: At the bytecode level, casting with is a noop and incurs no gas.

B: Immutable is cheaper than reading from storage

C: bytes would be a storage array (immutable variables cannot have a non-value type) meaning we would incur sload costs.

D: True, we can reference bridged Lido on other networks when deploying there. Further, testing and fuzzing benefits exist when not hardcoding addresses.
</p>
</details> 


##### Q7 Which of the following statement(s) is/are true about the _burry()_ function?
- [ ]  A. A user can DOS the _burry()_ function for their _idx_ if they burn their Rabbits NFT using the Rabbits ERC721 contract directly instead of using the _RabidRabbits.burry()_ function
- [ ]  B. The _Bunny.researchLabs_ array is correctly reset for the deleted _idx_
- [ ]  C. The entire _burry()_ function can be DOS’d resulting in all calls to this function failing
- [ ]  D. None of the above
<details>
<summary>Answer</summary>
A,B,C
<p>
A: This function attempts to burn, meaning that if a token is burned already, calls to burry will revert.

B: While possibly high in gas costs, the array is cleared and the index may be reused in the adopt function.

C: Whatever we thought we were doing to be efficient in our array handling is negated by loading the entire array into memory with _Bunny[] memory localBunnies = bunnies;_. With at least 5 storage reads per array entry, after a few thousand entries in the array, the block gas limit is hit trying to load it all into memory.
</p>
</details> 


##### Q8 Which of the following statement(s) is/are true about _ResearchLab.revealResearchResult()_ and the functions it interacts with?
- [ ]  A. The Solidity compiler will fail to compile
- [ ]  B. The storage for _entropy_ is updated
- [ ]  C. The storage for _researchEndeavors[idx]_ is updated
- [ ]  D. None of the above
<details>
<summary>Answer</summary>
B
<p>
A: Misdirection: This compiles without issues.

B/C: This question is included as a reminder to be aware of storage and memory context when calling between functions. To step through the functions and argument passing: _revealResearchResult_ references _endeavor_ in storage then calls _trulyRandomExternalCall_ which loads the data into memory. _TrulyRandomOracleMock.oracleResult_ is _delegatecall_’ed again with the _endeavor_ data passed as memory. Delegatecall means _TrulyRandomOracleMock.oracleResult_ has access to all of our storage, including _entropy_ which it updates in storage. _endeavor_ on the other hand is in memory, meaning _researchEndeavors[idx]_ is not updated at all.
</p>
</details> 
