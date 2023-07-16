# [Build your own MEV searcher using Flashbots](https://learnweb3.io/degrees/ethereum-developer-degree/senior/build-your-own-mev-searcher-using-flashbots/)

### Maximal Extractable Value (MEV)
- MEV is a relatively new concept in the world of blockchains, and one that carries with it a lot of controversy.
    - It refers to the maximum value that can be extracted from the block production apart from the standard block rewards.
- Previously, it used to be called Miner Extractable Value, since miners were best positioned to extract value from block production, but as we move towards Proof of Stake and miners get replaced by validators, a more generic rename has been done to call it Maximal Extractable Value.

### What is MEV?
- In a nutshell, it's the concept of extracting value (profit) by making certain types of transactions on chain that are not block rewards themselves.
    - Originally, it started happening because miners had control over which transactions they'd like to include in a block, and in which order.
    - Since when creating a block, miners can include, exclude and change the transactions of the block as they wish, this means they can favor some transactions as compared to others and gain some additional profits by doing so.
    - Note that we are talking about miners right now but things will change after [the merge](https://ethereum.org/en/roadmap/merge/).

### Flashbots
- We cannot talk about MEV without talking about Flashbots.
    - Flashbots is an independent research project, which extended the ``go-ethereum`` client with a service that allows ``Searchers`` to submit transactions directly to ``Miners``, without having to go through the public mempool.
    - This means transactions submitted by a ``Searcher`` are not visible to others on the mempool unless they actually get included in a block by a miner, at which point it's too late to do anything about it.
- As of today, the majority of MEV transactions take place through the Flashbots service, which means generalized frontrunners as described above are no longer as profitable as they used to be.
    - Those frontrunners are based on the idea of copying transactions from the mempool and submitting them with a higher gas fees.
    - Through Flashbots, however, transactions skip the mempool entirely, and therefore generalized frontrunners cannot pick up most of the MEV happening today.