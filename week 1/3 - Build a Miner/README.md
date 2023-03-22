## Build a Miner

---

### The Mempool
- Users who want to make transactions will broadcast their transactions to the blockchain network. 
    - The mempool is a place for miners to keep those transactions before adding them to a block.
- Typically, the miner will take all the transactions with the highest transaction fees from the mempool. 
    - Then they'll add them to the block and attempt to find the proof of work.
    - [bitcoin miner fee priority](https://en.bitcoin.it/wiki/Miner_fees#Priority_transactions)

### Mining Blocks
 - In Bitcoin, blocks contain quite a bit of information in their header: the software version, a timestamp, the merkle root of its transactions, the previous block hash, and the difficulty.

### Block Hash
- Typically, all the information in the header of the block is hashed together to create a unique hash based on those properties.
- If anything changes in the header, it will affect the hash.
    - Since each block also contains the hash of the block before it, it will affect every future block as well.

### Block Size
- In Bitcoin, there is a specific block size limit that cannot be exceeded.
    - The number of transactions that will fit inside of a block varies due to transactions being of all different sizes.
-  Deciding the block size in bitcoin has been quite [controversial](https://en.bitcoin.it/wiki/Block_size_limit_controversy)

### Target Difficulty
- In bitcoin, the difficulty is adjusted every 2016 blocks, which is about every two weeks with the blocks being mined on average every 10 minutes.
- At that point, the difficulty is adjusted to attempt to keep the mining intervals around that 10 minute per block mark.