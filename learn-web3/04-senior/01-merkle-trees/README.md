# [How to create Merkle Trees for airdrops](https://learnweb3.io/degrees/ethereum-developer-degree/senior/how-to-create-merkle-trees-for-airdrops/)

### Creating large airdrops in a gas-efficient way using Merkle Trees
- Merkle Trees are a fundamental concept in blockchain technology.
    - They're a special kind of binary tree that is used to encode large chunks of information.
    - The cool thing about Merkle Trees is that they kind of 'build up' from the bottom-up and allow you to verify if some value is present in the tree or not without having to loop over every element of the tree.
    - This can be quite useful, as we will see.
###  What is a Merkle Tree?
- A Merkle tree is a type of hash tree in which each leaf node is labeled with the cryptographic hash of a data block, and each non-leaf node is labeled with the cryptographic hash of its child nodes' labels.
    - The majority of hash tree implementations are binary (each node has two child nodes), but they can also have many more child nodes.