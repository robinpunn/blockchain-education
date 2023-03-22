## Blockchain Data Structure

---

### Blocks and Hashes
- Blockchain is aptly named! It is, in fact, a chain of blocks.
- Each block contains **transactional data**, some **metadata** describing the block itself, and a link to the previous block before it. 
- These components are fed into a *hash function* to create a unique sequence of bits to represent the block.

#### Hash Function
- Hash functions are used to take input data of any size and output a unique series of bits of a specific size representing that original data.
- An ideal cryptographic hash function can, given any input, return a **consistent** yet **seemingly random** output.
- It's important that the output is **consistent** so we can depend on putting the same inputs in and receiving the same output.
- It's also important for the **randomness** to be strong enough where it's impossible to re-construct the input from the output. 
- For example the ```SHA256``` algorithm will take an input like ```Dan`` and return a consistent output:
```js
const hash = SHA256("Dan");
console.log( hash.toString() ); // b12595…1cbe7e
```
>The log is shortened, it is actually 64 hexadecimal characters long. SHA256 outputs **256** bits. Since a hexadecimal character requires **4** bits, there are **64** hexadecimal characters in a SHA256 hash.
- If, instead my input was the lower case ```dan```, the result would be completely different:
```js
const hash = SHA256("dan");
console.log( hash.toString() ); // ec4f2d…56f1cb
```
- These hash outputs are **seemingly random** in relation to their inputs: ```"Dan"``` and ```"dan"```. 
- They are also **consistent**, putting in these inputs will always yield these same outputs. 
- For these reasons sha256 is an ideal cryptographic hash function and is often used in cryptographic programs.

#### Crypto-JS
- The ```crypto-js``` library provides us with several cryptographic utilities. 
- Specifically the ```SHA256``` method is an implementation of the SHA256 algorithm designed by the NSA.
- This function will take any string as an argument, regardless of size, and hash it to a 256 bit array. 
    - If we call toString() on that returned object we'll receive a 64 character hexadecimal string.

#### Hexadecimal
- You'll notice that the outputs shown consist of a set of characters ranging from ``a`` to ``f`` and ``0`` to ``9``. 
    - These are hexadecimal characters. 
    - It has become commonplace to use hexadecimal when displaying a hash.
>  You'll also often see a hash with a 0x in front of it. This prefix means that hexadecimal notation is being used. So if you see a string of characters "0x123abc", the "0x" is denoting the use of hexadecimals and the string's value is actually just "123abc".
- For the test file in this stage you'll notice that the hash of the block is being tested by the regular expression (regex) /^[0-9A-F]{64}$/i. 
    - It's simply testing to see that this is a hexadecimal output of 64 characters.
> Regular expressions can help define a search pattern for input data. Learn more about regular expressions on [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
**Why 64 Hexadecimal Characters?**
- A bit can represent two values: 0 and 1. 
- Two bits can represent four values 00, 01, 10 and 11. 
- Four bits can represent 16 values 0000 through 1111. 
- We can map each of these values to a character in the hexadecimal alphabet since it contains 16 characters! 
- Since SHA256 outputs 256 bits, we divide that by the number of bits to represent a hexadecimal character (4) to get 64 characters.

### Adding Data to the Hash
- Now it's time to add data to our hash. This will ensure that the block's hash is tied to its contents!

#### Data Security
- In this stage we use data to represent some arbitrary data that can be stored in a block.
- We hash the data to create a small, unique representation of that data.
- If the data ever changed inside of a block, we would see that reflected in the block's hash. It would be entirely different!
> For real blockchains, data is generally a set of transactions stored in a [merkle tree](https://en.wikipedia.org/wiki/Merkle_tree)...
- We can add other properties to the hash like a timestamp for the time the block was mined.
- This way, the block is tied to a specific point in time.
- It would be virtually impossible for someone to create a hash from the same data and a different timestamp.

#### Genesis Block
- The genesis block is the first block in the chain, where it all kicks off!
- Every block after the genesis block links back to the first one, but the genesis block has no previous block!

- Here are some examples of genesis blocks on live blockchains displayed in their respective block explorers:
#### Bitcoin Genesis Block
- Here's [Bitcoin's Genesis Block on Block Explorer](https://blockstream.info/block/000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f) on January 3rd, 2009
#### Ethereum Genesis Block
- Here's [Ethereum's Genesis Block on EtherScan](https://etherscan.io/block/0) on July 30th, 2015.

#### Adding Blocks
```js
const blockchain = new Blockchain();
const block = new Block("Charlie sent Dave 2 BTC");

blockchain.addBlock(block);

console.log(blockchain.chain.length); // 2
```

#### Previous Hash
![Blockchain](https://res.cloudinary.com/divzjiip8/image/upload/c_scale,w_800/v1580327751/Frame_1_86_vctqau.png)
    - This creates a chain where any change to the data of an earlier block will affect each subsequent block.

#### Changing Data
- The diagram below shows how each block contains a hash of the block data and the previous block hash. Understanding this architecture will help us understand why a blockchain is considered so secure.
![Block](https://res.cloudinary.com/divzjiip8/image/upload/c_scale,w_800/v1580327751/Frame_1_86_vctqau.png)
- What would happen if we changed Alice's BTC to "4 BTC" in the Genesis Block?
- Let's highlight any changes in red:
![Change](https://res.cloudinary.com/divzjiip8/image/upload/c_scale,w_800/v1580327902/Frame_2_1_lcwc4g.png)
- Every single hash changed
- Since the first block data affected the hash calculation of the Genesis Block, its hash changed.
    - The Genesis hash then affects the hash calculation of Block #1 since it's hash includes the previous block's hash (Genesis Block hash).
    - Therefore, Block #1's hash has changed as well.
    - The Block #1 hash then affects the hash calculation of Block #2.
    - This sort of pattern will continue until the Nth block in an N length blockchain.
    - With that in mind, we can conclude that changing an earlier block in a blockchain will always affect every block after that initial block change.
- This means that to make even the slightest change in the data of the genesis block would require replacing the entire blockchain.
> The reason blockchains are secure is that a massive network is continuously working to **compute a single block** while a hacker would need to **compute multiple blocks** to actually affect the history of a blockchain. This process of computation is called **mining** and we'll talk about why it's computationally expensive in a future stage.

#### Chain Validation
- Blockchains are run by a network of computers.
    - When a computer finds a new block, it broadcasts its new version of the blockchain to all of its peers.
    - There may be multiple versions of the blockchain at any given time.
        - However, the longest valid blockchain is the accepted one.

#### Blockchain Consensus
- Blockchains are said to share a common source of truth.
    - This is because all machines operating in the network can come to a common consensus on what the truth is.
- The consensus mechanism we describe in this lesson is referred to as Proof of Work.
    - A major rule in Proof of Work is that the longest chain wins.
    - This rule is in place to ensure that the version of the blockchain with the most computational resources behind it is the current version of the truth.
**Why is it so difficult to compute a new block?**
- It is **designed to be difficult**.
    - The difficulty is a feature of a blockchain designed to require significant resources in order to derive a new block.
    - This is the security behind the network which makes it outrageously expensive to attack.
- The process by which the a new block is derived is called mining and the difficult of mining is adjusted by the network as new resources flow into and out of the system.

#### Mining
- Mining is the process by which new blocks are discovered for a blockchain.
    - A new block has to satisfy rules in order to fit into a blockchain.
- The new block must include a hash calculated by some metadata, some transactional data, and the previous hash of the block before it.
- One final rule is added to manipulate the difficulty of the block: The block's hash must contain a certain number of zeroes.
> The only way to derive this hash with the data mentioned is to add a random value, referred to as a **nonce**, to the data during the hashing calculation. Essentially, the computer must **continue to guess incessantly** until it finds a block that satisfies these conditions.
- Once a block is found, the computer broadcasts this block to the network and is rewarded financially for doing so.