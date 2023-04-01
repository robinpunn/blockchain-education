### Merkle Trees
- Merkle Trees are awesome! They allow us to verify if a piece of data is part of a larger data structure, without having all of the data within that structure.
- This means they can be used to check for inconsistencies in all kinds of distributed systems!
- For Blockchain, storing transactions as Merkle Trees allows us to look at a block and verify that a transaction was part of it by only having part of the data set!
> Remember that the data within a blockchain block is just a set of transactions.

#### ABCDEFGHIJ Merkle Tree
- In this tree each letter represents a hash, and combined letters represent concatenating hashes and hashing those together
```js
          Root
        /      \
    ABCD        EFGHIJ
     |          /    \
    ABCD     EFGH     IJ
    / \      /   \     |
   AB  CD   EF   GH   IJ
  / \  / \  / \  / \  / \
  A B  C D  E F  G H  I J
```
- To prove that the hash A is a part of the Merkle Root we don't need to know hash C or D, we just need to know hash CD. The necessary proof for A is:
```js
Hash(Hash(Hash(A + B) + CD) + EFGHIJ)
```
- Where we only need to know the hashes B, CD, and EFGHIJ to prove that A is in the merkle root.

#### Combine Two Leaves
- A merkle tree will take an array of leaf nodes, combining them together two at a time, layer-by-layer, until they are reduced to a single root node.
- This forms a tree-like structure of hashing.

#### Combination Function
- To simplify this merkle tree implementation and to make debugging easier, we'll pass a concatenation function from the tests into the ``MerkleTree`` constructor.
- This function will take two arguments: a left leaf node and a right leaf node and will return the resulting combination.
- For instance in a four-leaf tree:
```js
   Root
    / \
   AB  CD
  / \  / \
  A B  C D
```
- The function is used three times, for each combination. We'll denote it here with Hash:
```js
Hash(Hash(A + B) + Hash(C + D))
```
-  First we're combining ``A`` and ``B``.
- Next we're combining ``C`` and ``D``.
- Finally we're combining the result of those two combinations ``AB`` and ``CD`` to get the Root hash.
-  If you take a look at testTwo.js you'll see the function is simply forming the string in the format shown above.
- This will help us debug problems in the first few stages! You'll be able to compare the string you created versus the expected result.

#### Multiple Layers
- This tree will have multiple layers.
- For example, with four leaf nodes you'll combine the first two nodes and then you'll combine the last two nodes.
- Then you'll take the two results and combine those to get the root node.

#### Purpose of the Merkle Tree
- Consider the four leaf example:
```js
    ABCD
    /  \
   AB  CD
  / \  / \
  A B  C D
```
- What do we need to prove that C is in ABCD
- You might say, we need ``A``, ``B``, and ``D``. But this is actually more information than we need!
- We actually only need ``AB`` and ``D``:
```js
Hash(AB, Hash(C, D))
```
- In this derivation of ABCD, we can forget about ``A`` and ``B``.
- We don't need to know what they are to prove that ``C`` is in the Root. We just need the ``D`` and ``AB``.
- **This optimization is the power of Merkle Trees.**
- It becomes even more apparent with larger trees where less data is necessary to prove that a leaf node is part of the tree.
- A Merkle Tree of 128 nodes only requires 7 other hashes to prove a leaf node belongs in the set.

#### Recommended Approach
- There's several ways to approach writing this algorithm.
- First off, you'll need to choose between recursion and iteration.
- We have a merkle tree with some arbitrary number of leaf nodes. Maybe it's the four leaf tree:
```js
    ROOT
    /  \
   AB  CD
  / \  / \
  A B  C D
```
- Maybe it's the eight leaf tree:
```js
        Root
       /    \
    ABCD     EFGH
    / \      / \
   AB  CD   EF  GH
  / \  / \  / \ / \
  A B  C D  E F G H
```
- Our recommended approach to this problem, is to break it down into layers.
- Let's consider the eight leaf tree. For each layer, we want to take every 2 nodes and combine them.
- So, if we're on the bottom layer:
  - Combine ``A`` and ``B`` to make ``AB``
  - Combine ``C`` and ``D`` to make ``CD``
  - Combine ``E`` and ``F`` to make ``EF``
  - Combine ``G`` and ``H`` to make ``GH``
- After that, we'll move up a layer! Next layer:
  - Combine ``AB`` and ``CD`` to make ``ABCD``
  - Combine ``EF`` and ``GH`` to make ``EFGH``
- Finally:
  - Combine ``ABCD`` and ``EFGH`` to make ``ABCDEFGH``
- Each layer we check to see if there is a single element left.
  - If there is only one element left, it's root. Time to return that root!
>  Alternatively, you can calculate ahead of time how many layers will be in the tree. Then you'll know when to return the root based on how many layers you've worked on.

#### Other Odd Trees
- The rule for odd trees is always to use up everything towards the left side before filling out the right side of the tree.

#### Five Leaf Tree
- With five leaves, we use the first four as the left side and bring the fifth all the way up until the last combination.
```js
      Root
     /    \
    ABCD   E
    / \    |
   AB  CD  E
  / \  / \ |
  A B  C D E
```

#### Seven Leaf Tree
- With seven leaves, the last three hashes work similar to a three leaf tree to build up the EFG combination and then combines with the first four hashes.
```js
        Root
       /    \
    ABCD     EFG
    / \      / \
   AB  CD   EF  G
  / \  / \  / \ |
  A B  C D  E F G
```

#### Build The Proof
- Alright, now it's time to build the proof that a particular leaf node exists within a merkle tree!
- With this proof, we'll only want to include the necessary hashes we need to create the root hash from our target leaf node.

#### ABCDE Merkle Proof Example
```js
      Root
     /    \
    ABCD   E
    / \    |
   AB  CD  E
  / \  / \ |
  A B  C D E
```
##### Proof of C
- Let's prove C is in the Merkle Root!
- We build the path to create the root from C:
```js
Hash(Hash(AB + Hash(C + D)) + E)
```
- So the four hashes in use here are ``AB``, ``C``, ``D``, and ``E``. Since we're starting with ``C``, we won't need it in the proof. We'll need to know ``AB``, ``D`` and ``E``.
- Also we need to know the order in which they should be combined.
- Hash(A + B) will not be the same as Hash(B + A).
- Our proof should contain the data (the hash) and whether or not the node is in the left position.
- Our resulting proof would look like this:
```js
 [
 { data: 'D', left: false },
 { data: 'AB', left: true },
 { data: 'E', left: false }
]
```
-  By looking at this proof, we can easily concatenate to the root.
- We start with ``C``, concatenate ``D`` on the right (``CD``), concatenate ``AB`` to the left (``ABCD``) and then concatenate ``E`` on the right to get the root ``ABCDE``.
- We didn't even need to know ``A`` or ``B``, just the combined hash of the two.

#### Another Example
- Let's prove ``A`` belongs in the ``ABCDEFGHIJ`` Merkle Tree
```js
                Root
              /      \
      ABCDEFGH        IJ
      /      \         |
    ABCD     EFGH     IJ
    / \      /   \     |
   AB  CD   EF   GH   IJ
  / \  / \  / \  / \  / \
  A B  C D  E F  G H  I J
  ```
- In order to prove A is in this tree we'll need the following proof path:
```js
Hash(Hash(Hash(Hash(A + B) + CD) + EFGH) + IJ)
```
- So we'll need four hashes: B, CD, EFGH, and IJ.
```js
[
 { data: 'B', left: false },
 { data: 'CD', left: false },
 { data: 'EFGH', left: false }
 { data: 'IJ', left: false }
]
```
- Such a big tree and we only need four hashes to prove A!
- For ``I`` or ``J`` the savings would be even better in this tree, only two hashes necessary for their proofs.

#### Recommended Approach
- You'll want to approach this similar to how you did the getRoot algorithm.
- If you think of the algorithm in terms of layers, we can figure out what need to do on each layer.
- Let's use the ABCDE Merkle Tree for an example:
```js
     Root
     /   \
   ABCD   E
   / \    |
  AB  CD  E
 / \  / \ |
 A B  C D E
 ```
 - Let's say we want to prove ``C`` exists in the tree.
 - We're given the index 2, which corresponds to the ``C``'s position in the array passed into our Merkle Tree constructor.
 - So we start at C on the bottom layer. What do we need to first?
    - We need to know if C is the left or right node in its pairing.
    - We can determine this by checking C's index (2).
    - Two is even so it is a left node.
    - Now that we know that, we need to add one to our index to get the right node: ``D``.
    - We add ``D`` to our proof and say it is left: false (because it's on the right).
- Our proof so far:
```js
[
 { data: 'D', left: false }
]
```
- Since we started at C and we have D in our proof, we'll want the piece of data that combines with CD.
- We'll need to move up one layer and move to the index of CD.
- We're at index 2 and need to move to index 1.
- Since our merkle tree is a binary tree, each layer combines its pairs resulting in half the number of nodes.
- This means we should cut our index in half and round down.
- You can verify this for yourself by taking a look at each individual node and thinking where you want to be next up one layer:
  - For ``A`` at index ``0``, we want to move to ``AB`` at index ``0``
  - For ``B`` at index ``1``, we want to move to ``AB`` at index ``0``
  - For ``C`` at index ``2``, we want to move to ``CD`` at index ``1``
  - For ``D`` at index ``3``, we want to move to ``CD`` at index ``1``
  - For ``E`` at index ``4``, we want to move to ``EF`` at index ``2``
  - For ``F`` at index ``5``, we want to move to ``EF`` at index ``2``
>  Notice each time we need to divide the index in half and round down.
- So now we move to index ``1`` on the second layer, which is ``CD``.
- We need to again check if ``CD`` is a left or right node.
- Since it's an odd number, it's a right node.
- We'll subtract one to get it's left node ``AB`` and add it to our proof:
- Our proof so far:
```js
[
 { data: 'D', left: false },
 { data: 'AB', left: true }
]
```
- If we repeat this pattern, we'll divide our index (1) by 2, take the floor (0) and be at ``ABCD``.
- We'll grab the right node ``E`` and add that to our proof:
```js
[
 { data: 'D', left: false },
 { data: 'AB', left: true },
 { data: 'E', left: false }
]
```
- At this point we will reach the top layer, with one node and can return our proof.

#### Verifying your Proof
- It's time to verify it.
- The test cases will include some valid proofs and some invalid proofs, your function will need to know the difference.

#### Example Proof
- In the previous stage we used the ABCDE merkle tree and created a proof of C being in the tree.

#### ABCDE Merkle Tree
```js
      Root
     /    \
    ABCD   E
    / \    |
   AB  CD  E
  / \  / \ |
  A B  C D E
```
**Proof of C**
- As we said in the previous stage, the hash path is as follows:
```js
Hash(Hash(AB + Hash(C + D)) + E)
```
- In order to verify this proof we need to take three steps:
1. Hash C and D
2. Hash the result together with AB (AB should be on the left)
3. Hash the result together with E (E should be on the right)
- After this is complete, our resulting hash is our merkle root: ``ABCDE``
