# [Indexing data using The Graph's Indexer](https://learnweb3.io/degrees/ethereum-developer-degree/junior/indexing-data-using-the-graphs-indexer/)
- The Graph is a decentralized query protocol and indexing service for the blockchain. 
    - It allows developers to easily track events being emitted from smart contracts on various networks, and write custom data transformation scripts, which are run in real time. 
    - The data is also made available through a simple GraphQL API which developers can then use to display things on their frontends.

### How it work
1. A dApp sends a transaction and some data gets stored in the smart contract. 2/ This smart contract then emits one or more events.
1. Graph's node keeps scanning Ethereum for new blocks and the data for your subgraph that these blocks may contain.
1. If the node finds an event you were looking for and defined in your subgraph, it runs the data transformation scripts (mappings) you defined.
    - The mapping is a WASM (Web assembly) module that creates or updates data Entities on the Graph Nodes in response to the event.
1. We can query the Graph's node for this data using the GraphQL Endpoint