### [Race 7](https://ventral.digital/posts/2022/07/secureum-bootcamp-epoch-june-race-7)

##### Q1 The mint price of an _InSecureumApe_ is
- [ ] A) 0.0008 ETH 
- [ ] B) 0.008 ETH 
- [ ] C) 0.08 ETH 
- [ ] D) 0.8 ETH
<details>
<summary>Answer</summary>
D
<p>
We can see the price is determined by the `apePrice` constant in wei, by which the number of tokens to mint are multiplied by.<br>
The inline comment claims it to be `//0.08 ETH` but, knowing that ethereum has 18 decimals, we can check and realize the price actually 0.8 eth.<br>
The https://eth-toolbox.com/ website offers a quick way to convert between these denominations.<br>
It would've been a lot better if the code made use of denominations, this would've made the code much more readable and likely prevented the issue: `0.08 ether`.
</p>
</details>
##### Q2 The security concern(s) with InSecureumApe access control is/are
- [ ] A) Owner can arbitrarily pause public minting of InSecureumApes
- [ ] B) Owner can arbitrarily mint InSecureumApes
- [ ] C) Single-step ownership change
- [ ] D) Missing event emits in and time-delayed effects of owner functions
<details>
<summary>Answer</summary>
A,B,C,D
<p>
The `saleIsActive` state variable is checked within `mintApe()` can be toggled via the `flipSaleState()` by the owner at any time, without delay or warning.<br>
The `reserveApes()` function allows the owner to mint arbitrary amounts of tokens at any time even bypassing the `MAX_APES` maximum supply config set during construction.<br>
The `transferOwnership()` function inherited from OpenZeppelin's Ownable contract only ensures that ownership is not transferred to the zero-address, but it can be transferred in a single step to any other potentially invalid address.<br>
None of the functions using the `onlyOwner` modifier emit events or have any sort of time-delay for their action, due to this users can suffer from unwanted surprises that are difficult to monitor for.
</p>
</details>
##### Q3 The security concern(s) with _InSecureumApe_ constructor is/are
- [ ] A) Missing sanity/threshold check on _maxNftSupply_ 
- [ ] B) Missing sanity/threshold check on _saleStart_ 
- [ ] C) Potential integer overflow 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,B,C
<p>
None of the mentioned parameters are sanity/threshold checked which would allow accidental deployment with incorrect parameters that could be noticed too late, after money has already gone into the contract.<br>
Unlike in Solidity 0.8.x, integer overflows aren't automatically checked for in this version, so an extremely high `saleStart` value could indeed cause an integer overflow, although unlikely for sane values. The best practice is to use a SafeMath library here.
</p>
</details>
##### Q4 The total number of _InSecureumApe_s that can ever be minted is
- [ ] A) _maxApePurchase_ 
- [ ] B) _MAX_APES_ 
- [ ] C) _MAX_APES_ + 30 
- [ ] D) _type(uint256).max_
<details>
<summary>Answer</summary>
D
<p>
Since the `reserveApes()` function allows the owner to arbitrarily mint tokens without checking the `MAX_APES` variable, it's possible to mint as many tokens as the totalSupply variable can hold, which is the maximum value an uint256 can have.
</p>
</details>
##### Q5 The public minting of _InSecureumApe_s
- [ ] A) Must be paid the exact amount in Ether 
- [ ] B) May be performed 19 NFTs at a time 
- [ ] C) Uses __safeMint_ to prevent locked/stuck NFTs 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
B,C
<p>
The amount doesn't need to be paid exactly, more can be sent but shouldn't since any above this amount is kept by the protocol and not sent back.<br>
The contract doesn't correctly check how many tokens can be minted at a time, it should be `numberOfTokens <= maxApePurchase` to allow 20 as described.<br>
The contract indeed uses the `_safeMint()` function that'll ensure that if the receiver is a contract, it must correctly implement the `onERC721Received()` function, proving that the receiver is capable of handling NFTs and that they won't be stuck after receiving them.
</p>
</details>
##### Q6 The security concern(s) with _InSecureumApe_ is/are
- [ ] A) Use of a floating pragma and an older compiler version 
- [ ] B) Oracle price manipulation 
- [ ] C) Reentrancy allowing bypass of _maxApePurchase_ check 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,C
<p>
The best practice is to avoid floating pragmas for contracts to ensure that they're always tested with the same Solidity version throughout the entire development cycle until deployment.<br>
The contract does not make use of any oracles.<br>
Since `_safeMint()` is used and calls `onERC721Received()` on receiving contracts, a NFT receiver can indeed call back into the `mintApe()` function and bypass how many tokens can be minted within a single transaction. But this check can be bypassed by simply repeatedly calling `mintApe()` from a custom contract since the function doesn't ensure that only EOAs can call it.
</p>
</details>
##### Q7 The starting index determination
- [ ] A) Is meant to randomize NFT reveal post-mint 
- [ ] B) Can be triggered by the owner at any time 
- [ ] C) May be triggered only 9 days after sale start 
- [ ] D) Accounts for the fact that EVM only stores previous 256 block hashes
<details>
<summary>Answer</summary>
A,B,D
<p>
You can read about how this is used for post-mint reveal randomization in [this article](https://medium.com/web-design-web-developer-magazine/the-offset-approach-to-fair-nft-reveals-and-other-metadata-reveal-strategies-considerations-2e2c69e5c274).<br>
The 9-day delay of the `REVEAL_TIMESTAMP` variable can be overriden at any point in time, it can also be triggered earlier if the totalSupply matches `MAX_APES` exactly, or be triggered at any time by the owner via `emergencySetStartingIndexBlock()`.<br>
It accounts for the block hash access limitation by falling back to using the hash of the previous block instead.
</p>
</details>
##### Q8 Potential gas optimization(s) in _InSecureumApe_ is/are
- [ ] A) Caching of storage variables 
- [ ] B) Avoiding initializations of variables to default values of their types 
- [ ] C) Use of immutables 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,B,C
<p>
Whenever storage variables are read from multiple times, they should be cached in memory to safe gas. This is missing for `MAX_APES` in `mintApe()` and `startingIndexBlock` in `setStartingIndex()`.<br>
All state variables are zero-initialized by default, therefore there's no need to manually set `saleIsActive` to false, for example.<br>
The state variable `MAX_APES` is only set once during construction and should be immutable to save gas
</p>
</details>