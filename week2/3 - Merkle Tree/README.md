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

---
### Table of Contents
1. [Combine Two Leaves](#combine-two-leaves)
    - [Combination Function](#combination-function)
    - [Your Goal: Root of Two Leaves](#your-goal-root-of-two-leaves)
1. [Multiple Layers](#multiple-layers)
    - [Purpose of the Merkle Tree](#purpose-of-the-merkle-tree)
    - [Recommended Approach](#recommended-approach)
    - [Your Goal: Handle Bigger Trees](#your-goal-handle-bigger-trees)
1. [Odd Leaves](#odd-leaves)
    - [Other Odd Trees](#other-odd-trees)
    - [Five Leaf Tree](#five-leaf-tree)
    - [Seven Leaf Tree](#seven-leaf-tree)
    - [Your Goal: Handle Odd Number of Leaves](#your-goal-handle-odd-number-of-leaves)
1. [Build The Proof](#build-the-proof)
    - [ABCDE Merkle Proof Example](#abcde-merkle-proof-example)
    - [Another Example](#another-example)
    - [Recommended Approach](#recommended-approach-1)
    - [Add the getProof Method](#add-the-getproof-method)
1. [Verifying your Proof](#verifying-your-proof)
    - [Example Proof](#example-proof)
    - [ABCDE Merkle Tree](#abcde-merkle-tree)
    - [Your Goal: Complete Verify Proof](#your-goal-complete-verify-proof)


### Combine Two Leaves
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

#### Your Goal: Root of Two Leaves
- First, let's write a constructor for the MerkleTree class.
  - This constructor will take two arguments passed in this order:
  1. An array of leaf nodes
  1. A combination function used to concatenate and hash two leaves together
- Next, let's add a function getRoot on the MerkleTree class.
  - This function will find the merkle root.
- For this stage you will only need to take two leaves and hash them together:
```
    Root
    /  \
   A    B
```
- Here, A and B are the leaf nodes and the root is the result of the concatenation.
  - Simply take the first and second leaf nodes and use the concatenate function to get the result.

---
**SOLUTION**
```js
class MerkleTree {
    constructor(leaves, concat) {
        this.leaves = leaves
        this.concat = concat
    }
    getRoot() {
        return this.concat(this.leaves[0],this.leaves[1])
    }
}

module.exports = MerkleTree;
```
---

### Multiple Layers
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

#### Your Goal: Handle Bigger Trees
- Update the getRoot function to handle merkle trees with more than two leaf nodes.
- When breaking down the logic of merkle trees, first we hash together A and B, then we hash together C and D.
  - Then we hash together the combination of A and B (AB) with the combination of C and D (CD). Something like this:
```
   ABCD
    /  \
   AB  CD
  / \  / \
  A B  C D
```
- Writing the code you will likely find it useful to think of the tree as having multiple layers:
  - The first layer is the leaves (``A``, ``B``, ``C``, ``D``)
  - The second is the combination of both of those combinations (``AB``, ``CD``)
  - The last layer is the final combination: the merkle root (``ABCD``)
- In each layer, we'll need to combine elements two-at-a-time until we reach a layer with just a single element.
  - At that point we can stop, knowing we've found the root.
- For this stage you'll need to handle a **single leaf node**, **two leaf nodes**, **four leaf nodes** and **eight leaf nodes**.

---
**SOLUTION**
```js
class MerkleTree {
    constructor(leaves, concat) {
        this.leaves = leaves
        this.concat = concat
    }
    getRoot(leaves = this.leaves) {
        if (leaves.length === 1){
            return leaves[0]
        }
        let layer = []
        for (let i =0; i<leaves.length;i+=2) {
            let left = leaves[i]
            let right = leaves[i+1]
            layer.push(this.concat(left,right))
        }
        return this.getRoot(layer)
    }
}
module.exports = MerkleTree;
```
---

### Odd Leaves
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

#### Your Goal: Handle Odd Number of Leaves
- Let's consider what happens in the case of an odd number of leaves in a tree.
- Any time that there is no right pair to an element, we're just going to want to carry that leaf one layer up:
```bash
    Root
    / \
   AB  C
  / \  |
  A B  C
```
- In this case we don't use the C node until we combine it with AB to create the Merkle Root. Let's handle this in our getRoot function.

---
**SOLUTION**
```js
class MerkleTree {
    constructor(leaves, concat) {
        this.leaves = leaves;
        this.concat = concat;
    }
    getRoot(leaves = this.leaves) {
        if (leaves.length === 1) {
            return leaves[0];
        }
        const layer = [];
        for (let i = 0; i < leaves.length; i += 2) {
            const left = leaves[i];
            const right = leaves[i + 1];
            if (right) {
                layer.push(this.concat(left, right));
            }
            else {
                layer.push(left);
            }
        }
        return this.getRoot(layer);
    }
}

module.exports = MerkleTree;
```
---

### Build The Proof
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

#### Add the getProof Method
- Let's add a getProof method to our MerkleTree class.
    - This function will take in an index of a leaf node and return a Merkle Proof.
- The Merkle Proof will be an array of objects with the properties data (the hash) and left (a boolean indicating if the hash is on the left).

---
**SOLUTION**
```js
class MerkleTree {
    constructor(leaves, concat) {
        this.leaves = leaves
        this.concat = concat
    }
    getRoot(leaves = this.leaves) {
        if (leaves.length === 1){
            return leaves[0]
        }
        let layer = []
        for (let i =0; i<leaves.length;i+=2) {
            let left = leaves[i]
            let right = leaves[i+1]
            if (right) {
                layer.push(this.concat(left,right))
            } else {
                layer.push(left)
            }
        }
        return this.getRoot(layer)
    }
    getProof(index, layer=this.leaves,proof = []){
        if (layer.length === 1) return proof
        const newLayer = []
        for (let i = 0; i < layer.length; i += 2) {
            let left = layer[i]
            let right = layer[i + 1]
            if (!right) {
                newLayer.push(left)
            }
            else {
                newLayer.push(this.concat(left, right))

                if (i === index || i === index - 1) {
                    let isLeft = !(index % 2)
                    proof.push({
                        data: isLeft ? right : left,
                        left: !isLeft
                    })
                }
            }
        }
        return this.getProof(Math.floor(index / 2), newLayer, proof)
    }
}

module.exports = MerkleTree;
```
---

### Verifying your Proof
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

#### Your Goal: Complete Verify Proof
- The function ``verifyProof`` takes four parameters: ``proof``, ``node``, ``root`` and ``concat``.
- Here are their definitions:
  1. ``proof`` - An array of objects whose properties are ``data`` and ``left``. (The proof you created in the previous stage)
  1. ``node`` - A leaf node we're trying to prove is within the merkle tree.
  1. ``root`` - The valid Merkle Root.
  1. ``concat`` - The method used to combine the leaf nodes.
- Take the ``node`` and combine it with all the data provided in the ``proof``.
- At this point you'll have your own root derived from the ``node`` and the ``proof``.
  - Compare this to the true ``root`` with ``===`` to see if they match.
---
**SOLUTION**
```js
// index.js
class MerkleTree {
    constructor(leaves, concat) {
        this.leaves = leaves
        this.concat = concat
    }
    getRoot() {
        return this.getRecursiveRoot(this.leaves)
    }
    getRecursiveRoot(nodes) {
        if (nodes.length === 1) {
            return nodes[0]
        }

        const newNodes = []
        for (let i=0; i<nodes.length;i+=2) {
            const a = nodes[i]
            const b = nodes[i+1]
            if (b) {
                newNodes.push(this.concat(a,b))
            } else {
                newNodes.push(a)
            }
        }

        return this.getRecursiveRoot(newNodes)
    }
  getProof(index, layer = this.leaves, proof = []) {
        if (layer.length === 1) return proof;
        const newLayer = [];
        for (let i = 0; i < layer.length; i += 2) {
            let left = layer[i];
            let right = layer[i + 1];
            if (!right) {
                newLayer.push(left);
            }
            else {
                newLayer.push(this.concat(left, right));

                if (i === index || i === index - 1) {
                    let isLeft = !(index % 2);
                    proof.push({
                        data: isLeft ? right : left,
                        left: !isLeft
                    });
                }
            }
        }
        return this.getProof(Math.floor(index / 2), newLayer, proof);
    }
}
module.exports = MerkleTree;

// verify.js
function verifyProof(proof, node, root, concat) {
  let data = node
  for (let i=0; i<proof.length;i++){
      if(proof[i].left) {
          data = concat(proof[i].data,data)
      } else {
          data = concat(data,proof[i].data)
      }
  }
  return  data === root
}

module.exports = verifyProof;
```
---
