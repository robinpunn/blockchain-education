### [Race 23](https://veridise.notion.site/veridise/RACE-23-Answers-d63cb0b5373f43f0ba43612e89596547)

#### Q1
> A call to PrivateToken.transfer may revert for which, if any, of the following reasons?
- [ ]  A. The current root does not match either addProof.oldRoot or subProof.oldRoot.
- [ ]  B. The amounts declared in addProof and subProof do not match.
- [ ]  C. A nullifier has been used in the past.
- [ ]  D. Either addProof or subProof does not verify.
- [ ]  E. None of the above
<details>
<summary>Answer</summary>
B,C,D
<p>
B, C and D all correspond to requires in burn, but there is no root check so A must be false
</p>
</details> 

#### Q2
> Which, if any, of the following statements hold with respect to MerkleTreeAdd?
- [ ]  A. The MerkleTreeAdd circuit will only verify computations where MerkleTreeAdd.oldVal is in the merkle tree with root MerkleTreeAdd.oldRoot.
- [ ]  B. The MerkleTreeAdd circuit will only verify computations where the leaf is at the location given by MerkleTreeAdd.index in the merkle tree with root MerkleTreeAdd.oldRoot.
- [ ]  C. The MerkleTreeAdd circuit will only verify computations where the root calculated by ComputeTreeRoot matches MerkleTreeAdd.oldRoot.
- [ ]  D. The MerkleTreeAdd circuit will only verify computations where the sum of MerkleTreeAdd.oldVal and MerkleTreeAdd.amount are in the merkle tree with root MerkleTreeAdd.newRoot.
- [ ]  E. None of the above

<details>
<summary>Answer</summary>
C
<p>
A is not correct because of the unconstrained mux.

B is not correct for the same reason.

C is correct because of a check in MerkleTreeAdd, which ensures the root matches.

D is not correct because of the unconstrained mux.
</p>
</details>

#### Q3
> Which, if any, of the following statements hold with respect to a user's balance?
- [ ]  A. The balance associated with a user's ID is private and cannot be known after funds have been allocated to it.
- [ ]  B. A user must know the balance associated with an ID to spend funds from it.
- [ ]  C. An index in the merkle tree is tied to a specific address so the associated balance corresponds to that address's balance.
- [ ]  D. If the root of the tree doesn't change, a user can always show that their balance is contained in the tree.
- [ ]  E. None of the above

<details>
<summary>Answer</summary>
D
<p>
There are two privacy leaks that allow someone to learn a user's balance, so A is not correct. B is not correct because of the unconstrained mux. C is not correct because there is no logic that ties an address to an index. D is correct because if the root has not changed, then someone's merkle proof must remain valid.
</p>
</details>

#### Q4
> Which, if any, of the following statements hold with respect to how a user's balance may change?
- [ ]  A. Upon a burn, a user's balance will either decrease or remain the same.
- [ ]  B. Upon a mint, a user's balance will either increase or remain the same.
- [ ]  C. Upon a transfer, the sum of user balances stored in the tree is constant.
- [ ]  D. During a mint, burn and transfer, only the balances at the indicated indices will change.
- [ ]  E. None of the above
<details>
<summary>Answer</summary>
E
<p>
None of these hold since the balance values may overflow and the unconstrained mux.
</p>
</details>

#### Q5
> Which, if any, of the following signals are under-constrained (i.e. a signal may be assigned to at least two different values while keeping the circuit inputs constant)?
- [ ]  A. MerkleTreeSub.newRoot
- [ ]  B. ComputeTreeRoot.hashes[0]
- [ ]  C. MerkleTreeAdd.nullifier
- [ ]  D. MerkleTreeSub.oldRootCalc.root
- [ ]  E. None of the above
<details>
<summary>Answer</summary>
A
<p>
A is under-constrained because of the unconstrained mux. B is not under-constrained because of the `===` constraint at the end of the circuit. C is not underconstrained due to `<==`. Finally, D is not under-constrained since it is explicitly constrained to an input in MerkleTreeSub.
</p>
</details>

#### Q6
> Which, if any, of the following may occur during a burn?
- [ ]  A. A user may burn more funds than they own.
- [ ]  B. The new computed root will not be saved.
- [ ]  C. The balances stored in the merkle tree may be arbitrarily manipulated.
- [ ]  D. Every user can burn their entire balance.
- [ ]  E. None of the above
<details>
<summary>Answer</summary>
A,C
<p>
A holds due to the overflow. 

B does not hold since burn does store the new root.

C holds due to the under-constrained mux. 

D does not hold since the nullifier is tied to user balances, so only one user may have balance 0.
</p>
</details>

#### Q7
> With respect to the nullifier, which, if any, of the following statements hold?
- [ ]  A. The nullifier leaks information about a user's balance.
- [ ]  B. The nullifier will prevent users from submitting the same proof twice.
- [ ]  C. If a nullifier is used by some user, another user will likely not be affected.
- [ ]  D. The computed value of the nullifier is under-constrained.
- [ ]  E. None of the above

<details>
<summary>Answer</summary>
A,B
<p>
A holds because it hashes the balance directly and so if two nullifiers conflict,  you have learned something about the balance of the user who used it previously.

B is correct since the same proof will result in the same balance and therefore the same nullifier. 

C is not correct due to the issue identified in A. 

D is not correct because the nullifier is explicitly constrained to be the hash of two input values.
</p>
</details>

#### Q8
> Which, if any, of the following correspond to potential attacks that can be used against the protocol?
- [ ]  A. Replay Attack
- [ ]  B. Denial of Service
- [ ]  C. Under-constrained Signal Manipulation
- [ ]  D. Arithmetic Overflow
- [ ]  E. None of the above

<details>
<summary>Answer</summary>
B,C,D
<p>
As discussed in Q7, you cannot replay proofs so A is not correct.

B is correct due to the balance issue from Q6, someone can perform a Dos.

C is correct as there are under-constrained signals that impact the output of the circuit.

D is correct since since the balance add and sub may overflow.
</p>
</details>