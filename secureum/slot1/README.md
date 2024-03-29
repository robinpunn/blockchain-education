## Slot 1 Ethereum 101

---
### Table of Contents
1. [Block 1](#block-1)
	1. [What is Ethereum?](#1-what-is-ethereum)
	2. [Turing Complete](#2-turing-complete)
	3. [Infrastructure](#3-infrastructure)
	4. [Properties](#4-properties)
	5. [Purpose](#5-purpose)
	6. [Vs Bitcoin Script](#6-vs-bitcoin-script)
	7. [Vs Bitcoin Blockchain](#7-vs-bitcoin-blockchain)
	8. [Core Components](#8-core-components)
	9. [More Core Components](#9-more-core-components)
	10. [Halting Problem](#10-halting-problem)
	11. [Gas Metering](#11-gas-metering)
	12. [Gas Mechanism](#12-gas-mechanism)
	13. [DApp](#13-dapp)
	14. [Web 2.0 vs Web 3.0](#14-web-20-vs-web-30)
	15. [Ethereum Triad](#15-ethereum-triad)
	16. [Decentralization](#16-decentralization)
	17. [Native Currency](#17-native-currency)
	18. [Cryptography](#18-cryptography)
	19. [ECDSA](#19-ecdsa)
	20. [Private Key](#20-private-key)
2. [Block 2](#block-2)
	21. [Public Key](#21-public-key)
	22. [Ethereum State](#22-ethereum-state)
	23. [Ethereum Account](#23-ethereum-account)
	24. [Account Types](#24-account-types)
	25. [EOA Ownership](#25-eoa-ownership)
	26. [EOA](#26-eoa)
	27. [Contract Account](#27-contract-account)
	28. [Smart Contracts](#28-smart-contracts)
	29. [Keccak-26](#29-keccak-256)
	30. [EOA Address](#30-eoa-address)
	31. [Transaction](#31-transaction)
	32. [Transaction Properties](#32-transaction-properties)
	33. [Transaction Components](#33-transaction-components)
	34. [Nonce](#34-nonce)
	35. [gasPrice](#35-gasprice)
	36. [gasLimit](#36-gaslimit)
	37. [recipient](#37-recipient)
	38. [value](#38-value)
	39. [Data](#39-data)
	40. [v,r,s](#40-vrs)
3. [Block 3](#block-3)
	41. [Signature Purpose](#41-signature-purpose)
	42. [Contract Creation](#42-contract-creation)
	43. [Transactions vs Messages](#43-transactions-vs-messages)
	44. [Transactions and Blockchain](#44-transactions-and-blockchain)
	45. [Block](#45-block)
	46. [Ethereum Node/Client](#46-ethereum-nodeclient)
	47. [Ethereum Miners](#47-ethereum-miners)
	48. [Block Gas Limit](#48-block-gas-limit)
	49. [Ghost](#49-ghost)
	50. [Consensus](#50-consensus)
	51. [Ethereum State](#51-ethereum-state)
	52. [Ethereum PoW](#52-ethereum-pow)
	53. [Block Header](#53-block-header)
	54. [State Root](#54-state-root)
	55. [Tx Receipt](#55-tx-receipt)
	56. [Tx Gas](#56-tx-gas)
	57. [EVM](#57-evm)
	58. [Ethereum Code](#58-ethereum-code)
	59. [EVM Architecture](#59-evm-architecture)
	60. [Stack](#60-stack)
4. [Block 4](#block-4)
	61. [Memory](#61-memory)
	62. [Storage](#62-storage)
	63. [Calldata](#63-calldata)
	64. [EVM Architecture](#64-evm-architecture)
	65. [EVM Ordering](#65-evm-ordering)
	66. [Instruction Set](#66-instruction-set)
	67. [Stop and Arithmetic](#67-stop-and-arithmetic)
	68. [Comparison and Bitwise Logic](#68-comparison-and-bitwise-logic)
	69. [SHA3](#69-sha3)
	70. [Environmental Information](#70-environmental-information)
	71. [Block Information](#71-block-information)
	72. [Stack, Memory, Storage, and Flow](#72-stack-memory-storage-and-flow)
	73. [Push Operations](#73-push-operations)
	74. [Duplication Operations](#74-duplication-operations)
	75. [Exchange Operations](#75-exchange-operations)
	76. [Logging Operations](#76-logging-operations)
	77. [System Operations](#77-system-operations)
	78. [Gas Costs](#78-gas-costs)
	79. [Transaction Reverts](#79-transaction-reverts)
	80. [Transaction Data](#80-transaction-data)
5. [Block 5](#block-5)
	81. [ABI](#81-abi)
	82. [Function Selector](#82-function-selector)
	83. [Block Explorer](#83-block-explorer)
	84. [Mainnet](#84-mainnet)
	85. [EIP](#85-eip)
	86. [Eth 2.0](#86-eth-20)
	87. [Immutable Code](#87-immutable-code)
	88. [Web3](#88-web3)
	89. [Languages](#89-languages)
	90. [Onchain vs Offchain](#90-onchain-vs-offchain)
	91. [Open Source and Transparent](#91-open-source-and-transparent)
	92. [Unstoppable and Immutable](#92-unstoppable-and-immutable)
	93. [Pseudonymity and DAOs](#93-pseudonymity-and-daos)
	94. [Arch and Lang Tools](#94-arch-lang-tools)
	95. [Byazantine Threat Model](#95-byzantine-threat-model)
	96. [Keys and Tokens](#96-keys-and-tokens-5116)
	97. [Composability](#97-composability)
	98. [Timescale](#98-timescale)
	99. [Test in Prod](#99-test-in-prod)
	100. [SSDLC Audits](#100-ssdlc---audits)
	101. [State of Audits](#101-state-of-audits)
6. [Quiz](#quiz)
---

### [Block 1](https://www.youtube.com/watch?v=44qhIBMGMoM)
#### 1. What is Ethereum?
- Ethereum is a  blockchain: [Whitepaper](https://ethereum.org/en/whitepaper/)
	- The white paper proposes Ethereum to be a next generation blockchain
		- It supports smart contracts allowing decentralized applications to be built on the platform
#### 2. Turing Complete 
- A fundamental aspect of Ethereum is that it is **Turing complete**
	- [Turing complete - Computerphile](https://www.youtube.com/watch?v=RPQD7-AOjMI)
	- [Turing complete wikipedia](https://en.wikipedia.org/wiki/Turing_completeness)
	- At a high level, Turing complete refers to the expressiveness of a programming language
- Ethereum supports Turing complete programming languages and smart contracts on Ethereum are Turing complete
	- Smart contracts can encode arbitrary rules over arbitrary state
	- States can be read and written using rules
	- [Finite state automaton](https://en.wikipedia.org/wiki/Finite-state_machine)
	- Any state/any rule allows Ethereum to support any application
#### 3. Infrastructure
- At a high level, Ethereum is an open source, globally decentralized computing infrastructure that executes smart contracts
- Because it is a blockchain, there are many nodes that need to synchronize and agree upon the global state
- The native currency of Ethereum is ether 
	- ether is used to meter the amount of resources being used when smart contracts run
	- ether is used to constrain how long and how much resources smart contracts use
- All of this infrastructure enables Ethereum to act as a world computer
#### 4. Properties
- Applications are permissionless: No centralized service that dictates what can exist
- High availability: Ethereum is always up and running, no centralized infrastructure choke points
- High auditability: Everything on the blockchain is auditable
- Hight transparency neutrality: By design, everything is meant to be transparent
- All of these properties create an environment of censorship resistance with low counter party risk
#### 5. Purpose
- According to the whitepaper, the initial purpose of Ethereum was not to be a currency or a payment network 
- ether is necessary and integral for operation, but it isn't the end goal of Ethereum
- The idea for ether was for it to be a utility token
	- In order to use Ethereum, you need to pay ether
#### 6. Vs Bitcoin Script
- Bitcoin uses script, which is a scripting language that is limited by design
- Script evaluates spending conditions dealing mainly with true/false
- Ethereum supports EVM (Ethereum virtual machine) which by design is meant to be a general purpose programming language
	- It is Turing complete allowing arbitrary code and complexity
#### 7. Vs Bitcoin Blockchain
- The Bitcoin blockchain focuses on the ownership of bitcoin
- Bitcoin tracks the transfer of bitcoin through UTXOs (unspent transaction outputs)
- Ethereum focuses on general purpose state... state that doesn't just focus on the ownership of ether
	- It focuses on anything that can be encoded by the EVM programming language
#### 8. Core Components
- The underlying network that Ethereum is built on is a P2P network
	- Runs on TCP port 30303: DEVp2p
- The networks we use today use the TCP/IP stack and the paradigm is that of clients and servers
- Transactions include: sender, recipient, value, data
- State machine -> EVM -> HLLs (Solidity) -> bytecode
- Data structures used within the Ethereum protocol include many of the common ones such as arrays and basic value and reference types
	- Merkle Patricia Trees are used to optimize the way Ethereum handles state

#### 9. More Core Components
- Consensus algorithm
	- There are many P2P nodes in a blockchain trying to agree upon the global state
	- When ethereum was proof of work, it used the nakamoto consensus that was used in bitcoin
		- This is used as a for of [sybil resistance](https://en.wikipedia.org/wiki/Sybil_attack)
	- Ethereum 2.0 (serenity) transitions from PoW to PoS
	- Proof of work provides economic security
- [Ethereum clients](https://www.ethernodes.org/)
	- Geth, erigon, nethermind, openethereum
	- Anyone running an [Ethereum node is using an Ethereum client](https://ethereum.org/en/developers/docs/nodes-and-clients/)
	- Critical to the diversity and decentralization of Ethereum

#### 10. Halting Problem
- Turing completeness lends itself to a fundamental problem in computer science: [halting problem](https://en.wikipedia.org/wiki/Halting_problem)
- In the context of a smart contract, this could be an issue
- Ethereum deals with this problem by constraining the resources given to the smart contract
	- Metering is achieved through the concept of gas

#### 11. Gas Metering
- The EVM runs smart contract, smart contracts have machine code instructions, each instruction has a predetermined cost in gas units
- A transaction triggers the execution of a smart contract, the smart contract starts executing instructions, and the gas units for those instructions are consumed by the smart contract
	- A transaction that triggers a smart contract has to include a specific amount of gas as required by the logic of the smart contract
	- If the gas required during the execution of the smart contract exceeds the limit, the EVM will terminate execution
- Because of Turing completeness, there needs to be a bound on the use of resources which is the purpose of gas

#### 12. Gas Mechanism
- A transaction has to supply gas depending on the action it is triggering (units of gas)
- The price of gas is measured in ether
- Gas price is not fixed
	- It varies based on demand
- [EIP 1559](https://eips.ethereum.org/EIPS/eip-1559)
- Purchase "gas" by purchasing ether
- If the gas supplied exceeds the amount of gas consumed, the remaining gas is refunded

#### 13. DApp
- Decentralized Application... building applications on a decentralized infrastructure thereby making the applications decentralized
- DApps can be viewed as a web app frontend running on a peer to peer infrastructure
	- The P2P infrastructure is a combination of compute, storage, and network
- At a high level, a DApp is a web app frontend that interacts with a smart contract on a blockchain

#### 14. Web 2.0 vs Web 3.0
- Web 2.0: client-server paradigm, current existing infrastructure
	- Centrally managed with a "freemium" model focused on an advertising business model
	- Products are "free" and the user is the product
- Web 3.0 attempts to function from a P2P model
- The  model for web 3.0 is decentralized incentivized participation
#### 15. Ethereum Triad
- Ethereum -> compute
- Swarm? IPFS -> storage
- Whisper? Waku? Lens -> network
#### 16. Decentralization
- There are three types of decentralization
	- Architectural: in relation to the hardware... who owns them? who runs them?
	- Political: People behind the hardware (wetware)
	- Logical: data structures used to build out the application (software)
#### 17. Native Currency
- Ether is divisible up to 18 decimals
- The smallest unit of ether is "wei"
	- 10^18 wei = 1 ether
	- 10^3 wei = 1 babbage
	- 10^6 wei = 1 lovelace
#### 18. Cryptography
- 2 classes of cryptography: symmetric and asymmetric
- Asymmetric cryptography is also known as public key cryptography which is used in the Ethereum protocol
- In symmetric cryptography, there is a single key
- In asymmetric cryptography, there is a key pair: public and private keys
	- The private key by definition is a secret and it is used to derive the public key
	- The public key is meant to be shared publicly
- The cryptography that is used is mostly about digital signatures rather than encryption at the protocol level
#### 19. ECDSA
- ECDSA (elliptic curve digital signature algorithm) is the digital signature algorithm used by Ethereum (also bitcoin)
- ECC (elliptic-curve cryptography) is an approach to public key cryptography based on a particular structure of algebraic curves (finite fields)
- The particular elliptic-curve in Ethereum is SECP-256k1 curve (refers to the parameters used in the elliptic curve)
- Elliptic curves/finite fields drive the underlying cryptography used in Ethereum public key cryptography
#### 20. Private Key
- The private key is meant to be a secret, it is 256 bit
- It is a random number used to derive the public key
- The public key is used to derive the address of an Ethereum account


### [Block 2](https://www.youtube.com/watch?v=zIeBfuXxuWs)
#### 21. Public Key
- The public key is not meant to be a secret
- It is derived from the private key
- A point on the elliptic curve calculated from the private key using elliptic curve multiplication
- The public key cannot be used to derive the private key
#### 22. Ethereum State
- The Ethereum state is made up of objects called accounts
- Each Ethereum account has a unique address associated with it
- The address is 20 bytes
- They are mainly used for account to account communication
- Accounts can engage in transfer of value and transfer of information
#### 23. Ethereum Account
- Each account has 4 fields
	- Nonce: acts a counter to make sure each tx can only be processed once (used to prevent replay attacks)
	- Balance: maintained in ether, the amount of ether the account has
	- Contract code
	- Contract storage
#### 24. Account Types
- Two account types
	- Externally Owned Account (EOA)
	- Contract Account
- EOA is controlled by a private key
- Contract accounts are controlled by code
#### 25. EOA Ownership
- Anyone that has a private key can create a digital signature that can control the ether present in the associated EOA
#### 26. EOA
- Accounts have a nonce, value, code, and storage
- An EOA does not have code or storage
- It is controlled by a private key that is used to create digital signatures from that account
	- These signatures can be used to sign transactions from that EOA which can trigger messages
	- Messages can trigger transfer of value or they can trigger smart contracts
#### 27. Contract Account
- Contract accounts have a code and storage field
- Whenever a smart contract receives a message, it triggers the code in the contract account
	- It runs the code and accesses any internal storage
- When smart contract code runs, it can send messages to other accounts or create new contracts
#### 28. Smart Contracts
- Smart contracts are autonomous agents
	- They are always present in the execution environment of the Ethereum blockchain
	- They are always ready to be triggered by a transaction/message which will result in the execution of code
	- The have access to the ether balance of the account and the contract storage
- The running of code results in the manipulation of the balance and the contract storage
#### 29. Keccak-256
- Keccak-256 is the cryptographic hash function used by Ethereum
	- [Properties of a cryptographic hash function](https://en.wikipedia.org/wiki/Cryptographic_hash_function)
- Related to the SHA-3 secure hash function
	- Finalized as the standard by [NIST](https://www.nist.gov/) in 2015
	- Keccak-256 was the winning candidate for the sha-3 competition (but it is different from the final adopted version of sha-3???)
- Keccak-256 is a fundamental primitive to many of the computations on Ethereum
#### 30. EOA Address
- Private key used to derive a public key in a one way derivation where the public cannot retrieve the private key
- The public key is hashed using keccak-256
	- The last 20 bytes (least significant?) of the hash is used to create the address
	- Address is 160 bits or 20 bytes
#### 31. Transaction
- Signed messages that originated outside the Ethereum blockchain
- Triggered by EOA... the digital signature derived from the private key
- Transactions trigger a state change on the blockchain... only transactions can trigger state changes
- Ethereum is a transaction based state machine
#### 32. Transaction Properties
- Atomic: all or nothing
	- they run from the beginning to the end completely
	- they cannot be divided/interrupted
- Serial: one after another
	- Transactions are executed sequentially, there is no overlapping
	- There is no parallelism when it comes to the execution of transactions
- Inclusion: miners run Ethereum nodes and they decide which txs to include within a block
	- This depends on multiple factors with the key ones being congestion and gas prices
- Order:  the specific order of transactions in a block is also chosen by miners
	- Congestion and gas prices are also key factors here
#### 33. Transaction Components
- Transactions are serialized binary messages that contain seven components
	- Nonce: sequence number issued by the EOA used prevent message replays
	- gasPrice: the amount of ether in wei that is paid by the sender
	- gasLimit: the maximum amount of gas units the sender is willing to pay
	- recipient: destination address
	- value: the amount of ether in wei that the sender is sending to destination
	- data: binary encoded payload of variable length that is sent as part of the transaction
	- v,r,s: the three components of the ECDSA signature
#### 34. Nonce
- Nonce === number used only once
- A sequence number used to prevent replay attacks
- In an EOA, the nonce is the number of transactions sent
- In a contract account, the nonce is the number of other contracts created by this contract account
#### 35. gasPrice
- The gasPrice is the price the sender is willing to pay for a particular transaction
- Measured in wei/gas unit
- gasPrice is NOT fixed by the Ethereum protocol
- the higher the gasPrice, the faster the transaction will get included by the miner in a block
- The price depends on the demand for the blockspace
- There is a limited number of space on the block
#### 36. gasLimit
- The maximum number of gas units the sender is willing pay
- Eth transfer: 21000 gas units
	- A transaction targeting a particular contract will require more gas units
		- If less gas than what is required is sent, an out of gas (OOG) error occurs
#### 37. recipient
- 20 byte address of the recipient account
- Can be an EOA or a contract address, depends on the target of the transaction
- Validation is not done by the protocol, this must be done at the UI level
- There is no "from" address that is a component of the transaction
#### 38. value
- The value of ether being sent by the sender to the recipient
	- If the recipient is an EOA, balance of recipient increases and balance of sender decreases
	- If the recipient is a contract, what happens is dependent on the data present in the transaction
		- If there is data present, the data represents the contract function that is being targeted and the value of ether being sent depends on the implementation of that function
		- If there is no data being sent, the contract's receive/fallback function is triggered
			- If the contract doesn't have a receive/fallback, that transaction results in an exception... ether remains with originator's account
#### 39. Data
- Data that is being sent from the sender to the recipient
- Relevant when the recipient is a contract account
- The data contains the contract function that is being targeted by the transaction
	- It contains the specific arguments that are relevant for that contract function
#### 40. v,r,s
- The final transaction component is the ECDSA siganture... 65 bytes in length
- It has three sub components: v, r,s
- r,s represent the signature component, they are 32 bytes each (64 bytes total)
- v is the recovery Identifier (1 byte in length)
- v can be 27/28 or chainIDx2 + 35/36
	- chainID is the identifier of the blockchain (Ethereum mainnet: chainID = 1)

### [Block 3](https://www.youtube.com/watch?v=ltvTIr4K63s&t)
#### 41. Signature Purpose
- The ECDSA signature has 3 purposes:
	- Authorization
		- Inclusion of the signature proves that the owner is the sender
	- Non-repudiation
		- Once a signature is included, it cannot be later denied that authorization was granted
	- Integrity
		- Proves that the transaction data has not been modified
#### 42. Contract Creation
- A transaction can result in contract creation
	- The creation transaction is a special transaction that is sent to a special destination address called the "zero address"... and address that has 0 in all its bits
- It contains the data payload which contains the bytecode of the contract that is being created
- It can also contain an optional ether amount in the value field in which case the new contract being created will have a starting balance
#### 43. Transactions vs Messages
- A transaction originates offchain and it targets an entity on the blockchain
- With a message, the origination and the destination are both onchain
- A transaction is produced by an EOA where an external actor (external to the blockchain) sends a signed data package onchain
	- This transaction can trigger a message
		- It can trigger a message to another EOA (which leads to a transfer of value)
		- It can trigger a message to a contract account
- A message can be triggered in two ways:
	- Triggered externally by a transaction (destination can be another EOA or contract account)
	- A message can be triggered internally within the EVM
		- Happens when a smart contract executes a call family of opcodes?
#### 44. Transactions and Blockchain
- Transactions are grouped together and included within a block
- Blocks are linked together and form a blockchain
#### 45. Block
- Blocks are batches of transactions
	- Every block contains a set of transactions that are grouped together
- Every block also contains the hash of the previous block
	- This is a cryptographic hash derived from the previous block state
	- - Every new block created contains a reference to its parent block
	- Transactions are strictly ordered within a block
- If any component of a historical block were to change, it would affect all of the following blocks
	- This behavior helps maintain the integrity/immutability of a blockchain
#### 46. Ethereum Node/Client
- An Ethereum node is a software application that implements the Ethereum protocol
	- The network is peer to peer with nodes communicating with each other
- An Ethereum client is a specific implementation of the Ethereum node
	- There are multiple Ethereum clients: Geth, OpenEthereum, Erigon, Nethermind
#### 47. Ethereum Miners
- Ethereum miners are entities running Ethereum nodes
- They receive transactions
	- They validate, execute, and combine transactions into blocks
-  Block validation: They provide a mathematical proof (proof of work)
	- Provided with a block reward (2 eth)
	- They are also rewarded with transaction fees
#### 48. Block Gas Limit
- Different from gasLimit specific to transactions
- Refers to the gas limit of the block
	- The total gas spent by  all the transaction in the block
- Caps the number of transactions that can be included within a block
- Block size isn't fixed in terms of the number of transaction but by the gas used by all the transactions
	- The reason for this is because every transaction can consume a different amount of gas
- Gas limit is set by Ethereum miners
	- Set at 15 million (PoW)
	- Represents the demand for the block space on Ethereum
#### 49. GHOST
- A transaction is sent, it is validated by a miner, transactions are placed into blocks, the blocks are propagated over the p2p network
	- Multiple miners are participating in this process simultaneously
- This leads to multiple valid blocks, but the canonical blockchain only needs to chose one block
	- The choice is dictated by the GHOST (greedy heaviest observed subtree protocol) protocol
- The protocol allows stale blocks up to 7 levels
	- Stale blocks are referred to as uncles or ommers
#### 50. Consensus
- Ethereum adopted the Nakamoto consensus from bitcoin
	- Addresses the problem of which miner's block should be included next to create the canonical blockchain
- There are two components to the solution: Proof of Work and the longest chain rule
#### 51. Ethereum State
- Ethereum state is a mapping from the address of the Ethereum account to the state contained within it
- As a data structure, this is implemented as a modified Merkle-Patricia tree
	- A combination of a merkle tree and a patricia tree with some changes specific to Ethereum
- A merkle tree is a type of binary tree
	- Composed of a set of nodes where the leaf nodes at the bottom of the tree contain the underlying data
	- All the intermediate nodes between the leaf nodes and the root contain the combined hash  of two child nodes
	- The top of the tree is the root hash
- A patricia tree (prefix tree/radix tree/trie) is represented by key-value pairs
	- The value are located in the leaf nodes
	- The keys allow for traversal from the root of the tree to the leaves
- Ethereum uses a combination of a merkle patricia tree modified to suit that particular Ethereum data structures
#### 52. Ethereum PoW
- Technically referred to as Ethash
	- (m,n) = PoW(Ha, Hn, d)
	- m = Hm ^ n <= 2 ** 256/Hd
	- n: Nonce, Hd - Difficulty
	- m: Mix Hash, d: Data Set
- A miner has to determine a combination of mix hash n and nonce n for every block to satisfy the constraint on the difficulty for the block
#### 53. Block Header
- Every block contains a block header along with the transactions and the headers of the ommer blocks
- Each block header has several components: parentHash, ommerHash, beneficiary, stateRoot, transactionsRoot, receiptsRoot, logsBloom, difficulty, number, gasLimit, gasUsed, extraData, timestamp, mixHash, nonce
	- parentHash: hash of the parent block's header (chains the blocks together)
	- beneficiary: the address that is rewarded for mining the block
	- root hashes: stateRoot, transactionsRoot, receiptsRoot
	- logsBloom: a bloom filter associated with logs
	- difficulty: on the context of PoW
	- number: block number, the number of blocks that have been mined so far
	- gasLimit: determines the number of transactions that can fit in a block
	- gasUsed: indicates the total gas used of all transactions in the block
	- timestamp: derived from unix time indicates the point in time the block was mined
	- mixHash, nonce: both are critical to PoW
#### 54. State Root
- Contained in the block header which has three roots one of which is the state root
	- Root hashes of the modified merkle patricia trees
- 256 bit Hash
- Leaves of the state root are key-value pairs of all the ethereum address-account pairs
	- Key: address
	- value: ethereum state within the account
		- every ethereum account has 4 fields:
			- nonce
			- balance
			- codeHash: Hash(code)
			- storageRoot: account storage
#### 55. Tx receipt
- Receipt can be thought of as the side effects of a particular transaction that are captured on the blockchain
- The transaction receipt is a tuple that contains 4 items:
	- Cumulative gas used: the total gas used in the block until after this particular tx
	- set of logs: related to the concept of events
	- bloom filter ( associated with logs): help in querying events in a faster way
	- status code
#### 56. Tx gas
- The ether that is used to purchase gas in a particular transaction is credited to the beneficiary address (the address typically under the control of a miner)
- Every transaction has a gasLimit that represents the maximum number of gas units that the transaction will pay
	- The difference between the gasLimit and the gasUsed is refunded to the sender (done at the same gas price indicated in the tx)
#### 57. EVM
- The execution component of the Ethereum blockchain is the EVM (Ethereum virtual machine)
- Run time environment for smart contracts
- The EVM is a quasi turing complete machine
#### 58. Ethereum Code
- The Ethereum code runs within the EVM
- The code is written in a low-level, stack based language referred to as EVM machine code
- The code consists of a series of bytes, referred to as bytecode
- Every byte represents a single operation
	- OPCODES are very simple and each of them are a single byte
#### 59. EVM Architecture
- EVM is a simple stack based architecture
	- EVM instructions operate on the stack
- Architecture is made up of 4 fundamental components:
	- stack
	- volatile memory (volatile/non volatile refers to the persistence of the data placed within memory)
	- non-volatile storage
	- calldata
- Every architecture has the concept of a world, in the case of EVM, the world size is 256-bits
#### 60. Stack
- The stack has 1024 elements and each element is 256 bits in length
- EVM instructions are allowed to operate with the top 16 stack elements
- Most EVM instructions operate with the stack
- There are stack specific operations: PUSH/POP/SWAP/DUP

### [Block 4](https://www.youtube.com/watch?v=MFoxW07ICKs&t)
#### 61. Memory
- The second component of the EVM architecture is memory
- Memory in EVM is volatile
	- This means that data placed in memory is not persistent across transactions on the blockchain
- Memory in the EVM is linear, it is a byte-array
	- Therefore it is addressable at a byte level
- Memory is zero initialized
- Three specific instructions that operate with memory
	- MLOAD: loads a word from memory and puts it onto the stack
	- MSTORE: stores a word in memory from the stack
	- MSTORE8: stores a single byte in memory from the stack
#### 62. Storage
- The next component of the EVM architecture is storage
- Unlike memory, storage in EVM is non-volatile
	- Data put in storage is persistent across transactions in the blockchain
- Storage is implemented as a key value store between 256-bit keys and 256-bit values
- Storage is zero initialized
- Every account has a storageRoot field
	- Implemented as a patricia merkle tree
	- captures all the storage associated with an account
	- storageRoot is captured as part of the stateRoot (one of the fields in the block header)
- Two instructions that operate specifically on storage:
	- SLOAD: loads a word from storage and puts it onto the stack
	- SSTORE: stores a word from the stack and puts it into storage
#### 63. Calldata
- Final component of the EVM architecture
- Used specifically for data parameters of transactions and message calls
- Read-only, cannot be written to
- Byte-addressable
- Three specific instructions that operate with calldata:
	- CALLDATASIZE: gives the size of the supplied calldata and puts it onto the stack
	- CALLDATALOAD: loads the calldata supplied onto the stack
	- CALLDATACOPY: copies the calldata to specific region of memory
#### 64. EVM Architecture
- Computer architectures are typically classified into either von neumann or Harvard
	- This depends on how code and data is handled within the architecture
		- Are they stored together? Are they transported together? How are they cached? etc.
- EVM code is stored separately in a virtual ROM
	- There are special instructions to access EVM code
#### 65. EVM Ordering
- [Big-endian ordering vs little-endian ordering](https://en.wikipedia.org/wiki/Endianness)
- EVM uses big-endian ordering
- Big-endian in the EVM means
	- the most significant byte of a word is stored at the smallest memory address
	- the least significant byte of a word is stored at the largest memory address
#### 66. Instruction Set
- All of the instructions in the EVM can be categorized into 11 categories
	1. Stop and Arithmetic
	2. Comparison and Bitwise logic
	3. SHA3
	4. Environmental Information
	5. Block Information
	6. Stack, Memory, Storage, and Flow
	7. Push
	8. Duplication
	9. Exchange
	10. Logging
	11. System
#### 67. Stop and Arithmetic
- The instructions below are in the form of [OPCODES](https://ethereum.org/en/developers/docs/evm/opcodes/)
	- 0x00 STOP 0 0
	- 0x01 ADD  2 1
	- 0x02 MUL  2 1
	- 0x03 SUB  2 1
	- 0x04 DIV  2 1
	- 0x05 SDIV 2 1
	- 0x06 MOD 2 1
	- 0x07 SMOD 2 1
	- 0x08 ADDMOD 3 1
	- 0x09 MULMOD 3 1
	- 0x0a EXP 2 1
	- 0x0b SIGNEXTEND 2 1
- In the notation above STOP has 0 items place and 0 items removed from the stack, ADD and the others have 2 items placed (the operands) on the stack and the computed result placed onto the stack and so on

#### 68. Comparison and Bitwise Logic
- Less than, greater than, sign less than, sign greater than, equality, is zero, bitwise and, bitwise or, xor, not, byte, shift left, shift right, signed right shift
	- 0x10 LT 2 1
	- 0x12 SLT 2 1
	- 0x20 GT 2 1
	- 0x13 SGT 2 1
	- 0x14 EQ 2 1
	- 0x15 ISZERO 1 1
	- 0x16 AND 2 1
	- 0x17 OR 2 1
	- 0x18 XOR 2 1
	- 0x19 NOT 1 1
	- 0x1a BYTE 2 1
	- 0x1b SHL 2 1
	- 0x1c SHR 2 1
	- 0x1d SAR 2 1
#### 69. SHA3
- SHA3 is a single instruction which computes the keccak-256 hash
	- 0x20 SHA3  2 1
#### 70. Environmental Information
- These instructions give information about the environment or the execution context of the smart contract that is executing the instructions
	- 0x30 ADDRESS  0 1
	- 0x31 BALANCE  1 1
	- 0x32 ORIGIN  0 1  (tx.origin)
	- 0x33 CALLER 0 1  (msg.sender)
	- 0x34 CALLVALUE  0 1 (msg.value)
	- 0x35  CALLDATALOAD  1 1
	- 0x36  CALLDATASIZE 0 1
	- 0x37 CALLDATACOPY 3 0
	- 0x38 CODESIZE  0 1
	- 0x39 CODECOPY 3 0 (copy code running in environment to memory)
	- 0x3a GASPRICE  0 1
	- 0x3b EXTCODESIZE 1 1
	- 0x3c EXTCODECOPY 4 0
	- 0x3d RETURNDATASIZE 0 1
	- 0x3e RETURNDATACOPY 3 0
	- 0x3f EXTCODEHASH 1 1
#### 71. Block Information
- Information about the transactions block
	- 0x40 BLOCKHASH 1 1
	- 0x41 COINBASE 0 1 (address that gets block reward/tx fees)
	- 0x42 TIMESTAMP 0 1
	- 0x43 NUMBER 0 1
	- 0x44 DIFFICULTY 0 1
	- 0x45 GASLIMIT 0 1
#### 72. Stack, Memory, Storage, and Flow
- Instructions for stack, memory, storage, and control flow
	- 0x50 POP 1 0
	- 0x51 MLOAD 1 1
	- 0x52 MSTORE 2 0
	- 0x53 MSTORE8 2 0 (stores single byte memory instead of word)
	- 0x54 SLOAD 1 1 (load words from storage)
	- 0x55 SSTORE 2 0 (load words to storage)
	- 0x56 JUMP 1 0 (control flow... jumps to specific location)
	- 0x57 JUMP1 2 0 (control flow... conditionally jumps based on the value specified)
	- 0x58 PC 0 1 (control flow... gives value of program counter)
	- 0x59 MSIZE 0 1 (gives the size of active memory in bytes)
	- 0x5a GAS 0 1 (amount of available gas)
	- 0x5b JUMPDEST 0 0 (no effect on control flow... marks a particular destination as being valid for previous jump instructions)
#### 73. Push Operations
- Instructions specific to the stack... place items onto the stack... 32 instructions
	- 0x60 PUSH1 0 1 (pushes a single byte onto the stack)
	- 0x61 PUSH2 0 1 (pushes 2 bytes onto the stack)
	- PUSH3, PUSH4, PUSH5, ...PUSH31
	- 0x7f PUSH32 0 1 (pushes a full word, 32bytes... 256-bits onto the stack)
#### 74. Duplication Operations
- Duplicate items that are already on the stack
	- 0x80 DUP1 1 2 (duplicates the first stack item)
	- DUP2, DUP3, ...DUP15
	- 0x8f DUP16 16 17
#### 75. Exchange Operations
- The final set of instructions that operate on stack items... exchange or swap items already on the stack
	- 0x90 SWAP1 2 2 (exchanges first and second stack items)
	- SWAP2, SWAP3, ...SWAP15
	- 0x9f SWAP16 17 17 (exchanges first and seventeenth? stack items)
#### 76. Logging Operations
- Append log records from within the execution context of the contract onto the blockchain
	- 0xa0 LOG0 2 0
	- 0xa1 LOG1 3 0
	- 0xa2 LOG2 4 0
	- 0xa3 LOG3 5 0
	- 0xa4 LOG4 6 0
- LOG refers to the event that is fired in the context of the smart contract
	- Parameters can be indexed or non-indexed
	- Index parameters go into the topics part of the log
	- Non-index parameters go into the data part of the log
#### 77. System Operations
- Instructions that are critical to how the system functions
	- 0xf0 CREATE 3 1 (create a new contract account that has associated code and storage)
	- 0xf1 CALL 7 1 (message call into another account)
	- 0xf2 CALLCODE 7 1 (lets caller account call a call-e account and let call-e account execute its code in the context of the state of the caller's account)
	- 0xf3 RETURN 2 0 (halts execution and returns output data)
	- 0xf4 DELEGATECALL 6 1 (similar to CALLCODE, but the values of sender and value of the caller is used in the case of call-e)
	- 0xf5 CREATE2 4 1 (similar to create, but allows for creation with a predictable address)
	- 0xfa STATICCALL 6 1 (allows the call-e to only read the state of the caller account)
	- 0xfd REVERT 2 0 (halts execution, returns data, and returns remaining gas)
	- 0xfe INVALID 0 0 (consumes all the gas that was supplied by the triggering transaction)
	- 0xff SELFDESTRUCT 1 0 (halts execution and destructs the account of the executing context... account is registered for later deletion)
#### 78. Gas Costs
- Each of the instructions above have different gas costs
- Gas costs have changed over time as Ethereum has evolved
- Some changes have been in response to DOS attacks
- STOP/INVALID/REVERT
	- These are simple instructions that only effect the executing context in a very special way
	- gas cost is 0
- Most of the Arithmetic/Logic/Stack
	- gas costs vary between 3-5 gas units
- CALL/BALANCE/EXT
	- More demanding instructions have a much greater processing requirement
	- gas cost is 2600 units
- MLOAD/MSTORE/MSTORE8
	- In the context of the EVM are very simple instructions that operate on the EVM's internal data structures
	- gas cost is 3 units
- SLOAD/SSTORE
	- Storage instructions deal with persistent state so they cost much more than the memory instructions
	- SLOAD: 2100 units SSTORE:20000 units (change storage value from 0 to non zero)/5000 units (in other situations)
- CREATE
	- One of the most expensive instructions
	- gas cost is 32000 units
	- This is because CREATE results in a new contract account being created
- SELFDESTRUCT
	- gas cost is 5000 units
#### 79. Transaction Reverts
- Transactions can revert for different exceptional conditions
	- A transaction can run out of gas depending on how much was supplied
	- A transaction can revert due to invalid instructions during contract execution
- When a transaction gets reverted, all the state changes are discarded
	- The original state before the transaction started executing is restored
	- It is as if the transaction never executed
#### 80. Transaction Data
- This is most relevant when the recipient of a transaction is a contract account
- When the target is a contract account, the data has two components
	- The function of the contract must be specified
	- The arguments of the function need to be specified if the function takes arguments
- This data of functions and arguments have to be encoded
	- They are encoded according to ABI
- ABI - Application Binary Interface

### [Block 5](https://www.youtube.com/watch?v=I-TjCtjDs1M)
#### 81. ABI
- Application Binary Interface
- The contract's interface that is specified in a very standard way so that contracts can interact with each other
	- Critical for contracts to interact both from outside the blockchain when a transaction is triggered targetting a destination contract but also for messages that are sent between two or more contracts within the EVM
- Interface functions are specified as part of the ABI are strongly typed, known at compilation time, and are static
	- The types of function parameters are known at compile time and they cannot change
#### 82. Function Selector
- The function selector is what specifies the exact function within the destination contract that needs to be invoked
- The function is specified by taking the function signature of the function that needs to be invoked and running it through a keccak-256 hash
	- The first 4 bytes of the output are taken as the function selector
- The function signature is created by taking the function name and it is appended with the a parenthesized list of the parameter types that it accepts.
	- The standard enforced by ABI is that there are no spaces between the parameter types and they are separated by commas.
- Function arguments are encoded and they immediately follow the 4 bytes of the function selector
#### 83. Block Explorer
- Allows us to explore the blocks and contents of the blockchain
	- Implemented as an web application
	- Real time on chain data about all blocks and transactions
- Ethereum has several block explorers: Etherscan, Etherchain, Ethplorer, Blockchair, Blockscout
#### 84. Mainnet
- Refers to the main Ethereum network
- Along with mainnets, there are testnets.
	- Testnets allow developers to test their dapps
	- Mainnet uses real ether, while test nets use test ether
	- Test ether can be obtained from faucets
	- Goerli: (was) Proof of authority test net available on all clients(POA = a small number of nodes that are allowed to create/validate blocks)
	- Kovan: PoA OpenEthereum
	- Rinkeby: PoA Geth
	- Ropsten: PoW
	- Sepolia: PoS
#### 85. EIP
- Ethereum Improvement Proposal
	- Proposals put forward by members of the Ethereum community to make changes to different aspects of the Ethereum protocol
- There is a specific process from the time somebody proposes to the way it is discussed, debated, voted upon, and finally made into a standard or specification
- They can target various aspects of the protocol: core, networking, interface
- ERC = Ethereum Request for Comments
- Standards and specifications are written and distributed within the community
#### 86. ETH 2.0
- Ethereum's biggest upgrade
- A set of interconnected upgrades to existing Ethereum
- Not a separate version of the protocol but a continuation
- Upgrades are meant to make Ethereum more scalable
	- Made possible by the concept of sharding
- Transitioning to proof of stake which is "more secure"
#### 87. Immutable Code
- Contracts deployed onto the blockchain are immutable
	- Once a contract's code is deployed it is technically considered immutable... it can not be changed
- There are ways to modify contracts
	- The contract can be modified and redeployed to a new address
		- Would have to carry over all the state and all the users would have to migrate to interacting with the new address... this is typically considered impractical
	- The modified contract can be redeployed as a new implementation of a proxy pattern
		- The proxy contract points to an implementation contract
		- The implementation contract can be modified/upgraded
		- The most commonly used approach to contract upgrading
		- Huge security implications of note done properly
	- The CREATE2 opcode can be used to upgrade a contract
		- It upgrades the contact in place using the same address
#### 88. Web3
- The idea is to create a permissionless, trust minimized, censorship-resistant network for transfer of information and value
- Functions through a peer to peer context
- Privacy and anonymity are motivating factors in web3
- There are still many aspects of web2 security that apply
	- But there is a paradigm shift in security related to web3
#### 89. Languages
- There are many languages in web2 that are applicable to web3
- web3 is a combination of smart contracts that run on the blockchain and the user interface (web2)
- Smart contracts are written in Solidity, Vyper, and some other WIP languages
	- Solidity is the most used
	- Created specifically for web3
#### 90. Onchain vs Offchain
- Web2 takes place offchain
- Web3 combines an offchain component with an onchain component
- Security implications apply to both aspects
#### 91. Open-source and Transparent
- All components are expected to be open source by default
- Everything that happens on the blockchain is transparent
	- Transactions and state are public
	- Data is available in real time and historical data is readily available
- We can view transactions waiting to get on the blockchain (mempool)
#### 92. Unstoppable and Immutable
- DApps: applications that run on a decentralized infrastructure and governance
	- No single entity that can decide to make changes
- Harder to fix vulnerabilities or respond to incidents
#### 93. Pseudonymity and DAOs
- There are regulatory uncertainties and legal implications with web3 which has lead to pseudoanonymity of developers in the web3 space
- This affects the reputation and trustworthiness in the space
- Legal/social accountability is uncertain
#### 94. Arch, Lang, Tools
- Web 1.0 was the initial version of the web. Web 2.0 was the shift to big companies managing a lot of the traffic and as the web has evolved, security implications have also changed
	- These changes (firewalls, email security, browser security, etc.) happened slowly over time
- Ethereum is still very young and it has aspects such as gas that have no parallel in the web2 world
- The languages (Solidity, Vyper, etc) are all very knew
- The tools available such as hardhat, truffle, brownie, OpenZeppelin, and more are all barely if not 5 years old
#### 95. Byzantine Threat Model
- [Byzantine Fault](https://en.wikipedia.org/wiki/Byzantine_fault)
- In web2, the threat model has defined concepts of trusted insiders and untrusted outsiders
- In web3, the threat model is all about Byzantine Fault Tolerance
	- Anyone, including the users, can be the abusers in the system
- Web3 security is very challenging because of the dynamic of an arbitrarily malicious mechanism design
	- Web3 is untrusted by default as the users can be the abusers.
	- Web3 is the ultimate 0 trust scenario
#### 96. Keys and Tokens (51:16)
- Keys are in reference to the keys used to control an EOA, the public-private key dynamic
- Cryptographic keys are first class members of the web3 world
- There is no concept of resetting/restoring passwords, losing keys = permanent loss
- Data loss in the web2 world is indirect and take time and effort from the attackers perspective
	- In some cases, this can be reveresed
- In web3, tokens used with protocols have no recourse when removed from an account
	- Unless "stolen" tokens are on a CEX, there not much recourse for the end user
#### 97. Composability
- Composability refers to designing in a modular way so  applications can interface with each other
- The permissionless nature of web3 encourages composable design
- The dynamic of any smart contract being able to interact with any other smart contract on chain leads to many security concerns
#### 98. Timescale
- In web2, innovations have opened over decades in isolated parts of the world
	- A lot of it has been in the interests of business leading to monopolies
	- Though there has been a lot of innovation, it has taken a long time because of the monopolistic nature
- In web3, the timescale for innovation has been compressed driven by being open source by design
	- A side effect for this has forced security to take a back seat
#### 99. Test-in-Prod
- Testing in web3 is very hard
- In the web2 spaces, testing is well defined and can be done effectively before deploying to prodocution
- The web3 tools for testing are still immature
- It is difficult to replicate real world failure models in a testnet
	- Realistic testing happens in production
#### 100. SSDLC -> Audits
- Secure software development life cycle
	- Generally, web2 products have a version of this used in the development cycle
	- Guarantees that some minimum requirements have been met
- The web3 space doesn't have a mature SSDLC
	- Web3 has the concept of audits
- The lifecycle of development has boiled down to building the product, auditing it, then launching
- There is a  perception in the space that an audit is a "silver bullet"
	- This is a fallacy that needs to be fixed
#### 101. State of Audits
- Audits are seen as a stamp of security approval from a third party audit firm
- This could be due to a lack of inhouse security expertise
	- Developers are few and there is a huge demand for developers, but a bigger demand for security experts
- Audits have the unreal expectation of being the end all be all
	- Audits are also very expensive because of the low supply

### [Quiz](https://ventral.digital/posts/2021/10/17/secureum-bootcamp-ethereum-101-quiz)
##### Q1 Ethereum Virtual Machine is a
- [ ] A) Register-based virtual machine
- [ ] B) Stack-based virtual machine
- [ ] C) Heap-based virtual machine
- [ ] D) Stackless virtual machine

<details>
<summary>Answer</summary>
<p>B</p>
<p>The EVM is a simple stack-based architecture consisting of the stack, volatile memory, non-volatile storage with a word size of 256-bit (chosen to facilitate the Keccak256 hash scheme and elliptic-curve computations) and Calldata.
</p>
<p>from points 59 of Ethereum 101 - by Secureum</p>
</details>

##### Q2 The length of addresses on Ethereum is
- [ ] A) 256 bits
- [ ] B) 20 bytes
- [ ] C) Depends on Externally-Owned-Account or Contract address
- [ ] D) Configurable
<details>
<summary>Answer</summary>
B
<p>
Ethereum state is made up of objects called "accounts", with each account having a 20-byte address and state transitions being direct transfers of value and information between accounts.
</p>
</details>

##### Q3 The types of accounts on Ethereum are
- [ ] A) All Accounts are the same
- [ ] B) Permissioned Accounts and Permissionless Accounts
- [ ] C) Externally-Owned-Accounts and Contract Accounts
- [ ] D) User Accounts and Admin Accounts
<details>
<summary>Answer</summary>
C
<p>
Ethereum has two different types of accounts:<br>
Externally Owned Accounts (EOAs) controlled by private keys<br>
Contract Accounts controlled by their contract code
</p>
</details>

##### Q4 The difference(s) between Bitcoin and Ethereum is/are
- [ ] A) The underlying tokens: Bitcoin vs Ether
- [ ] B) Smart contract support
- [ ] C) UTXO vs Accounts
- [ ] D) Nakamoto Consensus
<details>
<summary>Answer</summary>
A, B, C
<p>
Consensus algorithm: Ethereum uses Bitcoin’s consensus model, Nakamoto Consensus
</p>
</details>

##### Q5 Ethereum smart contracts do not run into halting problem because
- [ ] A) EVM is not Turing Complete
- [ ] B) EVM is Turing Complete
- [ ] C) EVM is Turing Complete but is bounded by gas sent in transaction
- [ ] D) EVM is Turing Complete but is bounded by the stack depth
<details>
<summary>Answer</summary>
C
<p>
Turing-complete systems face the challenge of the halting problem i.e. given an arbitrary program and its input, it is not solvable to determine whether the program will eventually stop running. So Ethereum cannot predict if a smart contract will terminate, or how long it will run. Therefore, to constrain the resources used by a smart contract, Ethereum introduces a metering mechanism called gas.
</p>
</details>

##### Q6 Ethereum nodes talk to each other via
- [ ] A) Peer-to-Peer network
- [ ] B) Client-Server network
- [ ] C) Satellite network
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A
<p>
Ethereum node/client: A node is a software application that implements the Ethereum specification and communicates over the peer-to-peer network with other Ethereum nodes.
</p>
</details>

##### Q7 A nonce is present in
- [ ] A) Ethereum transaction
- [ ] B) Ethereum account
- [ ] C) Both A & B
- [ ] D) Neither A nor B
<details>
<summary>Answer</summary>
C
<p>
Ethereum account contains four fields: The nonce, a counter used to make sure each transaction can only be processed once...
</p>
<p>
A transaction is a serialized binary message that contains the following components: nonce: A sequence number, issued by the originating EOA, used to prevent message replay...
</p>
</details>

##### Q8 The gas tracking website https://etherscan.io/gastracker says that Low gas cost is 40 wei This affects
- [ ] A) The transaction gasPrice
- [ ] B) The transaction gasLimit
- [ ] C) The transaction value
- [ ] D) Both B & C
<details>
<summary>Answer</summary>
A
<p>
Gas price: The price a transaction originator is willing to pay in exchange for gas. The price is measured in wei per gas unit. The higher the gas price, the faster the transaction is likely to be confirmed on the blockchain. The suggested gas price depends on the demand for block space at the time of the transaction.
</p>
<p>
gasLimit: The maximum amount of gas the originator is willing to pay for this transaction value: The amount of ether (in wei) to send to the destination
</p>
</details>

##### Q9 The number of transactions in a Ethereum block depend on
- [ ] A) Nothing. It is a constant.
- [ ] B) Gas used by transactions
- [ ] C) Block gas limit
- [ ] D) Block difficulty
<details>
<summary>Answer</summary>
B,C
<p>
Block gas limit is set by miners and refers to the cap on the total amount of gas expended by all transactions in the block, which ensures that blocks can’t be arbitrarily large. Blocks therefore are not a fixed size in terms of the number of transactions because different transactions consume different amounts of gas.
</p>
</details>

##### Q10 Miners are responsible for setting
- [ ] A) Transaction gas price
- [ ] B) Block gas limit
- [ ] C) Both A & B
- [ ] D) Neither A nor B
<details>
<summary>Answer</summary>
B
<p>
Gas price: The price a transaction originator is willing to pay in exchange for gas. The price is measured in wei per gas unit. The higher the gas price, the faster the transaction is likely to be confirmed on the blockchain. The suggested gas price depends on the demand for block space at the time of the transaction.
</p>
<p>
Block gas limit is set by miners and refers to the cap on the total amount of gas expended by all transactions in the block, which ensures that blocks can’t be arbitrarily large.
</p>
</details>

##### Q11 User A sends transaction T1 from address A1 with gasPrice G1 and later transaction T2 from address A2 with gasPrice G2
- [ ] A) T1 will be always included in an earlier block than T2
- [ ] B) Inclusion/Ordering of these transactions depends only on gas prices G1 and G2
- [ ] C) Inclusion/Ordering of these transactions depends only on network congestion
- [ ] D) Inclusion/Ordering of these transactions depends on miners
<details>
<summary>Answer</summary>
D
<p>
Inclusion: Transaction inclusion is not guaranteed and depends on network congestion and gasPrice among other things. Miners determine inclusion.
Order: Transaction order is not guaranteed and depends on network congestion and gasPrice among other things. Miners determine order.
</p>
</details>

##### Q12 Which of the following statements is/are true about gas?
- [ ] A) Unused gas is returned to the transaction destination account
- [ ] B) Gas used by the transaction is credited to the beneficiary address in block header
- [ ] C) Unused gas is credited to the beneficiary address in block header
- [ ] D) Both A & B
<details>
<summary>Answer</summary>
B
<p>
Gas refund and beneficiary: Any unused gas in a transaction (gasLimit minus gas used by the transaction) is refunded to the sender’s account at the same gasPrice. Ether used to purchase gas used for the transaction is credited to the beneficiary address (specified in the block header), the address of an account typically under the control of the miner. This is the transaction “fees” paid to the miner.
</p>
</details>

##### Q13 Which of the following EVM components is/are non-volatile across transactions?
- [ ] A) Stack
- [ ] B) Memory
- [ ] C) Storage
- [ ] D) Calldata
<details>
<summary>Answer</summary>
C
<p>
A stack machine is a computer processor or a virtual machine in which the primary interaction is moving **short-lived temporary values to and from a push down stack**.
</p>
<p>
The EVM is a simple stack-based architecture consisting of the stack, **volatile memory**, **non-volatile storage** with a word size of 256-bit (chosen to facilitate the Keccak256 hash scheme and elliptic-curve computations) and Calldata.
</p>
<p>
Calldata is a read-only byte-addressable space where the **data parameter of a transaction or call** is held.
</p>
</details>

##### Q14 Which of the following operation(s) touch(es) storage?
- [ ] A) SWAP
- [ ] B) SLOAD
- [ ] C) DUP
- [ ] D) PUSH
<details>
<summary>Answer</summary>
B
<p>
Most EVM instructions operate with the stack (stack-based architecture) and there are also stack-specific operations e.g. PUSH, POP, SWAP, DUP etc.
</p>
<p>
Storage is a 256-bit to 256-bit key-value store. [...] This is accessed with SLOAD/SSTORE instructions.
</p>
</details>

##### Q15 Which of the following statement(s) is/are false?
- [ ] A) EVM can get the block number only of the current block
- [ ] B) EVM can get the block hash only of the current block
- [ ] C) EVM can get the account balance only of the current account
- [ ] D) EVM can get the code hash only of the current account
<details>
<summary>Answer</summary>
B,C,D
<p>
0x31 BALANCE 1 1 Get balance of the given account<br>
0x3f EXTCODEHASH 1 1 Get hash of an account’s code<br>
0x40 BLOCKHASH 1 1 Get the hash of one of the **256 most recent complete blocks**<br>
0x43 NUMBER 0 1 Get the block’s number<br>
</p>
</details>

##### Q16 Which of the following information cannot be obtained in the EVM?
- [ ] A) Block difficulty
- [ ] B) Transaction logs
- [ ] C) Balance of an account
- [ ] D) Block hash of any block
<details>
<summary>Answer</summary>
B,D
<p>
> 0x31 BALANCE 1 1 Get balance of the given account<br>
> 0x40 BLOCKHASH 1 1 Get the hash of one of the **256 most recent complete blocks**<br>
> 0x44 DIFFICULTY 0 1 Get the block’s difficulty<br>
(there's no operation to access transaction logs)
</p>
</details>

##### Q17 Which call instruction could be used to allow modifying the caller account’s state?
- [ ] A) CALL
- [ ] B) CALLCODE
- [ ] C) DELEGATECALL
- [ ] D) STATICALL
<details>
<summary>Answer</summary>
B,C
<p>
0xf1 CALL 7 1 Message-call into an account<br>
0xf2 CALLCODE 7 1 Message-call into this account with an alternative account’s code<br>
0xf4 DELEGATECALL 6 1 Message-call into this account with an alternative account’s code, but persisting the current values for sender and value<br>
0xfa STATICCALL 6 1 Static message-call into an account<br>
</p>
<p>
Another variant of call is delegatecall, which replaced the more dangerous callcode. [...] Essentially, delegatecall runs the code of another contract inside the context of the execution of the current contract.
</p>
<p>
Permits non-state-changing calls to itself or other contracts while disallowing any modifications to state during the call (and its subcalls, if present) to increase smart contract security and assure developers that re-entrancy bugs cannot arise from the call.
</p>
</details>

##### Q18 The most gas-expensive operation is
- [ ] A) SLOAD
- [ ] B) SSTORE
- [ ] C) CREATE
- [ ] D) SELFDESTRUCT
<details>
<summary>Answer</summary>
C
<p>
SLOAD is 2100 gas and SSTORE is 20,000 gas to set a storage slot from 0 to non-0 and 5,000 gas otherwise. CREATE is 32000 gas and SELFDESTRUCT is 5000 gas.
</p>
</details>

##### Q19 Transaction T1 attempts to write to storage values S1 and S2 of contract C. Transaction T2 attempts to read the same storage values S1 and S2. However, T1 reverts due an exception after writing S1 but before writing S2. Which of the following is/are true?
- [ ] A) T2 reads the value of S1 updated by T1
- [ ] B) T2 reads the value of S1 prior to T1’s attempted update
- [ ] C) T2 also reverts because of the dependency on T1
- [ ] D) This scenario is not possible
<details>
<summary>Answer</summary>
B
<p>
Transaction properties: Atomic: it is all or nothing i.e. cannot be divided or interrupted by other transactions
</p>
<p>
A transaction reverts for different exceptional conditions such as running out of gas, invalid instructions etc. in which case all state changes made so far are discarded and the original state of the account is restored as it was before this transaction executed.
</p>
</details>

##### Q20 Ethereum’s threat model is characterised by
- [ ] A) Trusted miners and users
- [ ] B) Trusted users, untrusted miners
- [ ] C) Trusted miners, untrusted users
- [ ] D) Everyone is untrusted
<details>
<summary>Answer</summary>
D
<p>
Given the aspirational absence of trusted intermediaries, everyone and everything is meant to be untrusted by default. Participants in this model include developers, miners/validators, infrastructure providers and users, all of whom could potentially be adversaries.
</p>
</details>

##### Q21 The number of modified Merkle-Patricia trees in an Ethereum block is
- [ ] A) One
- [ ] B) Three
- [ ] C) Three plus number of contract accounts
- [ ] D) Three plus number of transactions included in the block
<details>
<summary>Answer</summary>
C
<p>
Blocks contain block header, transactions and ommers’ block headers. Block header contains [...] `stateRoot`, `transactionsRoot` and `receiptsRoot` are 256-bit hashes of the root nodes of modified Merkle-Patricia trees.
</p>
</details>

##### Q22 EVM is not a von Neumann architecture because
- [ ] A) It was co-founded by Vitalik Buterin, not John von Neumann
- [ ] B) Program instructions are stored separately from data
- [ ] C) Program instructions are stored in a ROM not RAM
- [ ] D) It is quasi Turing complete
<details>
<summary>Answer</summary>
B
<p>
EVM does not follow the standard von Neumann architecture. Rather than storing program code in generally accessible memory or storage, it is stored separately in a virtual ROM accessible only through a specialized instruction.
</p>
<p>
In computer science, a universal Turing machine (UTM) is a Turing machine that simulates an arbitrary Turing machine on arbitrary input. [...] This principle is considered to be the origin of the idea of a stored-program computer used by John von Neumann in 1946 for the "Electronic Computing Instrument" that now bears von Neumann's name: the von Neumann architecture
</p>
</details>

##### Q23 EVM stores
- [ ] A) Most significant byte in the smallest memory address
- [ ] B) Most significant byte in the largest memory address
- [ ] C) In Big-endian order
- [ ] D) In Little-endian order
<details>
<summary>Answer</summary>
A,C
<p>
EVM uses big-endian ordering where the most significant byte of a word is stored at the smallest memory address and the least significant byte at the largest
</p>
</details>

##### Q24 Miners are incentivized to validate and create new blocks by
- [ ] A) Block rewards
- [ ] B) Altruism
- [ ] C) Transaction fees
- [ ] D) Their belief in decentralization
<details>
<summary>Answer</summary>
A,C
<p>
Miners are rewarded for blocks accepted into the blockchain with a block reward in ether (currently 2 ETH). A miner also gets fees which is the ether spent on gas by all the transactions included in the block.
</p>
</details>

##### Q25 Hardfork on Ethereum
- [ ] A) Has never happened
- [ ] B) Happened only once after the DAO attack
- [ ] C) Happens with backwards-incompatible protocol changes
- [ ] D) Happens when developers and miners disagree on changes
<details>
<summary>Answer</summary>
C
<p>
A hard fork to introduce an exponential difficulty increase, to motivate a transition to PoS when ready....
</p>
</details>

##### Q26 Gas for EVM opcodes
- [ ] A) Is constant and the same for all opcodes
- [ ] B) May be changed over time to prevent DoS attacks
- [ ] C) Depend on the gas price
- [ ] D) Depend on the miners
<details>
<summary>Answer</summary>
B
<p>
Gas costs for different instructions are different depending on their computational/storage load on the client
</p>
<p>
Tangerine Whistle — A hard fork to change the gas calculation for certain I/O-heavy operations and to clear the accumulated state from a denial-of-service (DoS) attack that exploited the low gas cost of those operations.
Spurious Dragon — A hard fork to address more DoS attack vectors, and another state clearing. Also, a replay attack protection mechanism.
</p>
</details>

##### Q27 Smart contracts on Ethereum
- [ ] A) May be deployed by anyone
- [ ] B) May be deployed only through the DApp store
- [ ] C) May have some form of access control
- [ ] D) Are guaranteed to be secure
<details>
<summary>Answer</summary>
A,C
<p>
Web3: is a **permissionless**, trust-minimized and censorship-resistant network for transfer of value and information.
</p>
</details>

##### Q28 EVM opcodes
- [ ] A) Are multi-byte instructions
- [ ] B) Are single byte instructions
- [ ] C) Take operands in registers
- [ ] D) Take operands on stack
<details>
<summary>Answer</summary>
B,D
<p>
The code in Ethereum contracts is written in a low-level, stack-based bytecode language, referred to as "Ethereum virtual machine code" or "EVM code". The code consists of a series of bytes (hence called bytecode), where **each byte represents an operation**.
</p>
<p>
Most EVM instructions operate with the stack (stack-based architecture) and there are also stack-specific operations e.g. PUSH, POP, SWAP, DUP etc.
</p>
</details>

##### Q29 Security of Ethereum DApps depend on
- [ ] A) Security of their smart contracts
- [ ] B) Security of their off-chain components
- [ ] C) Security of Ethereum
- [ ] D) None of the above
<details>
<summary>Answer</summary>
A,B,C
<p>
On-chain vs Off-chain: Smart contracts are “on-chain” Web3 components and they interact with “off-chain” components that are very similar to Web2 software. So the major differences in security perspectives between Web3 and Web2 mostly narrow down to security considerations of smart contracts vis-a-vis Web2 software.
</p>
</details>

##### Q30 Security Audits for smart contracts are performed because
- [ ] A) They are required for listing DApp on the DApp store
- [ ] B) They are required for deployment on Ethereum
- [ ] C) They help remove vulnerabilities and reduce risk
- [ ] D) They are required by exchanges to list tokens
<details>
<summary>Answer</summary>
C
<p>
Audit-as-a-Silver-Bullet: Secure Software Development Lifecycle (SSDLC) processes for Web2 products have evolved over several decades to a point where they are expected to meet some minimum requirements of a combination of internal validation, external assessments (e.g. product/process audits, penetration testing) and certifications depending on the value of managed assets, anticipated risk, threat model and the market domain of products (e.g. financial sector has stricter regulatory compliance requirements).
</p>
</details>

##### Q31 The high-level languages typically used for writing Ethereum smart contracts are
- [ ] A) Go
- [ ] B) C++
- [ ] C) Vyper
- [ ] D) Solidity
<details>
<summary>Answer</summary>
C, D
<p>
Solidity language continues to dominate smart contracts without much real competition (except Vyper perhaps).
</p>
</details>

##### Q32 The number of decimals in Ether is
- [ ] A) 0
- [ ] B) 1
- [ ] C) 18
- [ ] D) Configurable
<details>
<summary>Answer</summary>
C
<p>
Ethereum’s currency unit is called ether or “ETH.” Ether is subdivided into smaller units and the smallest unit is named wei. [...] and 10**18 wei is 1 Ether.
</p>
</details>

##### [Quiz Writeup]