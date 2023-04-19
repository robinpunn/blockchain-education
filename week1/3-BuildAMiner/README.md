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
1. [Mine Tx](#mine-tx)
    - [Mine Block](#block-size)
    - [Your Goal: Mine Transactions](#your-goal-mine-transactions)
1. [Difficulty](#diffuculty)
    - [Target Difficulty](#target-difficulty)
    - [Your Goal: Proof of Work](#your-goal-proof-of-work)

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
- **SOLUTION**
```js
const SHA256 = require('crypto-js/sha256');
const TARGET_DIFFICULTY = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;

const mempool = [];
const blocks = [];

function addTransaction(transaction) {
    // TODO: add transaction to mempool
    mempool.push(transaction)
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
- **SOLUTION**
```js
const SHA256 = require('crypto-js/sha256');
const TARGET_DIFFICULTY = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;

const mempool = [];
const blocks = [];

function addTransaction(transaction) {
    // TODO: add transaction to mempool
    mempool.push(transaction)
}

function mine() {
    // TODO: mine a block
    let block = {
        id: blocks.length
    }
    blocks.push(block)
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
- **SOLUTION**
```js
const SHA256 = require('crypto-js/sha256');
const TARGET_DIFFICULTY = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;

const mempool = [];
const blocks = [];

function addTransaction(transaction) {
    // TODO: add transaction to mempool
    mempool.push(transaction)
}

function mine() {
    // TODO: mine a block
    let block = {
        id: blocks.length
    }
    block.hash = SHA256(JSON.stringify(block))
    blocks.push(block)
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

### Mine Tx
#### Block Size
- In Bitcoin, there is a specific block size limit that cannot be exceeded.
    - The number of transactions that will fit inside of a block varies due to transactions being of all different sizes.
-  Deciding the block size in bitcoin has been quite [controversial](https://en.bitcoin.it/wiki/Block_size_limit_controversy)
#### Your Goal: Mine Transactions
1. Inside the ``mine`` function, pull transactions off the mempool and include them in the block in an array called ``transactions``
1. Remove each transaction you include in the block from the ``mempool``
1. Add the ``transactions`` array to the block before hashing the block
> Do not include more transactions in the block than the ``MAX_TRANSACTIONS`` limit.
- **SOLUTION**
```js
const SHA256 = require('crypto-js/sha256');
const TARGET_DIFFICULTY = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;

const mempool = [];
const blocks = [];

function addTransaction(transaction) {
    // TODO: add transaction to mempool
    mempool.push(transaction)
}

function mine() {
    // TODO: mine a block
    let block = {
        id: blocks.length,
        transactions: mempool.splice(0,MAX_TRANSACTIONS),
    }
    block.hash = SHA256(JSON.stringify(block))

    blocks.push(block)
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

### Diffuculty
#### Target Difficulty
- In bitcoin, the difficulty is adjusted every 2016 blocks, which is about every two weeks with the blocks being mined on average every 10 minutes.
- At that point, the difficulty is adjusted to attempt to keep the mining intervals around that 10 minute per block mark.
#### Your Goal: Proof of Work
- Now it's time to actually mine the block. This is where we get the work part of proof of work!
1. In the ``mine`` function, prior to hashing the block, add a ``nonce`` property. This property should start at ``0``
1. Keep changing the nonce until you find a hash that is **less than** the ``TARGET_DIFFICULTY``
- You can compare a ``BigInt`` to another ``BigInt`` using the JavaScript comparison operators. You can convert from a hash to be a ``BigInt`` by:
    ```js
    const hash = SHA256("example");
    const int = BigInt(`0x${hash}`);
    ```
- **SOLUTION**
```js
const SHA256 = require('crypto-js/sha256');
const TARGET_DIFFICULTY = BigInt(0x0fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);
const MAX_TRANSACTIONS = 10;

const mempool = [];
const blocks = [];

function addTransaction(transaction) {
    // TODO: add transaction to mempool
    mempool.push(transaction)
}

function mine() {
    console.log(mempool.length)
    // TODO: mine a block
    let block = {
        id: blocks.length,
        transactions: mempool.splice(0,MAX_TRANSACTIONS),
        nonce: 0
    }
    block.hash = SHA256(JSON.stringify(block))

    while(BigInt(`0x${block.hash}`)>TARGET_DIFFICULTY){
        block.nonce ++
        block.hash = SHA256(JSON.stringify(block))
    }

    blocks.push(block)
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