## Build a Miner

---

### Table of Contents
1. [Mempool](#mempool)
    - [The Mempool](#the-mempool)
    - [Your Goal: Add Transaction](#your-goal-add-transaction)
1. [Mine Block](#mine-block)
    - [Mining Blocks](#mining-blocks)
    - [Your Goal: Mine Block](#your-goal-mine-block)
1. [Block Hash](#block-hash)
    - [Add Block Hash](#adding-block-hash)
    - [Your Goal: Add The Hash](#your-goal-add-the-hash)

---

### Mempool
#### The Mempool
- Users who want to make transactions will broadcast their transactions to the blockchain network. 
    - The mempool is a place for miners to keep those transactions before adding them to a block.
- Typically, the miner will take all the transactions with the highest transaction fees from the mempool. 
    - Then they'll add them to the block and attempt to find the proof of work.
    - [bitcoin miner fee priority](https://en.bitcoin.it/wiki/Miner_fees#Priority_transactions)
#### Your Goal: Add Transaction
- Your goal is to implement the ``addTransaction`` function, which adds transactions to the mempool.
1. Take the ``transaction`` sent to the function and push it on top of the ``mempool`` array.
```js
const SHA256 = require('crypto-js/sha256');
const TARGET_DIFFICULTY = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;
const mempool = [];
const blocks = [];

function addTransaction(transaction) {
    mempool.push(transaction);
}

function mine() {
    // TODO: mine a block
}

module.exports = {
    TARGET_DIFFICULTY,
    MAX_TRANSACTIONS,
    addTransaction,
    mine,
    blocks,
    mempool
};
```

### Mine Block
#### Mining Blocks
 - In Bitcoin, blocks contain quite a bit of information in their header: the software version, a timestamp, the merkle root of its transactions, the previous block hash, and the difficulty.
#### Your Goal: Mine Block
- The goal of this stage is to update the ``mine()`` fuction to create a new block with a unique identifier and add it to our ``blocks`` array.
- For the purposes of this mining exercise, our block will be an object with a single property: an ``id`` that is equal to the **block height** prior to it being mined.
1. Update the ``mine()`` function to create a new block object with a single property: ``id``
1. Set the ``id`` property to the block height prior to the new block being added
1. Push the block object into the ``blocks`` array
```js
const SHA256 = require('crypto-js/sha256');
const TARGET_DIFFICULTY = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;
const mempool = [];
const blocks = [];

function addTransaction(transaction) {
    mempool.push(transaction);
}

function mine() {
    const block = { id: blocks.length }
    blocks.push(block);
}

module.exports = {
    TARGET_DIFFICULTY,
    MAX_TRANSACTIONS,
    addTransaction,
    mine,
    mempool,
    blocks,
};
```
### Block Hash
#### Adding Block Hash
- Typically, all the information in the header of the block is hashed together to create a unique hash based on those properties.
- If anything changes in the header, it will affect the hash.
    - Since each block also contains the hash of the block before it, it will affect every future block as well.
#### Your Goal: Add the Hash
1. Stringify the block object using JSON.stringify
1. Take the SHA256 hash of the stringified block object
1. Set the resulting value to a hash property on the mined block just before mining it
>  Do not add the ``hash`` property on the block until after calculating the hash!
```js
const SHA256 = require('crypto-js/sha256');
const TARGET_DIFFICULTY = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;
const mempool = [];
const blocks = [];

function addTransaction(transaction) {
    mempool.push(transaction);
}

function mine() {
    const block = { id: blocks.length }
    const hash = SHA256(JSON.stringify(block));
    blocks.push({ ...block, hash });
}

module.exports = {
    TARGET_DIFFICULTY,
    MAX_TRANSACTIONS,
    addTransaction,
    mine,
    mempool,
    blocks,
};
```

### Block Size
- In Bitcoin, there is a specific block size limit that cannot be exceeded.
    - The number of transactions that will fit inside of a block varies due to transactions being of all different sizes.
-  Deciding the block size in bitcoin has been quite [controversial](https://en.bitcoin.it/wiki/Block_size_limit_controversy)

### Target Difficulty
- In bitcoin, the difficulty is adjusted every 2016 blocks, which is about every two weeks with the blocks being mined on average every 10 minutes.
- At that point, the difficulty is adjusted to attempt to keep the mining intervals around that 10 minute per block mark.