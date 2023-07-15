# [The bug which cost Ethereum $60 million dollars: Re-entrancy](https://learnweb3.io/degrees/ethereum-developer-degree/senior/the-bug-which-cost-ethereum-60-million-dollars-re-entrancy/)
- Re-Entrancy is one of the oldest security vulnerabilities discovered in smart contracts.
    - The exact vulnerability caused the infamous 'DAO Hack' of 2016.
    - Over 3.6 million ETH was stolen in the hack, which is worth billions of dollars today.

### What is Re-Entrancy?
- Re-Entrancy is the vulnerability in which if Contract A calls a function in Contract B, Contract B can then call back into Contract A while Contract A is still processing.
- This can lead to some serious vulnerabilities in Smart contracts, often creating the possibility of draining funds from a contract.
