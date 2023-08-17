### [Race 6](https://ventral.digital/posts/2022/5/16/secureum-bootcamp-epoch-may-race-6)

---

##### Q1 The security concern(s) with _InSecureumLand_ is/are** 
- [ ] A) Single-step ownership change 
- [ ] B) Incorrectly implemented KYC check using Merkle proofs 
- [ ] C) Missing time-delayed change of critical parameters 
- [ ] D) Accidentally sent Ether gets locked in contract
<details>
<summary>Answer</summary>
A,C
<p>
A. Ownership management is inherited from OpenZeppelin's `Ownable` abstract contract, which only allows for single-step ownership change. If the ownership is mistakenly changed to an incorrect address, it could be permanently lost.<br>
B. Contract appears to correctly make use of OpenZeppelin's `MerkleProof` library for KYC purposes.<br>
C. Considering attributes like `operator` a critical parameter, it can indeed be argued that a time-delay would improve the contract's security.<br>
D. Contract owner is be able to call the `withdraw()` function to extract any accidentally sent ether.
</p>
</details>

##### Q2 The security concern(s) with _InSecureumLand_ _setOperator()_ is/are** 
- [ ] A) Missing zero-address validation 
- [ ] B) Missing event emission 
- [ ] C) Incorrect modifier 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,B
<p>
A. There's indeed no check for zero-addresses, which could accidentally lead to no one being the operator. This would have little impact though, since the owner is able to correct the mistake by calling the function again/<br>
B. There's also no event emitted when the operator is changed. This makes monitoring the contract for critical changes difficult.<br>
C. Assuming that the intention is that only the owner should be able to update the operator, there seems to be no problem with the modifier that was chosen.
</p>
</details>

##### Q3 The security concern(s) with _InSecureumLand_ _mintLands()_ is/are
- [ ] A) Minting could exceed max supply 
- [ ] B) Minting could exceed _maxMintPerTx_ 
- [ ] C) Minting could exceed _maxMintPerAddress_ 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A
<p>
A. While the function checks `currentNumLandsMintedPublicSale` for whether the maximum supply has been exceeded, it doesn't actually ever increase this variable after minting. So it'll be possible to continue minting beyond the `MAX_PUBLIC_SALE_AMOUNT` value.<br>
B. The `maxMintPerTx` value appears to be correctly checked against the `numLands` parameter.<br>
C. The `maxMintPerAddress` value appears to be correctly checked against the overall amount of tokens that'll have been minted by the sender.
</p>
</details>

##### Q4 Missing threshold check(s) on parameter(s) is/are a concern in
- [ ] A) _mintLands_ 
- [ ] B) _startPublicSale_ 
- [ ] C) _contributorsClaimLand_ 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B,C
<p>
The `startPublicSale` should have some sanity checks for passed parameters like `_publicSaleStartPrice` and `_publicSaleEndingPrice`, especially since these cannot be corrected once set. The `contributorsClaimLand` function doesn't ensure the `amount` parameter, of how many tokens should be claimed for the contributor, is actually lower or equal to the amount of tokens they should be able to claim according to `contributors[msg.sender]`. It also doesn't update this amount allowing the contributor to claim the same amount multiple times.
</details>

##### Q5 The security concern(s) with _InSecureumLand_ contributors claim functions is/are
- [ ] A) Anyone can call _startContributorsClaimPeriod_ 
- [ ] B) Anyone can call _stopContributorsClaimPeriod_ 
- [ ] C) Anyone can call _contributorsClaimLand_ 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
C
<p>
The first two functions can only be called by the operator. The `contributorsClaimLand` function appears to be only callable by contributors. But when looking at the `onlyContributors` modifier, callers are considered contributors even when they have not made any contribution (`contributors[_contributor] >= 0`). This error effectively allows anyone to call the `contributorsClaimLand` function.
</details>

##### Q6 The security concern(s) with _InSecureumLand_ random number usage is/are
- [ ] A) It depends on miner-influenceable _block.timestamp_ 
- [ ] B) It depends on miner-influenceable _blockhash_ 
- [ ] C) It depends on deprecated Chainlink VRF v1 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
C
<p>
It doesn't make use of miner-influenceable values for randomness. But it does indeed make use of a deprecated version of Chainlink's VRF. Projects should aim to make use of the most recent stable version of their dependencies before deployment.
</details>

##### Q7 The documentation/readability concern(s) with _InSecureumLand_ is/are
- [ ] A) Stale comments 
- [ ] B) Missing NatSpec 
- [ ] C) Minimal inlined comments 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B,C
<p>
There are no NatSpec comments at all, and the few inline comments that exist mostly just repeat what the code already states instead of explaining what is going on and what is the intention.
</details>

##### Q8 Potential gas optimization(s) (after appropriate security considerations) in _InSecureumLand_ is/are
- [ ] A) Removing _nonReentrant_ modifier if mint addresses are known to be EOA 
- [ ] B) Using __mint_ instead of __safeMint_ if mint addresses are known to be EOA 
- [ ] C) Using _unchecked_ in for loop increments 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,B,C
<p>
A. By checking `msg.sender == tx.origin` it can be known that the mint address, which is the mint function's caller, is an EOA, an account with a keypair and no bytecode. With that, transfer hooks are certain to not be triggered which means that `nonReentrant` can safely be omitted in this case.<br>
B. If the mint address is known to be an EOA, `_mint` can be directly called, instead of `_safeMint` which first checks whether the receiver implements the hook function `onERC721Received`. An EOA has no bytecode, which means it's not possible that it implements this interface. A check like this also isn't necessary for EOAs since tokens cannot get stuck in them as they could in contracts.<br>
C. Most loops increment with `++i` for which the solidity compiler will add overflow checks that cost additional gas. But the loop conditions (eg. `i < alphaTokenIds.length`) already ensures no overflow can happen. Therefore using an unchecked block around the increment can reduce gas cost by removing the unnecessary check. To implement this would require using a different loop though, since adding an unchecked block around the `for` loops primary expression would cause a compiler error.
</details>