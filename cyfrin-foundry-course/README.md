# [Foundry Full Course](https://github.com/Cyfrin/foundry-full-course-f23) 

---
### Table of Contents
1. [Lessson 1: Blockchain Basics](#lesson-1-blockchain-basics)
    1. [What is a blockchain?](#what-is-a-blockchain)
    2. [The Purpose of Smart Contracts](#the-purpose-of-smart-contracts)
    3. [Other Blockchain Benefits](#other-blockchain-benefits)
    4. [What have Smart Contracts done so far?](#what-have-smart-contracts-done-so-far)
    5. [Gas 1: Introduction to Gas](#gas-1-introduction-to-gas)
    6. [How do Blockchains work?](#how-do-blockchains-work)
    7. [Signing Transactions](#signing-transactions)
    8. [Gas II](#gas-ii)
    9. [Gass II Summary](#gas-ii-summary)
    10. [High Level Blockchain Fundamentals](#high-level-blockchain-fundamentals)
2. [Lesson 2: Welcome to Remix](#lesson-2-welcome-to-remix)
	1. [Introduction](#introduction)
	2. [Setting Up Your First Contract](#setting-up-your-first-contract)
	3. [Basic Solidity: Types](#basic-solidity-types)
	4. [Basic Solidity: Functions](#basic-solidity-functions)
	5. [Basic Solidity: Structs and Arrays](#basic-solidity-structs-and-arrays)
	6. [Basic Solidity: Compiler Errors and Warnings](#basic-solidity-compiler-errors-and-warnings)
	7. [Memory, Storage, Calldata](#memory-storage-calldata)
	8. [Basic Solidity: Mappings](#basic-solidity-mappings)
	9. [Deploying Your First Smart Contract](#deploying-your-first-smart-contract)
	10. [The EVM and Recap](#the-evm-and-recap)
---

### [Lesson 1: Blockchain Basics](https://www.youtube.com/watch?v=umepbfKp5rI&t=834s)
#### What is a blockchain?
- Bitcoin was created by [Satoshi Nakamoto](https://en.wikipedia.org/wiki/Satoshi_Nakamoto) 	
	- One of the first protocols to use blockchain
	 - [Bitcoin Whitepaper](https://bitcoin.org/bitcoin.pdf)outlines how Bitcoin can make peer to peer transactions in a decentralized network
	 - A network powered by cryptography and decentrality allowing people to engage in censorship resistant finance
	 - Some people see Bitcoin as a store of value similar to gold
		 - Is a store of value the same as something used for day to day transactions? If not, then I don't think Bitcoin should be viewed as a "store of value", as that isn't what the whitepaper intended
		- Similar to gold, Bitcoin has the property of scarcity
- Bitcoin lead to the creation of Ethereum: [Ethereum whitepaper](https://ethereum.org/en/whitepaper/)
	- Created by [Vitalik Buterin](https://en.wikipedia.org/wiki/Vitalik_Buterin)
	- Ethereum used the same blockchain infrastructure with the addition of "smart contracts"
	- In 2015 Ethereum was created with the ability to produce decentralized agreements, decentralized organizations, and other ways to interact without centralized mediation
- ["Smart contracts"](https://chain.link/education/smart-contracts) weren't a new idea upon the release of Ethereum
	- In 1994, [Nick Szabo](https://en.wikipedia.org/wiki/Nick_Szabo) originally came up with the idea of a smart contract: "a set of instructions executed in a decentralized way without the need for a centralized or third party intermediary"
	- We can think of smart contracts as we do traditional contracts: a set of instructions between parties
		- Removes centralized forces and counterparty risk
	- Bitcoin technically does have smart contracts, but they are intentionally "turing incomplete"... it lacks the full functionality that would be given be a programming language
- Blockchains are intentionally walled off and they can't interact with or read/listen to data from the real world (the oracle problem)
	- Blockchains are [deterministic systems](https://en.wikipedia.org/wiki/Deterministic_system) and when external data is needed, [oracles](https://betterprogramming.pub/what-is-a-blockchain-oracle-f5ccab8dbd72)are used
		- Oracles are any device that delivers data to decentralized blockchains or runs external computation
		- To maintain decentralization, a single source of data cannot be relied upon
- [Hybrid Smart Contracts](https://chain.link/education-hub/hybrid-smart-contracts) combine onchain decentralized logic with offchain decentralized data
	- Chainlink is a modular, decentralized oracle network that can both bring external data and external computation into smart contracts
- [Blockchain Terminology](https://connect.comptia.org/content/articles/blockchain-terminology)
	- Layer 2 Blockchains try to solve the scaling problem of layer 1 blockchains
	- Layer 1 blockchains can only get so big, layer 2 helps with this scaling issue
		- There are two main types of layer2s: optimistic rollups and zero knowledge rollups
			- Optimistic: optimism, arbitrum
			- Zero knowledge: zksync, polygon zk evm
	- Dapp = Decentralized Application = Decentralized Protocol = Smart contract
		- A decentralized application is usually the combination of many smart contracts
- [Web3](https://en.wikipedia.org/wiki/Web3)is the idea that blockchains and smart contracts are the next iteration of the web
	- Web1: The permissionless open sourced web with static content
	- Web2: The permissioned web, with dynamic content. Companies run your agreements on the servers
	- Web3: The permissionless web, with dynamic content where decentralized censorship resistant networks run your agreement and code. It is generally accompanied by the idea of user owned ecosystems, where the protocols you interact with you also own a portion of, instead of solely being the product.
- Smart contracts create trust minimized agreements
	- Give rise to unbreakable promises
#### The Purpose of Smart Contracts
- [The value of blockchain and smart contract](https://www.youtube.com/watch?v=_JeRq7Gwj5Y&feature=youtu.be)
- The modern world involves a lot of trust... we have to trust that whoever we are doing business with will fulfil their promises/agreement
	- Businesses or entities don't always keep their promises: [McDonalds scandal](https://www.chicagotribune.com/sns-mcdonalds-story.html)
	- 2008 crash and Robinhood not allowing trading of certain stocks are examples of breakdown of trust
	- Even when trying to resolve issues with systems we have in place like court, it can take years to resolve
	- [The Evolution of agreements](https://www.youtube.com/watch?v=ufVyX7JDCgg)
- [What is a smart contract](https://www.youtube.com/watch?v=ZE2HxTmxfrI)
	- A smart contract is an agreement, contract, or set of instructions that is deployed on a decentralized blockchain
		- It cannot be altered (immutable)
		- It automatically executes
		- Everyone can see the terms of the agreement
- [Chainlink and Oracles](https://www.youtube.com/watch?v=tIUHQ7sDoaU)
	- Oracles bring data from off-chain on-chain, and chainlink does this in a decentralized manner
- Smart contract solve some of the earlier trust issues
	- Uniswap is a decentralized exchange that allows trading 
	- Smart contracts can be applied to anything with a trust assumption
	- The idea of smart contracts facilitate moving away from a brand based world to a math based world
#### Other Blockchain Benefits
1. Decentralization
	- There is no centralized intermediary 
	- Many node operators run a blockchain
2. Transparency and Flexibility
	- Everything on-chain can be viewed anyone
	- Blockchain is pseudo-anonymous 
3. Speed and Efficiency
	- Transactions happen "instantly"
	- Fosters an environment of efficiency in how tasks are accomplished
4. Security and Immutability
	- Once a smart contract is deployed it's immutable... the code can't be changed
	- The nodes offer a form of security in that in order to "hack" the blockchain, one would need control of 51% of the nodes
	- All you need for access is your private key... if your computer and data goes down, the information still persists on the blockchain as long as there is one node running
5. Counterparty Risk Removal
	- Removes the centralized intermediary needed for certain interactions
	- Smart contracts define all the details of an agreement, and therefore there is no reliance on  a third party to uphold the agreement
6. Trust Minimized Agreements
	- Doing the right thing is infrastructural
	- There is an added degree of transparency that smart contracts create offering trust in math rather than brands
#### What have Smart Contracts done so far?
- [Defi](https://chain.link/education/defi)
	- Defi stands for decentralized finance
	- Allows us to participate in financial markets without a centralized intermediary 
- [DAOs](https://betterprogramming.pub/what-is-a-dao-what-is-the-architecture-of-a-dao-how-to-build-a-dao-high-level-d096a97162cc)
	- Decentralized Autonomous Organizations are groups that are governed by a set of instructions or smart contracts on-chain
	- The rules are black and white with much easier engagement
	- Facilitates decentralized voting (not 1 vote per person but weighted votes based on ownership)
- [NFTs](https://www.youtube.com/watch?v=9yuHz6g_P50)
	- Non-fungible tokens that can represent physical goods
	- Common use cases today are applied to art
#### Gas 1: Introduction to Gas
- [Gas and Gas Fees](https://ethereum.org/en/developers/docs/gas/)
	- Transaction fee: amount paid to the block producer for processing the transaction
	- Gas price: cost per unit of gas specified for the transaction in Ether and Gwei... the higher the gas price, the higher the chance of getting included in a block
	- Nodes get paid in ether for processing transactions
	- Transaction fee = gas price * gas used
- [Wei, Gwei, and Ether Converter](https://eth-converter.com/)
	- Different types of transactions require different amount of gas units... based on the complexity of the transaction
- [ETH Gas Station](https://ethgasstation.info/)
#### How Do Blockchains Work?
- [What is a hash?](https://techjury.net/blog/what-is-cryptographic-hash/)
	- A hash is a unique fixed length string, meant to identify a piece of data. They are created by placing data into a "hash function"
	- Regarding the data, when working with SHA256, the algorithm can take virtually any length of data to create a hash output
- [Blockchain Demo](https://andersbrownworth.com/blockchain/)
	- Miners have to solve different problems... they are trying to create/verify a hash based on input details such as a block number, nonce, and data
		- They are trying to find a nonce, that satisfies whatever the problem is (start with 4 zeros), that when combined with the block number/data produces the hash solution
		- So effectively, the nonce is the solution to the problem
	- Nodes in Ethereum take turns trying to solve problems in contrast to a competitive proof of work setting
	- The Genesis block is the first block in the blockchain, and a blockchain is a chain of blocks that point to its previous block
	- For a block, the block #, nonce, and data go into the hashing algorithm to create a hash
	- In a Blockchain, the block #, nonce, data, and previous hash go into the algorithm
	- When dealing with something like tokens, transactions are also a part of the hashing process
- [Summary](https://ethereum.org/en/developers/docs/intro-to-ethereum/)
	- Hash: a unique fixed length string to identify a piece of data
	- Hash algorithm: A function that computed data into a unique hash
	- Mining is the process of finding the "solution" to the blockchain "problem"
		- A "problem" could be finding a hash that starts with four zeros
		- Nodes get paid for mining blocks
	- A block in a blockchain is a list of transactions mined together
	- Blockchains are decentralized: have no single point of authority
	- Nonce is "a number used once" to find the solution to the blockchain problem
		- It is also used to define transaction numbers
#### Signing Transactions
- [Public / Private Keys](https://andersbrownworth.com/blockchain/public-private-keys/keys)
	- Private key exists so the user can create signatures
	- Public keys exists for verification
		- Derived by using a digital signature algorithm on a private key. It can be used publicly to verify the origins of a transaction
	- First step in sending a transaction is signing it with private keys
		- Signing a transaction is a one way process. Someone with a private key signs a transaction by their private key being hashed with their transaction data... anyone can then verify this new transaction hash with the corresponding public key
	- Creating a private key usually involves a mnemonic phrase which is hashed with a hashing algorithm
		- Metamask takes a mnemonic phrase and adds a number with it in the hashing algorithm... so when a new account is created, the same mnemonic phrase is used with a different number as an input to the hashing algorithm
			- This means that losing your private keys risks that account while losing the mneomic phrase puts all accounts created at risk
- [Layer 2 and Rollups](https://ethereum.org/en/developers/docs/scaling/layer-2-rollups/)
- [Decentralized Blockchain Oracles](https://blog.chain.link/what-is-the-blockchain-oracle-problem/)
#### Gas II
- [Block Rewards](https://www.investopedia.com/terms/b/block-reward.asp)
- - Ethereum has a base fee: The minimum gas price to send you transaction
	- Part of a transaction fee involves "burning ethereum" which is a way to remove ethereum from circulation
	- Blockchains have limited block space for transactions... the gas price to include transactions in a block changes based of how much demand there is
	- The base fee is algorithmically adjusted to try to get all blocks 50% full
		- If a block is more the 50% full, the base fee goes up
		- If a block is less than 50% full, the base fee goes down
- Advanced Gas
    - [EIP 1559](https://www.youtube.com/watch?v=MGemhK9t44Q)
    - GWEI, WEI, and ETH
        - [ETH Converter](https://eth-converter.com/)
#### Gas II Summary
- [Run Your Own Ethereum Node](https://geth.ethereum.org/docs/getting-started)
- Block confirmations tells us how many blocks have been mined since the transaction in question was added to the block
- Gas price is the cost of one unit of gas
- Gas limit is the max amount of units of gas that a user is willing to pay
- Gas usage is how many units were actually used
- The Base fee is the base network fee per gas
- The max gas price is the max price a user is willing to pay
- Priority is the max gas price + the miner tip
#### High Level Blockchain Fundamentals
- Traditionally running a website or interacting with something that connects to a server involves a "centralized entity"
	- A centralized entity can have multiple servers but ultimately the servers are owned by a single entity
	- Blockchains run on a network of independent nodes
	- Node: a single instance of a decentralized system
- Anyone can join the network
	- This is what makes blockchains decentralized
- Blockchains are resilient
	- The blockchain and the system will persist so long as there is always one node running
- Blockchain nodes keep lists of the transactions that occur
	- This gives blockchains an immutability trait where nothing can be changed or corrupted
	- A blockchain is a decentralized database and Ethereum provides an extra feature of computation
- [Consensus](https://wiki.polkadot.network/docs/learn-consensus)
	- Proof of work and proof of stake are two forms of consensus
	- Consensus is the mechanism used to agree on the state of a blockchain
	- A consensus protocol can be broken down into two pieces
		1. Chain Selection Algorithm
		2. Sybil Resistance Mechanism
			- Sybil resistance is a blockchain's ability to defend against users create a large number of identities to gain a disproportionately advantageous influence over the system
			- Proof of work is a Sybil resistance mechanism because it define a way to figure out the block author... which node did the work to find the mine
	- Proof of Work and Proof of Stake are two types of Sybil resistance mechanisms
		- Proof of work	
- Chain Selection is combined with pow/pos to create consensus
	- Answers the question of "how do we know which blockchain is the real blockchain"
	- Block confirmations are the number of additional blocks that have been added on since the transaction in question
- [Proof of Stake](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/)
	- Nodes put up collateral as a Sybil resistance mechanism
	- "Miners" are actually validators
	- Nodes are randomly chosen to propose a new block
	- Much less computationally expensive than proof of work
	- It could be less decentralized as there is a staking cost to participate
- [Proof of Work](https://ethereum.org/en/developers/docs/consensus-mechanisms/pow/)
	- A single node has to go through a very computationally expensive process called mining 
	- No matter how many accounts are made, each still have to go through computational expensive activity
	- The block time is how long it takes between blocks being published
	- Nodes are competing for rewards
	- Gas fees are paid by whoever initialized the transaction
- [Nakamoto Consensus](https://blockonomi.com/nakamoto-consensus/)
	- Bitcoin (and when eth was pow) uses Nakamoto Consensus which a combination of proof of work and longest chain rule... whichever chain has the longest chain or the most number of blocks is going to be the chain that is used
- [The merge](https://ethereum.org/en/eth2/)
- Attacks
	- Sybil Attack: a user or users create many accounts to influence a network
	- 51% Attack: Blockchains will agree on the longest chain so long as it aligns with 51% of the network... so having the longest chain along with 51% of the network will force the rest of the network onto this longest chain
- Longest Chain Rule
	- The system is going to corroborate the blockchain which has the most buy in / is the longest
- Layer 1
	- Base layer blockchain implementation
- Layer 2
	- Any application added on top of a layer 1
	- Arbitrum and Optimism are rollups
		- They rollup their transactions into a layer 1
		- Derive security from base layers whereas sidechains derive security from their own protocol
- Summary
	- PoW and PoS are sybil resistance mechanisms
	- The bigger the blockchain, the more secure
	- Consensus is how the blockchain decides what the state chain is
	- Sharding and rollups are scalability solutions
	- Only so many transactions can fit into a block
	- Gas prices are how much it costs to interact with the blockchain

### [Lesson 2: Welcome to Remix](https://www.youtube.com/watch?v=umepbfKp5rI&t=7842s)
#### Introduction
- [Remix](https://remix.ethereum.org/)
	- A popular web based IDE
- [Solidity Documentation](https://docs.soliditylang.org/en/latest/index.html)

#### Setting Up Your First Contract
- Versioning
	- We start out by declaring the version: ``pragma solidity 0.8.4``
	- ``pragma solidity ^0.8.18`` the caret indicates that any compiler version greater than or equal to 0.8.18 can be used
	- we can also indicate a range ``pragma solidity >=0.8.18 < 0.9.0``
- Take notes in your code!
	- with solidity comments can be created with ``//`` or ``/**/``
- [What is a software license](https://snyk.io/learn/what-is-a-software-license/)
- SPDX License
	- Not required, the compiler will still run without it, but recommended
	- ``//SPDX-License-Identifier: MIT;``
- Compiling
	- Transforming our code in to computer code (bytecode)
	- Computer code is very specific instructions for the blockchain to use for our contract
- Contract Declaration
	- The ``contract`` keyword indicates to solidity the name of our contract
	- Similar to a class in JavaScript/Python

#### Basic Solidity: Types
- [Types & Declaring Variables](https://docs.soliditylang.org/en/v0.8.13/)
    - `uint256`, `int256`, `bool`, `string`, `address`, `bytes32`
	    - ``uint`` defaults to ``uint256``
	    - For readability, its better to be explicit and use ``uint256`` over ``uint``
	    - ``int`` can be positive or negative whereas ``uint``, is always positive (unsigned integer)
	    - A ``string`` is text that represents words... it is a bytes object specifically for text... a string can easily be converted to a bytes object
	    - ``bytes32`` and ``bytes`` are actually not the same unlike ``uint`` and ``uint256``
    - [Solidity Types](https://docs.soliditylang.org/en/latest/types.html)
    - [Bits and Bytes](https://www.youtube.com/watch?v=Dnd28lQHquU)
- Default Initializations
	- values are initialized to 0 if no values are given
- Comments
	- with solidity comments can be created with ``//`` or ``/**/``

#### Basic Solidity: Functions
- Functions
	- Function or methods are a sub section of code that when called will execute a very specific small piece of the codebase
	- Identified by the keyword ``function``
- Deploying a Contract
    - Smart Contracts have addresses just like our wallets
    - Deploying a contract uses the exact same process as sending a transaction... the input field is populated with the bytecode of the transaction
    - Deploying a contract is modifying the blockchain, so it requires gas
- Calling a public state-changing Function
- [Visibility](https://docs.soliditylang.org/en/latest/contracts.html#visibility-and-getters)
	- Visibility is defaulted to internal
	- Functions can have one of four visibility specifiers: public, external, internal, private
		- public: visible internally and externally (creates a getter for storage/state variables)
	- Everything on the blockchain is public, so using private isn't a good way to "hide" information
- Gas III | An example
	- Every time the state of the blockchain is updated, it's going to cost gas
- Scope
	- Like other languages, variables are scoped to the block they were created in
	- If a variable is created inside a function, it is only accessible inside that function
- View & Pure Functions
	- A function marked view means we're only going to read state, state cannot be updated
	- Pure functions can't modify or read from state
	- View and pure functions won't cost gas
	- If a gas cost transaction is calling a view or pure function, then there will be a gas cost

#### Basic Solidity: Structs and Arrays
- Structs
	- Allows for the creation of custom data types
```js
struct Person {
	uint256 favoriteNumber;
	string name;
}

Person public rob = Person(17,"Rob");
Person public bor = Person({favoriteNumber:17,name:"Bor"});
```
- Intro to Storage
	- Smart contracts have permanent storage where variables are saved
	- We can also use the memory keyword to utilize non permanent memory
- Arrays
	- ``uint256[]`` the bracket syntax identifies that we have a list of uint256 values
	- an array in Solidity is similar to arrays in other languages
	- arrays are 0 indexed
	- We can combine the idea of structs and arrays and create an array of structs: ``Person[] public listOfPeople;``
- Dynamic & Fixed Sized
	- Arrays can be fixed in size or dynamic
	- Fixed size arrays are declared when created and dynamic sized arrays can go to any size
- `push` array function
	- Arrays come built in with the ``push`` function

#### Basic Solidity: Compiler Errors and Warnings
- Yellow: Warnings are Ok
	- This won't prevent us from compiling our code
- Red: Errors are not Ok
	- Prevent from compiling code

#### Memory, Storage, Calldata
- 6 Places you can store and access data
    - calldata
    - memory
    - storage
    - code
    - logs
    - stack
- calldata, memory, and storage are they only keywords that we actually use
- calldata and memory indicate that data is only going to exist temporarily... the duration of the function call
	- Inside of functions, most variables automatically default to memory variables
	- strings are a special type?? you have to specify memory or call data (has to do with how arrays work in memory)
	- The difference between memory and calldata is that memory can be changed
	- If a calldata variable is passed as an argument, it can't be modified inside the function while memory can be modified
	- storage is for permanent variables that can be modified
- Arrays, structs, and mappings are special types in Solidity and we have to use these keywords when dealing with them
	- Something like uint256 is a primitive type and Solidity knows where to put a primitive
	- A string is an array of bytes, and Solidity needs direction for storage
	- We don't use the storage keyword when declaring function parameters, only memory or calldata

#### Basic Solidity: Mappings
- [Mappings](https://solidity-by-example.org/mapping)
	- A mapping is like a dictionary... a set of keys with each key returning a special set of information
	- ``mapping(string => uint256) public variableName;
	- In a mapping, the default value for all the keys is 0... looking up a key that doesn't exist will return 0

#### Deploying Your First Smart Contract
- A testnet or mainnet
- Connecting Metamask
- [Find a faucet here](https://docs.chain.link/docs/link-token-contracts/#Sepolia)
- See the faucets at the top of this readme!
- Interacting with Deployed Contracts

#### The EVM and Recap
- The EVM
	- When smart contracts are compiled, it gets compiled down to the EVM (Ethereum Virtual Machine)
	- Any blockchain that's EVM compatible should be able to handle Solidity code
	- Ethereum, Polygon, Arbitrum, Optimishm, Zksync
- The first thing to do in a Solidity smart contract is declare the version and above the version the SPDX license identifier
- A contract is similar to a class in other programming languages
- Solidity has many different types such as: string, bytes, uint, boolean
- A struct is a custom type that can be created
- Arrays and mappings handle a list or dictionary of data
- Functions can modify or read from state
- We can specify different data locations in the parameters of functions