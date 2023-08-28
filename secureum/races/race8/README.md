[Race 8](https://ventral.digital/posts/2022/7/25/secureum-bootcamp-epoch-july-race-8)

##### Q1 Which of the following is/are true?
- [ ] A) NFT ownership is tracked by __ownerOf_ 
- [ ] B) NFT balance is tracked by __balanceOf_ 
- [ ] C) NFT approvals are tracked by _getApproved_ 
- [ ] D) NFT operator can transfer all of owner’s NFTs
<details>
<summary>Answer</summary>
A,B,C,D
<p>
The variables `_ownerOf`, `_balanceOf` and `getApproved` indeed keep track of the mentioned values.<br>
And NFT operators are by definition able to transfer all NFTs of the owners that elected them to be their operators.
</p>
</details>
##### Q2 _InSecureumERC721_ recognizes the following role(s)
- [ ] A) Owner 
- [ ] B) Spender (Approved address) 
- [ ] C) Operator 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,B,C
<p>
This is quite apparent from ERC721 implementation parameter names. They can also be found in the [EIP721 spec](https://eips.ethereum.org/EIPS/eip-721).
</p>
</details>
##### Q3 The security concern(s) addressed explicitly in __mint_ include
- [ ] A) Prevent minting to zero address 
- [ ] B) Prevent reminting of NFTs 
- [ ] C) Transparency by emitting event 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,B,C
<p>
	The `_mint()` function addresses both A and B with the first two requires. Also C is correct since the emission of the Transfer event allows for easy tracking of mints and therefore transparency.
</p>
</details> 
##### Q4 The security concerns in __burn_ include** 
- [ ] A) Anyone can arbitrarily burn NFTs 
- [ ] B) Potential integer underflow because of _unchecked_ 
- [ ] C) Incorrect emission of event 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A
<p>
It appears that the `_burn()` function was intended to be internal (based on the underscore prefix) but is actually external which allows for A.<br>
Answer B is not a concern thanks to the ownership check ensuring that it cannot happen.<br>
The emission of the event follows the event declaration and therefore C is not a concern either.
</p>
</details> 
##### Q5 The security concern(s) addressed explicitly in __safeMint_ include
- [ ] A) Validating if the recipient is an EOA 
- [ ] B) Ensuring that the recipient can only be an EOA 
- [ ] C) Validating if the recipient is an ERC721 aware contract 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,C
<p>
This function ensures that if (A) the recipient is an EOA the mint functions normally thanks to the `to.code.length == 0` check, but if (C) the recipient is a contract (non-EOA) it must be "ERC721 aware" by implementing the `ERC721TokenReceiver`interface.
</p>
</details> 
##### Q6 Function _approve_
- [ ] A) Allows the NFT owner to approve a spender 
- [ ] B) Allows the NFT spender to approve an operator 
- [ ] C) Allows the NFT operator to approve a spender 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,C
<p>
The require shows that only (A) the NFT owner and (C) the operator that the owner gave access to manage all their NFTs have the ability to approve spenders. A spender cannot approve other spenders and especially not operators.
</p>
</details> 
##### Q7 Function _setApprovalForAll_
- [ ] A) Approves _msg.sender_ to manage operator’s NFTs 
- [ ] B) Gives everyone approval to manage _msg.sender_’s NFTs 
- [ ] C) Revokes everyone’s approvals to manage _msg.sender_’s NFTs 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
D
<p>
The `setApprovalForAll()` function authorizes an address (called the operator) to manage all of the owner's NFTs in the contract. A, B and C are therefore incorrect.
</p>
</details> 
##### Q8 The security concern(s) in _transferFrom_ include
- [ ] A): Allowing the _msg.sender_ to transfer any NFT 
- [ ] B) NFTs potentially stuck in recipient contracts 
- [ ] C) Potential integer underflow 
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,B,C
<p>
The `transferFrom()` function does not check ownership of the NFT. This allows any `msg.sender` to overwrite the current owner, basically allowing a transfer of any NFT.<br>
The `safeTransferFrom()` function ensures that NFTs will not be stuck in recipient contracts that don't communicate that they are able to handle them. This issue still exists for the normal `transferFrom()` function though for backwards compatability reasons.<br>
Due to the missing ownership check, it's possible for the balance of the sender to underflow.
</p>
</details> 