### Where is the Ether?
- If you take a look at the test cases you'll see that there will be three blocks mined with several transactions in each one.
    - The addresses where the ether is sent to will be randomly generated. 
    - It is up to you to find all of these addresses and return them in an array.
        - await ``provider.getBlockNumber()`` will return the current block number.
        - await ``provider.getBlock(blockNumber)`` will return the block object for the given block number.
        - The block object has a ``transactions`` property which is an array of transaction hashes.


