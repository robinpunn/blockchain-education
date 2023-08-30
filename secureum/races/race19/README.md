### [Race 19](https://ventral.digital/posts/2023/7/3/race-19-of-the-secureum-bootcamp-epoch-infinity)

---

##### Q1 The deployment concern(s) here for different EVM-compatible chains is/are
- [ ] A) `receive` method behavior might be undefined 
- [ ] B) The presence of `ecrecover` precompile is potentially dangerous 
- [ ] C) Not all opcodes in the bytecode are guaranteed to be supported 
- [ ] D) None of the above 
<details>
<summary>Answer</summary>
C
<p>
A: The _receive_ method (as well as the _fallback_ method) is a Solidity construct and won't be influenced by different EVM versions or alternative chains.<br>
B: The mere presence of _ecrecover_ by itself is not potentially dangerous in regards to the deployment of these contracts. It certainly is a critical thing to thoroughly review contracts like these though.<br>
C: Full EVM-compatibility may not be guaranteed with all chains since they might be slower to adapt newly introduced changes. For example, Ethereum recently added the PUSH0 opcode to the EVM and the Solidity compiler will make use of it starting with version 0.8.20. Arbitrum has not added PUSH0 to their EVM yet causing issues when such compiled contracts are attempted to be deployed there.
</p>
</details> 

##### Q2 The security concern(s) in `WalletFactory` is/are
- [ ] A) ETH funds may get stuck in it forever 
- [ ] B) The `deploy` method is not marked as `payable` 
- [ ] C) No access control on wallet deployment 
- [ ] D) Deployment may silently fail 
<details>
<summary>Answer</summary>
A,D
<p>
A: Generally, one could inject funds into _WalletFactory_ using self-destruct and coinbase. But in this specific case it could happen because the success-vaule of the _send()_ method is not checked when the ether is transferred to the _Wallet_ after its deployment with _deployAndLoad()_. The transfer could fail and then the funds would get stuck in the factory. To fix this, the _sendValue()_ method of the already included _Address_ library should be used instead.<br>
B: There's no need for the _deploy()_ method to be payable, even if it's internally called by a payable function. That is because the "must not have value"-check is part of the function selector and would be skipped during an internal call. When called publicly, there's also no need for it to be payable since it does not deal with any value itself.<br>
C: Assuming that anyone is free to use the factory to deploy their wallet (as it commonly is), there's no concern with people deploying wallets without access control.<br>
D: The _create2_ call would return the zero-address if the deployment of a _Wallet_ via the factory failed. In that case _deployAndLoad()_ would burn any _msg.value_ by sending it to the zero-address.<br>
Participants have pointed out that, with the missing send-success-check alone within the context of the code as-is, funds cannot get stuck. That may be correct (until proven otherwise), but it's still a breach of a best practice that would've cost very little and may have prevented a loss of funds. We'd recommend reporting issues like these during an audit, even if there's no obvious way to exploit them.
</p>
</details> 

##### Q3 Design flaw(s) of `Wallet` is/are
- [ ] A) Missing wallet owner role and appropriate access control 
- [ ] B) Inability to rescue stuck tokens 
- [ ] C) Assembly usage is unsafe for the Yul IR pipeline 
- [ ] D) Calling a `payable` method in a for-loop 
<details>
<summary>Answer</summary>
A
<p>
A: The wallet has no _owner_ roles and basically no access control at all. The signature check may look like such, but it has no real effect at all since it would accept any signatures either signed by the _msg.sender_ or by the specified _transaction.from_ which can be freely chosen.
B: The _execute()_ function allows making arbitrary external calls which would allow to rescue any stuck tokens. (Or in this case, allows stealing them.)
C: The usage of assembly cannot be called unsafe, but it is indeed not optimal since the inline assembly-blacks are not marked as _memory-safe_, preventing the optimizer from doing its best job.
D: This isn't an issue since _msg.value_ is not relied upon.
</p>
</details> 

##### Q4 The security concern(s) with hashing of `transaction` parameter in `execute` is/are
- [ ] A) Cross-contract replay attacks 
- [ ] B) Cross-chain replay attacks 
- [ ] C) `keccak256` hash collision attacks 
- [ ] D) Reentrancy attacks 
<details>
<summary>Answer</summary>
B
<p>
A: Cross-contract replay would not be possible thanks to the inclusion of _address(this)_ (the _Wallet_ contract's address) within the message hash.<br>
B: Cross-chain replay attacks are possible due to the missing _block.chainid_ within the message hash. This would enable an attacker to replay a published signed transaction on another chain, potentially stealing tokens.<br>
C: The way the message-hashing has been implemented, a hash collision attack is very unlikely (assuming the attacker has no supercomputers). If the code used _encodePacked()_ instead and used variable-length values in other places than the end of the message, an attack vector would become more likely.<br>
D: While it's true that CEI is not followed and that could lead to issues, the question's context only concerns the hashing of _transaction_ parameter in _execute_ – therefore the fact that reentrancy attacks would be possible, is of no relevance here. This option was purposefully misleading and Question 7 was intended to check whether the reentrancy issue was noticed.
</p>
</details> 

##### Q5 If the hashed payload in `execute` were to exclude a nonce, the security concern(s) with `ecrecover` would be
- [ ] A) Signature malleability by flipping the “s” or “v” values 
- [ ] B) Signature malleability by using compact signatures 
- [ ] C) Signature malleability by hash collisions 
- [ ] D) Forcefully reverting transactions 
<details>
<summary>Answer</summary>
A,B
<p>
A: Due to the symmetric nature of Elliptic Curve Cryptography, every signature has another valid value signing the same message (by flipping to the other side of the curve by changing the value of _v_). Similarly, there's another "lower _s_" value that would be accepted as a valid signature for the same message and can be calculated from the original signature. ECDSA libraries like OpenZeppelin's will prevent this from being exploited.<br>
B: ERC-2098 introduced so called "compact signatures" which are now accepted by _ecrecover_ as well. A known signature can be compacted and still stay valid for the same message. Due to this, malleability is inherent to ECDSA signatures in Ethereum, and that is why one should never rely on them as unique identifiers (and use nonces instead).<br>
C: Nonsensical option.<br>
D: Nonsensical option.<br>
**As reported by one of the participants, this answer wasn't quite correct: Compact signatures wouldn't work in this example, as in those, the _v_ value is taken from the 64th byte, not the 65th. So B should not have been a correct answer.**
</p>
</details> 

##### Q6 The security concern(s) with `Wallet` is/are
- [ ] A) Ether sent to the contract will be stuck forever 
- [ ] B) Anyone can execute arbitrary calls 
- [ ] C) Anyone can steal the contract ETH balance 
- [ ] D) None of the above 
<details>
<summary>Answer</summary>
B,C
<p>
A: The _execute()_ function allows making raw calls with value. Therefore it would be possible to transfer ether and wouldn't be stuck forever.<br>
B: As already mentioned, _Wallet_ is missing proper authentication allowing anyone to execute arbitrary external calls.<br>
C: See the explanations of A & B.
</p>
</details> 

##### Q7 The nonce best practice(s) _not_ followed correctly is/are
- [ ] A) Nonce is not incremented before the low-level call 
- [ ] B) Nonce is not guaranteed to be included in the signature 
- [ ] C) Nonce is not incremented correctly on transaction execution 
- [ ] D) None of the above 
<details>
<summary>Answer</summary>
A,C
<p>
The if-clause that contains the external call would _return;_ before ever reaching the code that would increment the _nonce_. But even without that, the Checks-Effects-Interactions pattern is not followed which would allow a called contract to reenter and reuse the same transaction.
</p>
</details> 

##### Q8 The security concern(s) with `Wallet` contract related to ERC721 tokens is/are
- [ ] A) There is no way to get ERC721 tokens out of the contract 
- [ ] B) Failure to receive ERC721 tokens depending on the transfer method 
- [ ] C) Failure to receive any ERC721 tokens 
- [ ] D) Unauthorized burning of ERC721 tokens
<details>
<summary>Answer</summary>
B,D
<p>
A: Since arbitrary external calls are possible through the _execute()_ function, there's no worry of ERC721 tokens to get stuck.<br>
B: Because the _onERC721Received()_ method is missing, the contract would not be able to receive ERC721 tokens if the _safeTransfer()_ method would be used.<br>
C: A normal transfer of ERC721 that does not check for the hook/callback mentioned in B would still allow the contract to receive some tokens.<br>
D: Anyone can burn tokens, not only through the burn-specific methods that are missing access control, but also through arbitrary calls made through _execute()_.
</p>
</details> 