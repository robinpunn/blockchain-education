
---

# Blockchain Storage

---

### Table of Contents
1. [Keeping Track of Blockchain User State](#keeping-track-of-blockchain-user-state)
    - [UTXO and Account Models](#utxo-and-account-models)
        - [Transactions](#transactions)
        - [Account-based Model](#account-based-model)
        - [UTXO-based Model](#utxo-based-model)
        - [Account vs UTXO model](#account-vs-utxo-model)
        - [Conclusion](#conclusion)
    - [Further Reading on UTXOS](#further-reading-on-utxos)
        - [Real Transactions](#real-transactions)
        - [Bitcoin Script](#bitcoin-script)
2. [Tree Data Structures](#tree-data-structures)
    - [Intro](#intro)
    - [An Orientation to Trees](#an-orientation-to-trees)
        - [Simple Tree](#simple-tree)
        - [Binary Tree](#binary-tree)
        - [Tree](#tree)
        - [Tree vs Linked List](#tree-vs-linked-list)
        - [Tree Vocabulary Summary](#tree-vocabulary-summary)
    - [When To Use a Tree](#when-to-use-a-tree)
        - [Binary Search Tree](#binary-search-tree)
        - [Binary Search Tree Trivia](#binary-search-tree-trivia)
        - [Conclusion](#conclusion-1)
3. [Blockchain Data Storage](#blockchain-data-storage)
    - [Merkle Trees](#merkle-trees)
        - [Merkle Trees](#merkle-trees-1)
        - [Merkle Trees In Bitcoin](#merkle-trees-in-bitcoin)
        - [Merkle Proofs](#merkle-proofs)
        - [Merkle Trees Use Cases](#merkle-trees-use-cases)
        - [Logarithmic Scaling](#logarithmic-scaling)
        - [Merkle Tree Vocabulary Summary](#merkle-tree-vocabulary-summary)
        - [Conclusion](#conclusion-2)
    - [Patricia Merkle Tries](#patricia-merkle-tries)
        - [Intro](#intro-1)
        - [REVIEW: Bitcoin: Block Architecture](#review-bitcoin-block-architecture)
        - [First Look: Ethereum Block Architecture](#first-look-ethereum-block-architecture)
        - [REVIEW: Merkle Trees in Bitcoin](#review-merkle-trees-in-bitcoin)
        - [Trees in Ethereum](#trees-in-ethereum)
        - [Radix Trie](#radix-trie)
        - [Patricia Merkle Trees](#patricia-merkle-trees)
    - [Why Does Ethereum Use a Merkle Patricia Trie?](#why-does-ethereum-use-a-merkle-patricia-trie)
        - [Ethereum Block Header](#ethereum-block-header)
        - [Ethereum: State Trie](#ethereum-state-trie)
        - [Ethereum: Transaction Trie](#ethereum-transaction-trie)
        - [Ethereum: Transaction Receipt Trie](#ethereum-transaction-receipt-trie)
        - [Conclusion](#conclusion-3)
    - [Further Reading](#further-reading)
        - [Merkle Trees in Ethereum](#merkle-trees-in-ethereum)
        - [Quick Note on RLP](#quick-note-on-rlp)

---

## Keeping Track of Blockchain User State

---

### UTXO and Account Models
- With traditional web2 server based platforms, keeping track of user data and information is actually a lot easier than it is on the blockchain.
- This is because there is a single centralized server that stores the state of user accounts. 
    - There's no need for consensus or resolving discrepancies since there's only one central place that stores information.
- However, when you move to a decentralized system, the problem of storing user balances becomes tricky. 
- Decentralized networks like Bitcoin and Ethereum need specific models for keeping track of the state of users. 
    - Bitcoin uses the UTXO model to keep track of user balances. 
    - Ethereum and other EVM chains use the account model to keep track of user balances.
> UTXO stands for "Unspent Transaction Output". You will see the term UTXO used a bit in this lesson! Bitcoin uses the UTXO model, so we like to include it because it helps us understand tradeoffs in blockchain storage models as well as it will help us compare and contrast to Ethereum and its use of the Account model.

#### Transactions
- The place where user balances begin: the transaction.
- Three main components to a transaction:
    1. **amount**: the amount to send to someone
    2. **payer**: the person sending the transfer amount
    3. **payee**: the person receiving the transfer amount
    4. **payer authorization**: some sort of unfakeable authorization given by the initiator of the transaction
        - This fourth item would just end up being the digital signature which is basically a hash that is extremely hard to replicate if you do not have the correct inputs - in this case, a user's private keys. 
        - Without the private keys, a payment authorization cannot occur.
- What is the purpose of a transaction? 
    - To change some user state! 
    - If Alice sends Bob 5 $DAI, Alice's $DAI balance should go -5, Bob's should go +5. Alice's transaction is responsible for changing the state of their balances. 
    - Changing state is extremely important in blockchains (which are typically transaction-based networks!), so keep this in mind!
- Bitcoin, Ethereum and regular banks rely on transaction-based models to keep track of user balances. 

#### Account-based Model
- The account model follows just that: accounts. 
- It tracks the balances of users based on their overall account state, without any tracking on what constitutes the actual balance itself. 
- In other words, an account-based ledger would mark an entry like this:
> Acct #12345 -> Name: Rick Sanchez -> Balance: $142.62
- What does a transaction look like in an account-based model?
    1. Alice has $60 total balance
    1. Bob has $20 total balance
    1. Bob sends Alice $5
    1. Bob's balance is subtracted $5, if the remaining balance is greater then 0, proceed, else revert
    1. Alice balance is summed $5
    1. The ledger is marked in both ends to update total balances and that is the end of the transaction in an account-based model.

#### UTXO-based Model
- Ethereum uses the account-based model, while Bitcoin uses UTXOs (short for ``Unspent Transaction Outputs``) to keep track of user state/balances.
- The UTXO model differs pretty drastically from the account model. It's a little bit more complex - mainly because it is not a familiar interface like the account model is! Yet it does set up some interesting features...
- What is a UTXO?
    - Alice sends Bob 5 BTC in the form of a transaction relayed to the Bitcoin network.
    - At this point, if the transaction is valid (Alice has > 5 BTC, Alice owns the relevant private keys and can produce a signature, etc), Alice is signaling an intent to change user state.
    - When the Bitcoin network mines Alice's transaction, Bob is credited with a UTXO worth 5 BTC.
    - This is how the Bitcoin network keeps track of user balances - it keeps a really big long set of UTXOs - outputs out of state-changing transactions that credit users with a certain amount of BTC.
    - So when people say: "I own 3 bitcoins", they should really be saying: "I own some UTXOs that allow me to spend 3 bitcoins."
- Important notes on UTXOs:
1. All UTXOs are non-fungible (fun fact: the first NFT collection ever was... Bitcoin!)
1. To spend a UTXO, you must refer back to that specific UTXO.
> [A user's UTXOs are scattered across blocks](https://www.horizen.io/blockchain-academy/assets/post_files/technology/expert/4.1-utxo-vs-account/dag-vs-database_M.jpg).
3. Once a UTXO is "consumed", any leftover change from the transaction creates new UTXOs representing the change amounts
4. A UTXO, often referred to as a "coin", can only be spent ONCE. No double-spending!
5. In Bitcoin, each UTXO has a script associated with it
> Scripts are basically hard-programmed code that each UTXO stores. They usually contain the conditions under which to unlock the UTXO for further spending. More resources on [Bitcoin Script](https://en.bitcoin.it/wiki/Script).

#### Account vs UTXO model
<table>
    <tr>
        <th></th>
        <th>Accounts</th>
        <th>UTXO</th>
    </tr>
    <tr>
        <th>User Balances</th>
        <td>Overall Account State (ie. Alice has 4.2 ETH)</td>
        <td>Specific UTXOs (ie. Alice has 29 UTXOs that amount to 2.65 BTC)O</td>
    </tr>
    <tr>
        <th>Pros</th>
        <td>More intuitive, easier to quickly understand</td>
        <td>Very good privacy if user uses a new address per tx</td>
    </tr>
    <tr>
        <th>Cons</th>
        <td>Replay Attacks (someone could re-)</td>
        <td>UTXOs are stateless, which complicates state-heavy designs</td>
    </tr>
</table>

#### Conclusion
- Deciding what model to go with is a game of design tradeoffs.
    - Ethereum uses the account-based model transactions must be more flexible to account for the many moving pieces of state in the system.
    - Bitcoin uses UTXOs as it is a network purposefully designed to be as simple and stateless as possible.

### Further Reading on UTXOs
#### Real Transactions
- We can take a look at the [Genesis Block](https://www.blockchain.com/btc/block/0) and see that there was a coinbase transaction sent to [1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa](https://www.blockchain.com/btc/address/1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa) which was never spent!
- Here's some more information about the Genesis Block.
    - The scriptPubKey is also called the "Witness Script" or the "Locking Script".
- For each Locking Script there should be an Unlocking Script that will unlock the UTXO and allow it to spent.
    - Typically, all the unlocking script needs to provide is a signature that verifies ownership of a public key, and then the public key needs to match the address after being hashed twice.
>  If you look down in that wiki article, you'll see that the Genesis Block Coinbase UTXO is not included in client's database, so it cannot be spent! For more information on that [see here](https://bitcoin.stackexchange.com/questions/10009/why-can-t-the-genesis-block-coinbase-be-spent).
#### Bitcoin Script
- The Bitcoin Script language is meant to be a simple stack-based language that has no loops so it will always resolve and there are no denial of service attacks.
- The language is basically a list of function-like operation codes, that take arguments off the stack and operate on them. See the full list of [operation codes here](https://en.bitcoin.it/wiki/Script).
- You can find some interesting background on Bitcoin Script in this [Stack Overflow answer here](https://bitcoin.stackexchange.com/a/29763).
    - The author of that answer mentions a bug with ``OP_RETURN`` and concatenating the unlock and locking scripts. You can find more background information on that [here](https://bitcoinsv.io/2019/07/27/the-return-of-op_return-roadmap-to-genesis-part-4/)
>  Someone made a [JavaScript implementation of Script](https://github.com/crm416/script).
- Two common forms of transaction scripts for Bitcoin are the [Pay-to-Pubkey Hash](https://en.bitcoinwiki.org/wiki/Pay-to-Pubkey_Hash) and [Pay-to-Script Hash](https://en.bitcoin.it/wiki/Pay_to_script_hash).

---

## Tree Data Structures

---

### Intro
- Blockchain networks use transactions to change state and keep track of user balances.

### An Orientation to Trees
- Just like in real life there are many kinds of trees, there are many tree-like data structures in computer science. Let's familiarize ourselves with a few of these trees.
- The first term you will see widely used in data structures: nodes. A **node** is a basic unit of a data structure.
> In computer systems, "node" can also refer to network nodes communicating data on a peer-to-peer network (which Bitcoin and Ethereum are!). Context is important!

#### Simple Tree
![Simple Tree](https://res.cloudinary.com/divzjiip8/image/upload/v1667084857/guides/Screen_Shot_2022-10-29_at_4.06.17_PM.png)
- The top, orange node is referred to as the parent while the bottom green nodes would be referred to as the children (relative to the parent node)

#### Binary Tree
![Binary Tree](https://res.cloudinary.com/divzjiip8/image/upload/v1667084857/guides/Screen_Shot_2022-10-29_at_4.06.30_PM.png)
- It is typical to see some enforcement property before "tree" to distinguish different types of tree data structures.
- A tree is considered binary when each parent has at most two children.
- The key word in this tree is binary - it, like other preceding terms to "tree", sets some type of rule for the tree - in this case, that each parent node can have at most two children.
> Notice the tree in the diagram above now has four new gray nodes. These would now be referred to as the leaves since they are the last level of the tree and have no further children.

#### Tree
![Tree](https://res.cloudinary.com/divzjiip8/image/upload/v1667084858/guides/Screen_Shot_2022-10-29_at_4.06.40_PM.png)
- The tree above shows that a tree can be any parent with any number of children.
- There doesn't have to be any enforcement on the tree, it just is a tree of data.
> You will see a pattern emerge where the word "tree" is usually preceded by some term that tells you what types of rules that tree will enforce. A binary tree enforces the rule that parents can have at most two children. A tree... is just a tree! Trees don't necessarily have to come with any rules.
- Enforcement allows people to more efficiently work with data since they know a tree will have certain rules enforced - but, the point is, a tree can just be... a tree!

#### Tree vs. Linked List
- A linked list is also a tree - just a really long one that only has one child per parent in a long continuous chain.
- A tree is not necessarily a linked list.
- Here are the two code implementations for a LinkedListNode and aTreeNode to help distinguish:
```js
class LinkedListNode {
	constructor(data) {
	    this.data = data;
	    this.next = null;
	}
}

class TreeNode {
	constructor(data) {
	    this.data = data;
	    this.children = [];
	}
}
```
- Notice the ``TreeNode`` holds the typical ``data`` and an array to contain references to any children of that (parent) node.
- The ``LinkedListNode`` just keeps track of a ``next`` node.

#### Tree Vocabulary Summary
![Tree Vocabulary Summary](https://miro.medium.com/max/975/1*PWJiwTxRdQy8A_Y0hAv5Eg.png)
- Take note of all of the relativity that happens as a tree grows in size.
- A node that was a leaf node becomes a parent node once a new child is added under it.
- Final vocabulary for trees:
    - **key**: actual data held inside node
    - **root**: the parentest node in a tree
    - **siblings**: nodes under the same parent and on the same level
    - **subtree**: once you isolate a part of a broader tree, you can form a brand new tree with new relationships

### When To Use a Tree
- Sometimes trees occur quite naturally! Take a file system for example:
![File System Tree](https://res.cloudinary.com/divzjiip8/image/upload/v1667179045/guides/Screen_Shot_2022-10-30_at_6.16.33_PM.png)
> A file system can be a tree with an arbitrary amount of children in each directory
- Tree usage:
- If your data can be stored hierarchically, using a tree can be a good data structure to go with.
- A tree is also a very efficient data structure for the searching and sorting of data
    - Recursive algorithms are often used in conjunction with trees
- Trees can be very efficient data structures for searching/sorting data precisely because of the rules it sets, like being a binary tree or an even stricter rule set, a binary search tree.

#### Binary Search Tree
![Binary Search Tree](https://res.cloudinary.com/divzjiip8/image/upload/v1667179765/guides/Screen_Shot_2022-10-30_at_6.29.15_PM.png)
- A binary search tree, like the one above has the following properties:
    - it is a **binary tree**
    - the **left subtree** of a node contains only nodes with keys **lesser than** the node's key
    - the **right subtree** of a node contains only nodes with keys **greater than** the node's key
    - each node’s left and right subtrees must also be a **binary search tree**
- These types of enforcements make a binary search tree a highly in-demand data structure, since algorithms can now account for these rules and storing/searching is made much more efficient!

#### Binary Search Tree Trivia
- Knowing that each left child is less than the parent and each right child is greater than the parent, how many attempts does it take you to find a number (key) at most?
- Adding a whole new layer of elements adds only 1 more search attempt at worst. Because of the BST (short for Binary Search Tree) enforcement properties, the search time always remains O(log n) where n is the number of nodes in the tree.
- The tree in the diagram above is a BST of a height, how many levels a tree has, of three, with nodes held at each level that increase in number by a power of two each level down.
    - The last level contains 4 nodes which means the next level under that will contain 8 nodes (at most).
    - Here is the real magic of enforced-property trees like BSTs: even though we add a whole new level of new data, the search time only increases by one.
    - In other words, as the size of the tree grows at an exponential, the search time always remains O(log n).
- Here is a chart to visualize how much algorithm search time is affected by growth of input (n).
![Binary Search Tree Trivia](https://res.cloudinary.com/divzjiip8/image/upload/v1667181087/guides/Screen_Shot_2022-10-30_at_6.51.12_PM.png)
    - Since blockchains are basically databases, Big O analysis is very important to help choose the most efficient data structure (low storage costs, easy search and retrieval).
    - When designing a system with data needs, you want your data structure to be as close to Constant Time (the blue line on the chart) as possible.
- Big O Notation gives us a rough indicator of how well an algorithm will perform in terms of N (# of input elements).
- We want our algorithms to be efficient.

#### Conclusion
- We covered basic tree data structures, different types of enforcements on trees and general tree data structure vocabulary.
- This is all important information as we dive even deeper into more specific trees with more specific enforcements on them.
- In the next section, we'll look at Merkle Trees.
- As a heads up for the next two sections, blockchains use tree data structures quite heavily...

---
## Blockchain Data Storage
---

### Merkle Trees
#### Merkle Trees
- As we take a look at Ethereum Data Storage and as we build smart contracts, we'll often find ourselves interfacing with this data structure and we'll be expected to understand its usefulness
- A Merkle Tree is a data structure that allows us to make efficient verifications that data belongs in a larger set of data.
- They are commonly used in Peer to Peer networks where efficient proofs of this nature will help increase the scalability of the network.
- Let's take a step back and take a look at a binary Merkle Tree from a high-level.
- A Merkle Tree is a collection of hashes reduced to a single hash:
```js
     ABCDEFGH <-- Merkle Root
       /    \
    ABCD     EFGH
    / \      / \
   AB  CD   EF  GH
  / \  / \  / \ / \
  A B  C D  E F G H
```
- We use letters for convenience in this illustration.
- Each single letter represents a hash.
- The combined letters represent concatenated hashes that have been combined and hashed to form a new hash
- Over a series of a steps the eight leaf hashes ``A``, ``B``, ``C``, ``D``, ``E``, ``F``, ``G``, and ``H`` are combined to create a single, unique hash that allows us to quickly check for inconsistencies without having to look at each individual data point.
- As peers in a system, I can simply ask if your root matches mine. If so, we agree. This is a nice optimization for distributed systems of any kind!
- **Why the tree structure? Could we not concatenate all eight hashes at once and store that hash?**
- We certainly could.
- This binary tree structure affords us one further optimization: it allows us to verify a single piece of data belongs in the tree without having all of the data.
- Consider the merkle tree from above with some missing data:
```js
     ABCDEFGH
       /    \
    ABCD     EFGH
    / \      / \
   -  -     EF  GH
  / \  / \  / \ / \
  - -  - -  E F -  -
```
- **What do we need in order to prove that ``E`` belongs in this tree?**
- Just ``F``, ``GH``, ``ABCD``. We use these to calculate ``EF``, ``EFGH``, and ``ABCDEFGH``. Then we can compare the result to our expected root ``ABCDEFGH``.
- If something went wrong along the way, we would notice it at the root. For example if we replaced E with M:
```js
      ABCDMFGH
       /    \
    ABCD     MFGH
    / \      / \
   -  -     MF  GH
  / \  / \  / \ / \
  - -  - -  M F -  -
```
- We can quickly check ABCDMFGH against the our expected root ABCDEFGH and see we did not get our expected hash. Something's wrong.
- The savings become important with larger trees where the average case for verification of tree is log2(n) where n is the number of nodes in the tree. So for a tree of size 128, it would take only 7 hashes to determine the root.
#### Merkle Trees In Bitcoin
- The design of merkle trees makes them extremely efficient for data verification.
- In Bitcoin, Merkle trees are used to store every transaction mined on the Bitcoin network in an efficient way:
![Merkle Trees In Bitcoin](https://www.researchgate.net/publication/343236094/figure/fig1/AS:917904996462593@1595857013751/Bitcoin-block-structure.ppm)
- The diagram above shows the architecture of a bitcoin block. Did you think a bitcoin block contains all of the transactions per block?
- In a way it does... but via merkle trees!
- What happens is, all of the transactions per block are arranged into a big Merkle tree.
- What actually ends up getting committed into the block and immutable blockchain is that Merkle tree's root hash.
- By committing the root hash of the tree, the transaction data can be stored off-chain (full nodes, for example, store these transaction records on a LevelDB integrated into all full nodes).
- Thanks to Merkle trees, storage on the blockchain is efficient - you must only commit one piece of data instead of thousands of transactions per block, which would really bloat the system!
> A main design purpose behind using Merkle trees to commit a lot of data elements (typically transactions) per block is to keep the size of the blockchain as small as possible. Given the nature of their usage, blockchains grow perpetually, so you must account for efficient data storage. Keeping the blockchain size from becoming bloated means more people can support running full nodes which helps network decentralization.
- Thanks to Merkle trees, there is an efficient way to verify that some data exists in a root hash.
- Take the image below... can you imagine how bloated each block would be if every single tx needed to be stored?
- Much better to store just ONE root hash representing all the transactions per block!
![Merkle Trees In Bitcoin](https://res.cloudinary.com/divzjiip8/image/upload/v1669839740/guides/Screen_Shot_2022-11-30_at_12.22.06_PM.png)

#### Merkle Proofs
- The benefit of the Merkle tree design -- a recursive hashing-based algorithm -- is that it allows for efficient proof that some data exists within the root hash construction (actually contained in the block!); in other words, it allows for Merkle proofs.
- A Merkle proof confirms specific transactions represented by a leaf or branch hash within a Merkle hash root.
- So if anyone ever needs to prove that a transaction existed at one point in time in the blockchain, they just need to provide a Merkle proof.
![Merkle Proofs](https://ethereum.org/static/d971703e4ef95e42df0d02a9ec51ec0b/ba4d9/proof-c.png)
- In the diagram above, say you want to prove that C (some random tx) exists in this block.
- Thanks to Merkle proofs, you only need 3 total pieces of data: D, H(A-B), H(E-H) to construct the tree root hash: H(A-H).
- That might not seem like much with such a small tree, but what about a tree containing over 10,000 transactions?
- If one is able to successfully construct the root hash, then that is proof enough that their transaction was indeed part of that Merkle tree at that time.

#### Merkle Trees Use Cases
- Merkle trees are:
    - space and computationally efficient
    - good for scalability and decentralization
    - no need to pack a block full of transactions… just commit a Merkle root hash to it and keep transactions in other places that can handle them
- In deeper terms, they:
    1. They significantly reduce the memory needed to verify that data has maintained its integrity and hasn’t been altered.
    2. They require less data to be broadcast across the blockchain network to verify data and transactions. This improves the efficiency of a blockchain.
    3. They allow for Simple Payment Verification (SPV), which helps you to verify a transaction without downloading an entire block or blockchain. This allows you to send and receive transactions using a light-client node — more commonly known as a crypto wallet.
- When verifying data using a Merkle tree, there is a Prover and a Verifier:
    - A Prover: Does all the calculation to create the merkle root (just a hash!)
    - A Verifier: Does not need to know all the values to know for certain one value is in the tree
- Merkle trees are a huge benefit to the Verifier.
    - You either produce a proof successfully, meaning data verification passes, or you don't, meaning your piece of data was not present when the Merkle root hash was calculated (or you performed the calculation wrong!).

#### Logarithmic Scaling
![Logarithmic Scaling](https://res.cloudinary.com/divzjiip8/image/upload/v1667181087/guides/Screen_Shot_2022-10-30_at_6.51.12_PM.png)
- The amount of proof pieces that you need scales logarithmically to the size of the array of data you need to feed into the Merkle tree hash algorithm.

#### Merkle Tree Vocabulary Summary
- **Merkle tree**: a structure used in computer science to validate data
- **Merkle root**: the hash contained in the block header, which is derived from the hashes of all other transactions in the block
- **Merkle path**: represents the information which the user needs to calculate the expected value for the Merkle root for a block, from their own transaction hash contained in that block. The Merkle path is used as part of of the Merkle proof
- **Merkle proof**: proves the existence of a specific transaction in a specific block (without the user needing to examine all the transactions in the block). It includes the Merkle root and the Merkle path

#### Conclusion
- Merkle trees are a very popular data structure in blockchains.
- It's important to understand the low-level of blockchain storage and the implications of such decisions.
- Keeping data storage lean and efficient is the reason behind using structures like Merkle trees - this understanding is essential as you start building out dApps, you always want to be lean and efficient with your data storage.
- Why? Because on Ethereum, the less efficient your use of data storage, the more expensive your program will be for you and your users.

### Patricia Merkle Tries
#### Intro
- Bitcoin was the first blockchain-based decentralized network ever.
- It popularized the use of Merkle trees for scalable transaction inclusion.
- Ethereum also uses Merkle trees but since Ethereum is a completely different design, it also uses one other important tree data structure for some of its data storage needs: Patricia Merkle Tries.
- This is the last data structure heavy day.
- If you've made it this far, you are doing fantastic! Patricia Merkle Tries are the first introduction into Ethereum-specific fundamentals, let's dive in...

#### REVIEW: Bitcoin: Block Architecture
![Bitcoin Block Architecture](https://www.researchgate.net/publication/343236094/figure/fig1/AS:917904996462593@1595857013751/Bitcoin-block-structure.ppm)
- In the previous section, we covered how Merkle trees are used to efficiently record a large amount of transactions into blocks, without needing to actually include them all - the merkleRootHash is all that is needed to commit those transactions.

#### First Look: Ethereum Block Architecture
- Bitcoin's architecture is simple: it's a ledger that keeps track of transactions using a UTXO model.
- Since Ethereum keeps track of a larger amount of state data, the block architecture is completely different:
![Ethereum Block Architecture](https://i.stack.imgur.com/eOwjD.png)
- Why are you showing me block architectures, aren't we covering trees?
Well, because these blocks contain references to the tree data structures we are focusing on.
    - The main goal here of showing the block architecture first is: by the end of this lesson, you should be familiar with three of the staple Ethereum block properties included in the diagram above: State Root, Transaction Root, Receipt Root - just like in the last section we covered what the merkleRootHash was in the context of a Bitcoin block, we will now look at three new similar tree uses in Ethereum.
> Woah, that's a lot of properties in an Ethereum block! Don't worry, we will cover these further in the bootcamp. We have to tackle the low-level ones first. ;

#### REVIEW: Merkle Trees in Bitcoin
- Merkle trees are fantastic for transactions.
- They are the perfect data structure.
- Transactions are static and should never change after being committed.
- They are "set in stone" via the Merkle hash root construction.
- Merkle trees are not a data structure fit for editting, so edit time -- how efficient it is to change a record -- does not matter here.
- The main goal behind their usage is to prove the consistency of data as the blockchain grows.
- Thanks to Merkle trees, we can rest assured that a transaction existed at one point in time in a block.
- How? Just by constructing the Merkle proof!
- Not only this, Merkle proof construction is extremely efficient at scale since they are computationally fast to compute and require only small chunks of data to be communicated over the network.

#### Trees in Ethereum
- Ethereum makes use a data structure called a [radix trie, also referred to as a Patricia trie or a radix tree](https://www.cs.usfca.edu/~galles/visualization/RadixTree.html) and combines this data structure with a Merkle tree to create a Patricia Merkle Trie.
> Patricia Trie + Merkle Tree = Patricia Merkle Trie (pronounced either "tree" or "try")

#### Radix Trie
- "Trie" comes from the word "retrieval", to give you a hint as to what Patricia Merkle Tries (also referred to as Patricia Merkle Trees 🎄) optimize for.
- **A radix trie is a tree-like data structure that is used to retrieve a string value by traversing down a branch of nodes that store associated references (keys) that together lead to the end value that can be returned:**
![Radix Trie](https://samczsun.com/content/images/2021/05/1920px-Patricia_trie.svg-1-.png)
> In grouping associated keys together, our search for the end value is optimized and more efficient

#### Patricia Merkle Trees
- A Merkle Patricia trie is a data structure that stores key-value pairs, just like a hash table.
- In addition to that, it also allows us to verify data integrity and the inclusion of a key-value pair.
> PMTs groups similar-value nodes together in the tree. That way, searching for "HELP" leads you along the same path as searching for "HELLO" - the first three letters are shared entries of different words. Good for space efficiency and read/write efficiency.
- Patricia Merkle Trees are basically Merkle trees on steroids! Efficient for data verification needs, but also efficient for editting that data.
- Patricia??
    - **P** = Practical
    - **A** = Algorithm
    - **T** = To
    - **R** = Retrieve
    - **I** = Information
    - **C** = Coded
    - **I** = In
    - **A** = Alphanumeric
![Patricia Merkle Trie](https://res.cloudinary.com/divzjiip8/image/upload/v1669865130/guides/Screen_Shot_2022-11-30_at_7.25.15_PM.png)
- The root node of this PMT is empty so we can store other words not starting with ‘n’, like "apple" or "hello".

### Why Does Ethereum Use a Merkle Patricia Trie?
- There are typically two types of data:
- **Permanent**
    - Once a transaction occurs, that record is sealed forever
        - This means that once you locate a transaction in a block’s transaction trie, you can return to the same path over and over to retrieve the same result
- **Ephemeral**
    - In the case of Ethereum, account states change all the time! (ie. A user receives some ether, interacts with a contract, etc)
    nonce, balance, storageRoot, codeHash
    - It makes sense that permanent data, like mined transactions, and ephemeral data, like Ethereum accounts (balance, nonce, etc), should be stored separately.
    - Merkle trees, again, are perfect for permanent data. PMTs are perfect for ephemeral data, which Ethereum is in plenty supply of.
    - Unlike transaction history, Ethereum account state needs to be frequently updated. The balance and nonce of accounts is often changed, and what’s more, new accounts are frequently inserted, and keys in storage are frequently inserted and deleted.

#### Ethereum Block Header
- The block header contains many pieces of data.
- Remember back to Week 1 PoW Mining? The block header is the hash result of all of the data elements contained in a block.
- It's kind of like the gift-wrap of all the block data.
- If you look at the Ethereum architecture diagram at the beginning of this lesson, the block header ends up hashing all of the data properties of the block. It also includes:
- **State Root**: the root hash of the state trie
- **Transactions Root**: the root hash of the block's transactions
- **Receipts Root**: the root hash of the receipts trie

#### Ethereum: State Trie
![Ethereum State Trie](https://res.cloudinary.com/divzjiip8/image/upload/v1669868801/guides/Screen_Shot_2022-11-30_at_8.26.05_PM.png)
- As shown in the above diagram, **the state trie acts as a mapping between addresses and account states**.
- It can be seen as a global state that is constantly updated by transaction executions.
- The Ethereum network is a decentralized computer and state trie is considered the hard drive.
- All the information about accounts are stored in the world state trie and you can retrieve information by querying it.
**Account Example**
- As mentioned above, the state trie is just a mapping that uses an address as the key and the account state (nonce, balance, etc) as the value returned.
![Ethereum State Trie](https://res.cloudinary.com/divzjiip8/image/upload/v1669868932/guides/Screen_Shot_2022-11-30_at_8.28.42_PM.png)
- This is what you would get back from a JavaScript request to the Ethereum world state.
- Just an object containing some data!
- That is all the account state is... but this is too much data to store in each block, so a root hash of it commits the data per block.

#### Ethereum: Transaction Trie
- **The transaction trie records transactions in Ethereum**.
- Once the block is mined, the transaction trie is never updated.
![Ethereum Transaction Trie](https://res.cloudinary.com/divzjiip8/image/upload/v1669869222/guides/Screen_Shot_2022-11-30_at_8.33.27_PM.png)
- Each transaction in Ethereum records multiple pieces specific to each transaction such as gasPrice and value.

**Transaction Example**
- You've probably seen this via services like Etherscan!
- All these services do is query the Ethereum blockchain for transaction data and then index it into an organized transaction viewer.
![Ethereum Transaction Trie](https://res.cloudinary.com/divzjiip8/image/upload/v1669869342/guides/Screen_Shot_2022-11-30_at_8.35.23_PM.png)
- You can even try querying the transactions trie directly using [Alchemy Composer](https://composer.alchemy.com/). Just take a random tx hash and use the ``eth_getTransactionByHash`` method - you'll get a response looking much like the object in the picture above.

#### Ethereum: Transaction Receipt Trie
- The transaction receipt trie records receipts (outcomes) of transactions.
    - Data including gasUsed and logs (events emitted are contained here!).
- Once the block is mined, the transaction receipt trie is never updated.
- Transaction Receipt Example
![Ethereum Transaction Receipt Trie](https://res.cloudinary.com/divzjiip8/image/upload/v1669869767/guides/Screen_Shot_2022-11-30_at_8.42.36_PM.png)
- Try it out on the [Alchemy Composer](https://composer.alchemy.com/) - just make sure to change the method to eth_getTransactionReceipt.

#### Conclusion
![Ethereum Block Header](https://res.cloudinary.com/divzjiip8/image/upload/v1669869958/guides/Screen_Shot_2022-11-30_at_8.45.47_PM.png)
- The above diagram is an excellent visualization into how the tries all end up being committed in every block via their root hash.
- The raw data is stored elsewhere in Ethereum, particularly archive nodes.
- Take a look back over the various architectures included in this lesson!
- Does the Ethereum block architecture diagram look less threatening?
- If so, good! We are learning as we go and we've just covered some of the lowest-level aspects of Ethereum data storage.
- Very few people learn these fundamentals. These are super important!
- Not only does learning them give you a more holistic understanding of Ethereum, this is knowledge applicable in all of computer science and even physics

### Further Reading
#### Merkle Trees in Ethereum
- Here is a [technical overview](https://blog.ethereum.org/2015/11/15/merkling-in-ethereum/) of merkling in Ethereum by Vitalik Buterin. Vitalik highlights several reasons for using Patricia Merkle Tries in Ethereum:
    - Efficient data verification (from its merkle properties)
    - More complex light-client queries
    - Can quickly change values and only recompute a portion of the tree (prevents some DDOS attack vectors)
    - There is a limit to the depth of the tree, which prevents other DDOS attack vectors
    - The order of the updates do not matter for the root hash
- Ethereum nodes maintain four tries:
    - A **state trie** which contains information about Ethereum accounts
    - A **storage trie** which is where we can write persistent data from smart contracts
    - A **transactions trie** which contains the transactions stored in a block
    - A **receipts trie** which contains log/event information from contracts
- Here is a [good overview of Patricia Merkle Trees on Medium](https://medium.com/shyft-network-media/understanding-trie-databases-in-ethereum-9f03d2c3325d). This article references some images from a [stack overflow](https://ethereum.stackexchange.com/a/6413/18953) answer which are extremely helpful to look at!
>  This starts with a good overview and quickly gets highly technical! Read as far as you are interested, we will not need to know the exact details of the Ethereum data storage implementation.

#### Quick Note on RLP
- We're going to be seeing RLP come up quite a bit.
- This is a serialization format used in Ethereum, you can think of it like JSON.
- It is used to send data from one machine to another in a format where the machine knows how to parse the data.
- You can find more information on [RLP here](https://eth.wiki/en/fundamentals/rlp).
> As the docs here point out "In summary, RLP is like a binary encoding of JSON, if JSON were restricted only to strings and arrays."