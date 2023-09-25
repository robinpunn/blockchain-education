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
3. [Lesson 3: Storage Factory](#lesson-3-storage-factory)
	1. [Introduction](#introduction)
	2. [Importing Contracts into Other Contracts](#basic-solidity-importing-contracts-into-other-contracts)
	3. [Interacting with other Contracts](#basic-solidity-interacting-with-other-contracts)
	4. [Inheritance and Overrides](#basic-solidity-inheritance-and-overrides)
	5. [Summary](#summary)
4. [Lesson 4: Remix Fund Me](#lesson-4-remix-fund-me)
	1. [Sending Eth through a function](#sending-eth-through-a-function)
	2. [Getting real world price data (Chainlink)](#getting-real-world-price-data-chainlink)
	3. [Interfaces](#interfaces)
	4. [Importing from NPM/GitHub](#importing-from-npm--github)
	5. [Getting Prices from Chainlink](#getting-prices-from-chainlink)
	6. [More Solidity Math](#more-solidity-math)
	7. [msg.sender](#msgsender)
	8. [Library](#library)
	9. [SafeMath](#safemath)
	10. [For Loop](#for-loop)
	11. [Resetting an Array](#resetting-an-array)
	12. [Transfer, Send, and Call](#transfer-send-and-call)
	13. [Constructor](#constructor)
	14. [Modifiers](#modifiers)
	15. [Testnet Demo](#testnet-demo)
	16. [Immutable and Constant](#immutable--constant)
	17. [Custom Errors](#custom-errors)
	18. [Receive and Fallback Function](#receive-and-fallback-function)
5. [Lessong 5: AI Prompting and Forums](#lesson-5-ai-prompting-and-forums)
	1. [7 Tips for this course](#7-tips-for-this-course)
	2. [Formatting a Question](#formatting-a-question)
	3. [Speedrun Ethereum](#speedrunethereum)
6. [Lesson 6: Foundry Simple Storage](#lesson-6-foundry-simple-storage)
	1. [Introduction](#introduction-2)
	2. [Installation and Setup](#installation--setup)
	3. [Local Development Introduction](#local-development-introduction)
	4. [Foundry Install](#foundry-install)
	5. [VSCode Setup II](#vscode-setup-ii)
	6. [Foundry Setup](#foundry-setup)
	7. [Formatting Solidity in VSCode](#formatting-solidity-in-vscode)
	8. [Compiling in Foundry](#compiling-in-foundry)
	9. [Compiling in Foundry](#compiling-in-foundry)
	10. [Deploying to a local chain (Anvil or Ganache)](#deploying-to-a-local-chain-anvil-or-ganache)
	11. [Adding Another Network on Metamask](#adding-another-network-on-metamask)
	12. [Deploying to a local chain (Forge Create)](#deploying-to-a-local-chain-forge-create)
	13. [Deploying to a local chain (Forge Script)](#deploying-to-a-local-chain-forge-script)
	14. [What is a transaction?](#what-is-a-transaction)
	15. [Private Keys](#private-keys)
	16. [ThirdWeb Deploy](#thirdweb-deploy)
	17. [Private Key Summary](#private-key-summary)
	18. [Cast Send](#cast-send)
	19. [Deploying to a testnet or mainnet](#deploying-to-a-testnet-or-mainnet)
	20. [Verifying a contract the manual way](#verifying-a-contract-the-manual-way)
	21. [Cleaning up the Project](#cleaning-up-the-project)
	22. [Alchemy and the mempool](#alchemy-and-the-mempool)
	23. [Summary](#summary)
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

### [Lesson 3: Storage Factory](https://www.youtube.com/watch?v=umepbfKp5rI&t=12598s)
#### Introduction
- [Factory Pattern](https://betterprogramming.pub/learn-solidity-the-factory-pattern-75d11c3e7d29)
- We can use a "factory contract" that can deploy other smart contracts

#### Basic Solidity: Importing Contracts into other Contracts
- Composability
	- The ability of smart contracts to seamlessly interact with each other
- [Solidity new keyword](https://docs.soliditylang.org/en/latest/control-structures.html?highlight=new#creating-contracts-via-new)
	- the general structure of a variable is: type visibility name === uint256 public favoriteNumber;
	- we can do the same thing with a contract... just as we invoke a struct's name to create a new struct variable, we can do the same with a contract: ContractName visbility contractName
		- Solidity is case sensitive, so this naming pattern is used often with contracts
	- Then we use the ``new`` keyword to create an instance of a contract
- [Importing Code in solidity](https://solidity-by-example.org/import)
	- One way to link contracts is to have both contracts in one file... however, it is best practice to keep contracts in separate files
	- Instead of having contracts in the same file, we can import: ``import {SimpleStorage} from './SimpleStorage.sol';``
		- Using named imports is best practice

#### Basic Solidity: Interacting with other Contracts
- To interact, you always need: ABI + Address
- [ABI](https://docs.soliditylang.org/en/latest/abi-spec.html?highlight=abi)
	- Application Binary Interface tells our code how it can interact with another contract

#### Basic Solidity: Inheritance and Overrides
- [Inheritance](https://solidity-by-example.org/inheritance)
	- Using the ``is`` keyword, we can have a child contract Inherit from its parent contract
	- ``Contract A is Contract B{}``
- [Override & Virtual Keyword](https://docs.soliditylang.org/en/latest/contracts.html?highlight=override#function-overriding)
	- In order to "override" a function in the child contract, the parent contract needs to designate the function as virtual
	- The ``virtual`` keyword indicates that a function is overridable

#### Summary
- With the ``new`` keyword, we can deploy contracts from other contracts
- Importing contracts into other contracts is the same as copy/pasting the contract
- Named imports are best practice
- We can interact with other contracts as long as we have the address and the abi
	- Using a contract type automatically gives us the address and the abi
- If we want a child contract to inherit the functionality of some other contract, we can import it and use the ``is`` keyword
	- To override a function from the parent contract, the parent contract must use the ``virtual`` keyword while the

### [Lesson 4: Remix Fund Me](https://www.youtube.com/watch?v=umepbfKp5rI&t=14948s)
#### Sending ETH through a function
- How do we send eth?
	- Whenever eth is sent on the blockchain, there is a value field that gets populated
	- The value field is the amount of native blockchain cryptocurrency that gets sent with every transaction
- payable
	- the first thing we need to to do to send cryptocurrency is use the - [payable](https://solidity-by-example.org/payable) keyword
	- like wallets, contracts can hold funds
- Global values
	- we can access the value of a transaction by using a solidity global, msg.value
	- [msg.value & Other global keywords](https://docs.soliditylang.org/en/latest/cheatsheet.html?highlight=cheatsheet#global-variables)
- [require](https://codedamn.com/news/solidity/what-is-require-in-solidity)
	- we can use a require statement to ensure certain conditions are met
	- ``require(msg.value > 1e18);``
	- ``1e18 = 1 ETH = 1000000000000000000 = 1 * 10 ** 18``
	- on the blockchain, value is handled in wei
	- we can use [Ethereum Unit Converter](https://eth-converter.com/) to make easier conversions
	- require can have an option message: ``require(msg.value > 1e18, "didn't send enough eth");``
- [revert](https://medium.com/blockchannel/the-use-of-revert-assert-and-require-in-solidity-and-the-new-revert-opcode-in-the-evm-1a3a7990e06e)
	- A revert undoes any actions that have been done, and sends the remaining gas back
	- A failed transaction still will require some gas
- [Fields in a Transaction](https://ethereum.org/en/developers/docs/transactions/)
	- Nonce: tx count for the account
	- Gas Price: price per unit of gas (in wei)
	- Gas Limit: max gas that this tx can use
	- To: address that the tx is sent to
	- Value: amount of wei to send
	- Data: what to send to the To address
	- v,r,s: components of tx signature
- [More on v,r,s](https://ethereum.stackexchange.com/questions/15766/what-does-v-r-s-in-eth-gettransactionbyhash-mean)

#### Getting real world price data (Chainlink)
- [What is a blockchain oracle?](https://chain.link/education/blockchain-oracles)
	- Blockchains are deterministic systems which means they can't interact with real world data and events
	- Blockchains are deterministic by design so all the nodes can reach consensus
	- Oracles can help get offchain data
	- A blockchain oracle is any device that interacts with the off-chain world to provide external data or computation to smart contracts
- [What is the oracle problem?](https://blog.chain.link/what-is-the-blockchain-oracle-problem/)
	- Smart contracts are unable to connect with external systems or perform external computation
	- Nodes would never be able to reach consesus if variable/random data from api calls were incorporated
	- Centralized oracles are a point of failure
- [Chainlink](https://chain.link/)
	- Chainlink is a decentralized oracle network for bringing data and external computation into our smart contracts
	- A modular decentralized oracle network that can be customized to deliver any data or do any external computation
	- Customizing can be a lot of work, but there are many chainlink features that come out of the box that are ready to be used in smart contracts
- [Chainlink Price Feeds (Data Feeds)](https://docs.chain.link/docs/get-the-latest-price/)
    - A network of chainlink nodes get data from different exchanges and data providers and brings that information through a network of decentralized chainlink nodes
    -  [data.chain.link](https://data.chain.link/)
- [Chainlink VRF](https://docs.chain.link/docs/chainlink-vrf/)
	- Chainlink verifiable randomness function
- [Chainlink Keepers](https://docs.chain.link/docs/chainlink-keepers/introduction/)
	- Chainklink keepers are chainlink nodes that listen for a registration contract for different specified events
- [Chainlink API Calls](https://docs.chain.link/docs/request-and-receive-data/)
- [Importing Tokens into your Metamask](https://consensys.net/blog/metamask/how-to-add-your-custom-tokens-in-metamask/)
- [Request and Receive Chainlink Model](https://docs.chain.link/docs/architecture-request-model/)

#### Interfaces
- There is a concept in solidity known as the interface
	- For reference - [ChainLink Interface's Repo](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol)
	- The interface has functions defined without any logic, allowing it to be easily used for abi??
	- We don't know what the functions do, we just need to know how to interact with the contract
- A common way people interact with other contracts outside of their projects
	- Get the interface of contract using interface keyword
	- The interface compiles and in return we get an ABI
	- wrap an address around interface keyword allowing us to call any function associated with the interface:
	- ``return AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306).version();``

#### Importing from NPM / GitHub
- Using too many interfaces pasted into our file can look very cluttered
	- Instead, we can use imports:
	- ``import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";``
- [Chainlink NPM Package](https://www.npmjs.com/package/@chainlink/contracts)
	- A package manager that keeps different versions of combinations of code
	- Remix automatically downloads this, but for projects with local IDEs, we have to install the package

#### Getting Prices from Chainlink
```js
function getPrice() public view returns(uint256){
	AggregatorV3Interface priceFeed = AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
	(, int256 price,,,) = priceFeed.latestRoundData();
	return uint256(price * 1e10);
}
```

#### More Solidity math
- Multiply before you divide
	- Solidity only works with whole numbers
- [tuple](https://docs.soliditylang.org/en/latest/abi-spec.html?highlight=tuple#handling-tuple-types)
- [Floating Point Numbers in Solidity](https://stackoverflow.com/questions/58277234/does-solidity-supports-floating-point-number)
- [Type Casting](https://ethereum.stackexchange.com/questions/6891/type-casting-in-solidity)
- Gas Estimation Failed
    - Someone should make an article explaining this error
    - It is a boilerplate error for "something went wrong"... it could be a number of issues... but if the require/revert has a message, then the message should show when this pops up

#### msg.sender
- [msg.sender](https://docs.soliditylang.org/en/latest/cheatsheet.html?highlight=msg.sender)
	- a global variable
	- The account that is interacting with the contract (calling a function / sending eth)
- named mappings
	- We can provide names for the key value pair when we create a mapping:
	- ``mapping(address funder => uint256 amountFunded) public addressToAmountFunded;``

#### Library
- [Library](https://docs.soliditylang.org/en/v0.8.14/contracts.html?highlight=library#libraries)
	- Libraries are similar to contracts but you can't declare any state variables and you can't send ether
	- A library is embedded into the contract if all library functions are internal... otherwise the library must be deployed and then linked before the contract is deployed
	- like a contract is created with the ``contract`` keyword, libraries are created with the ``library`` keyword
- The first input variable for a library is going to be type that we use with the library:
	- ``msg.value.getConversionRate();``
	- If thee function had more parameters, then we would just add it to the library function:
	- ``msg.value.getConversionRate(123);``
- [Solidity-by-example Library](https://solidity-by-example.org/library)

#### SafeMath
- [Openzeppelin Safemath](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/math/SafeMath.sol)
	- A common library that was used a lot in smart contracts
	- Compiler versions before 0.8.x did no prevent overflow/underflow
	- The safemath library provided overflow/underflow checks
- [unchecked vs. checked](https://docs.soliditylang.org/en/latest/control-structures.html#checked-or-unchecked-arithmetic)
	- In newer compilers, we can revert to the unchecked version with the ``unchecked`` keyword
	- A reason the ``unchecked`` keyword might be used is to save gas

#### For Loop
- [For Loop](https://solidity-by-example.org/loop)
	- A for loop is a way to loop through a list, or to do something in a repeated amount of times
	- For loops in Solidity are similar to loops from other languages
- `/* */` is another way to make comments
```js
for (/*starting index, ending index, step amount*/)
```

#### Resetting an array
- We have an existing address array: ``address[] public funders;``
- If we wanted to reset it, inside a function we could do: ``funders = new address[](0);``
	- We use the new keyword to reset the funders array to a blank array of addresses
	- We use 0 to indicate the length

#### Transfer, Send, and Call
- [Transfer, Send, Call](https://solidity-by-example.org/sending-ether/)
	- These are the three different ways we can send ether
	- transfer (2300 gas, throws error)
		- ``payable(msg.sender).transfer(address(this).balance);``
		- transfer automatically reverts
	- send (2300 gas, returns bool)
		- first we have to declare a variable name:
			- ``bool sendSuccess = payable(msg.sender).send(address(this).balance);``
		- then we have to use it in a require statement with an optional message:
			- ``require(sendSuccess,"Didn't work");``
		- send will only revert with the require statement
	- call (forward all gas or set gas, returns bool)
		- call is a lower level function which can be used to call virtually any function in all of ethereum without needing the abi
		- call returns two variables, bool and a bytes object, and we can account for that using parentheses
			- ``(bool success, bytes memory dataReturned) = payable(msg.sender).call{value: address(this).balance}("");``
			- the bool will be true if the function was successfully called... and if we were to have called a function, than the bytes would be the data returned
	- It can be case by case, but as of now, call is the recommended way to send and receive ethereum
- [this keyword](https://ethereum.stackexchange.com/questions/1781/what-is-the-this-keyword-in-solidity)

#### Constructor
- [Constructor](https://solidity-by-example.org/constructor)
	- using the ``constructor`` keyword, we designate a function that is called when we deploy our contract
```js
constructor() {
	owner = msg.sender;
}
```

#### Modifiers
- [Double equals](https://www.geeksforgeeks.org/solidity-operators/)
	- A single `=`  indicates assignment wheras a double `==` is a comparison
- [Modifier](https://solidity-by-example.org/function-modifier)
	- modifiers allow us create keywords that we can use in function declarations
	- the ``_;`` is a placeholder for the logic in the function that the modifier is applied to
```js
modifier onlyOwner() {
	require(msg.sender == owner, "not the owner");
	_;
}
```

#### Testnet Demo
- [Disconnecting Metamask](https://help.1inch.io/en/articles/4666771-metamask-how-to-connect-disconnect-and-switch-accounts-with-metamask-on-1inch-network)

#### Immutable & Constant
- [Immutable](https://solidity-by-example.org/immutable)
	- If we assign a variable once outside of the block that it is declared, we can use the ``immutable`` keyword
	- immutables aren't stored in storage slots but in the bytecode of the contract
	- the naming convention for immutable variables is to prefix them with ``i_``
- [Constant](https://solidity-by-example.org/constants)
	- If we assign a variable once outside of a function and never change it, we can use the ``constant`` keyword
	- like immutable, constant keywords don't take up a storage spot
	- the naming convention with constants is to use all caps with underscores
- [Current ETH Gas Prices](https://etherscan.io/gastracker)
- If we have variables that only get set one time, we can use Solidity tools to make them more gas efficient
- Naming Conventions
    - [Someone make this!](https://github.com/smartcontractkit/full-blockchain-solidity-course-js/issues/13)

#### Custom Errors
- [Custom Errors Introduction](https://blog.soliditylang.org/2021/04/21/custom-errors/)
	- When we use require statements, the messages have to be stored as strings
	- ``0.8.4`` introduced custom errors that are declared at the top outside of the contract
	- instead of using require, we use if statements

#### Receive and Fallback Function
- [Solidity Docs Special Functions](https://docs.soliditylang.org/en/latest/contracts.html?highlight=fallback#special-functions)
- [Receive](https://docs.soliditylang.org/en/latest/contracts.html?highlight=fallback#receive-ether-function)
	- ``receive() external payable {}``
	- A contract can have at most one receive function declared without using the function keyword
	- The function cannot have arguments, cannot return anything, and must have external visibility with payable state mutability
	- As long as there is no data associated with the transaction (no function specified, no calldata), the receive function will get triggered
		- Whenever we call a function, we're populating the calldata of the transaction with data that points to the function
- [Fallback](https://solidity-by-example.org/fallback)
	- Similar to the receive function, but it works even if data is sent with the transaction

### [Lesson 5: AI Prompting and Forums](https://www.youtube.com/watch?v=umepbfKp5rI&t=21600s)
#### 7 Tips for this Course
- [Original Video](https://www.youtube.com/watch?v=IS5dAkFSo_Y)
- Tinker
	- Try to pinpoint you error
- Ask your AI
	- Works best if you have pinpointed your error
	1. Write clear and specific instructions
	2. Give as much context as possible
	3. Use delimiters to clearly indicate distinct parts of the input
	4. Look out for hallucinations
- Read docs
- Web search
- Ask in a forum
	- peeranah.io
	- stack exchange
- Ask on the support forum or github
- Iterate

#### Formatting a question
- [markdown](https://www.markdownguide.org/basic-syntax/)
- It's a good idea to ask your AI buddy to format your questions in markdown

#### SpeedRunEthereum
- A good next step after this course
- [Challenges](https://speedrunethereum.com/)

### [Lesson 6: Foundry Simple Storage](https://www.youtube.com/watch?v=umepbfKp5rI&t=22979s)
#### Introduction
- [Foundry](https://book.getfoundry.sh/)
	- A smart contract development framework
	- Known specifically for its speed, the fastest to work with
	- Foundry is completely solidity based as opposed to hardhat being js based and brownie being python based
#### Installation & Setup
- [Visual Studio Code](https://code.visualstudio.com/)
    - [Crash Course](https://www.youtube.com/watch?v=WPqXP_kLzpo)
- [VSCode Keybindings](https://code.visualstudio.com/docs/getstarted/keybindings)
- [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- [What is a terminal?](https://code.visualstudio.com/docs/editor/integrated-terminal)

##### Windows Setup (WSL)
- Special Guest [Vasiliy](https://twitter.com/cromewar)
- [WSL](https://docs.microsoft.com/en-us/windows/wsl/install)
    - When working in WSL, use Linux commands instead of Windows commands
- [TroubleShooting](https://docs.microsoft.com/en-us/windows/wsl/troubleshooting)
- `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash`

> ⚠️ Please use Gitpod as an absolute last resort
>
##### Gitpod
- [Gitpod](https://www.gitpod.io/)
    - **If using this, NEVER share a private key with real money on Gitpod**
    - Ideally you figure out the MacOS, Linux, or Windows install though
#### Local Development Introduction
- `CMD + K` or `CTRL + K` clears the terminal
- `code .` to open VSCode in a new VSCode window
#### Foundry Install
- [https://getfoundry.sh](https://getfoundry.sh/)
	- ``curl -L https://foundry.paradigm.xyz | bash``
	- ``source /c/Users/User/.bashrc``
	- ``foundryup``
- Foundry comes with 4 components
	- forge
	- cast
	- anvil
	- chisel
#### VSCode Setup II
- CoPilot
- Copilot labs
- Hardhat Solidity Extension
- VSCodium
	- open source version of VScode
- Create project directory
	- `mkdir foundry-f23`
	- `cd foundry-f23`
	- `mkdir foundry-simple-storage-f23`
#### Foundry Setup
- [Freecodecamp Bash](https://www.freecodecamp.org/news/bash-scripting-tutorial-linux-shell-script-and-command-line-for-beginners/)
- [Foundry Docs Creating a new project](https://book.getfoundry.sh/projects/creating-a-new-project)
	- $ forge init hello_foundry
#### Formatting Solidity in VSCode
- Format your solidity code with in your `settings.json`
```json
"[solidity]": {
	"editor.defaultFormatter": "NomicFoundation.hardhat-solidity"
},
"[javascript]":{
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```
#### Compiling in Foundry
- ``forge build`` or ``forge compile``
#### Deploying to a local chain (Anvil or Ganache)
- ``anvil``
	- creates a local blockchain node similar to ``hardhat node``
- [Ganache](https://trufflesuite.com/ganache/)
	- A "on click blockchain" that provides a user interface
#### Adding Another Network on Metamask
- [ETH JSON RPC](https://ethereum.github.io/execution-apis/api-documentation/)
	- Network name: Localhost
	- New RPC URL: http://127.0.0.1/8545
	- ChainID: 31337
#### Deploying to a local chain (Forge Create)
- ``forge --help``
```
Build, test, fuzz, debug and deploy Solidity contracts.

Usage: forge.exe <COMMAND>

Commands:
  bind               Generate Rust bindings for smart contracts
  build              Build the project's smart contracts [aliases: b, compile]
  cache              Manage the Foundry cache
  clean              Remove the build artifacts and cache directories [aliases: cl]
  completions        Generate shell completions script [aliases: com]
  config             Display the current config [aliases: co]
  coverage           Generate coverage reports
  create             Deploy a smart contract [aliases: c]
  debug              Debugs a single smart contract as a script [aliases: d]
  doc                Generate documentation for the project
  flatten            Flatten a source file and all of its imports into one file [aliases: f]
  fmt                Format Solidity source files
  geiger             Detects usage of unsafe cheat codes in a project and its dependencies
  generate           Generate scaffold files
  generate-fig-spec  Generate Fig autocompletion spec [aliases: fig]
  help               Print this message or the help of the given subcommand(s)
  init               Create a new Forge project
  inspect            Get specialized information about a smart contract [aliases: in]
  install            Install one or multiple dependencies [aliases: i]
  remappings         Get the automatically inferred remappings for the project [aliases: re]
  remove             Remove one or multiple dependencies [aliases: rm]
  script             Run a smart contract as a script, building transactions that can be sent onchain
  selectors          Function selector utilities [aliases: se]
  snapshot           Create a snapshot of each test's gas usage [aliases: s]
  test               Run the project's tests [aliases: t]
  tree               Display a tree visualization of the project's dependency graph [aliases: tr]
  update             Update one or multiple dependencies [aliases: u]
  upload-selectors   Uploads abi of given contract to the https://api.openchain.xyz function selector database [aliases: up]
  verify-check       Check verification status on Etherscan [aliases: vc]
  verify-contract    Verify smart contracts on Etherscan [aliases: v]

Options:
  -h, --help     Print help
  -V, --version  Print version
```

- ``forge create ContractName --interactive``
	- deploy a contract and a private key will be requested
- ``forge create ContractName --private-key PRIVATEKEY``
	- deploy a contract with a private key
	- This is not the best option as we never want to have our private key in plain text
	- use ``history -c`` to clear bash history
- ``forge create ContractName --rpc-url URL --private-key PRIVATE KEY``
	- a more explicit way to deploy
#### Deploying to a local chain (Forge Script)
- Foundry allows us to write a script in Solidity in order to deploy
	- Foundry has a lot built in to give Solidity more functionality outside of just smart contracts
- ``ContractName.s.sol``
	- We use the .s convention when naming our deploy contract/script?
- ``import {Script} from "forge-std/Script.sol";``
	- We need to use this import statement and then apply it to our contract
	- ``contract SimpleStorageScript is Script {}``
- [Cheatcodes](https://book.getfoundry.sh/forge/cheatcodes)
	- The vm keyword is a special keyword we can only use in Foundry
	- You can access cheatcodes easily via the `vm` instance
```js
function run() external returns(SimpleStorage) {
	vm.startBroadcast();
	SimpleStorage simpleStorage = new SimpleStorage();
	vm.stopBroadcast();
	return simpleStorage;
}
```
- The code between these two commands is what we actually send and deploy (transactions)
- ``forge script /script/ContractName.s.sol``
	- Deploys the script with the file we created
	- If we don't specify an RPC, it will run the script on a temporary anvil chain
- ``forge script /script/ContractName.s.sol --rpc-url URL``
	- While anvil is running, this command simulates deployment
- ``forge script /script/ContractName.s.sol --rpc-url UR --broadcast --private-key PRIVATE KEY``
	- Deploys to to local node running with anvil
#### What is a transaction?
- transaction data from "./broadcast/ContractName/dry-run/"
```json
 "transaction": {
        "type": "0x02",
        "from": "0x1804c8ab1f12e6bbf3894d4083f33e07309d1f38",
        "gas": "0xb5c8a",
        "value": "0x0",
        "data": "0x6000805460ff1916905560101960025560c0604052600960809081526839b2bb32b73a32b2b760b91b60a05260039061003890826101a9565b50600480546001600160a01b031916733c44cdddb6a900fa2b585dd299e03d12fa4293bc1790556218d85d60ea1b60055560408051808201825260118152815180830190925260038252622937b160e91b60208381019190915281018290528051600b9081559091600c906100ad90826101a9565b505060408051808201825260118152815180830190925260038252622137b960e91b60208381019190915281018290528051600d90815590925090600e906100f590826101a9565b50505034801561010457600080fd5b50610268565b634e487b7160e01b600052604160045260246000fd5b600181811c9082168061013457607f821691505b60208210810361015457634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156101a457600081815260208120601f850160051c810160208610156101815750805b601f850160051c820191505b818110156101a05782815560010161018d565b5050505b505050565b81516001600160401b038111156101c2576101c261010a565b6101d6816101d08454610120565b8461015a565b602080601f83116001811461020b57600084156101f35750858301515b600019600386901b1c1916600185901b1785556101a0565b600085815260208120601f198616915b8281101561023a5788860151825594840194600190910190840161021b565b50858210156102585787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b6105f6806102776000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c80636f760f411161005b5780636f760f41146100e6578063b11cdb3a146100f9578063c164682714610102578063e853a1c21461012d57600080fd5b806319e96ec61461008d5780632e64cec1146100ac5780632ebce631146100be5780636057361d146100d1575b600080fd5b610095610135565b6040516100a39291906102e3565b60405180910390f35b6001545b6040519081526020016100a3565b6100956100cc36600461031d565b6101cc565b6100e46100df36600461031d565b600155565b005b6100e46100f43660046103d9565b610201565b6100b060025481565b6100b061011036600461041e565b8051602081830181018051600a8252928201919093012091525481565b6100956102ab565b600b8054600c80549192916101499061045b565b80601f01602080910402602001604051908101604052809291908181526020018280546101759061045b565b80156101c25780601f10610197576101008083540402835291602001916101c2565b820191906000526020600020905b8154815290600101906020018083116101a557829003601f168201915b5050505050905082565b600981815481106101dc57600080fd5b600091825260209091206002909102018054600182018054919350906101499061045b565b604080518082019091528181526020810183815260098054600181018255600091909152825160029091027f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7af8101918255915190917f6e1540171b6c0c960b71a7020d9f60077f6af931a8bbf590da0223dacf75c7b0019061028390826104e4565b50505080600a8360405161029791906105a4565b908152604051908190036020019020555050565b600d8054600e80549192916101499061045b565b60005b838110156102da5781810151838201526020016102c2565b50506000910152565b82815260406020820152600082518060408401526103088160608501602087016102bf565b601f01601f1916919091016060019392505050565b60006020828403121561032f57600080fd5b5035919050565b634e487b7160e01b600052604160045260246000fd5b600082601f83011261035d57600080fd5b813567ffffffffffffffff8082111561037857610378610336565b604051601f8301601f19908116603f011681019082821181831017156103a0576103a0610336565b816040528381528660208588010111156103b957600080fd5b836020870160208301376000602085830101528094505050505092915050565b600080604083850312156103ec57600080fd5b823567ffffffffffffffff81111561040357600080fd5b61040f8582860161034c565b95602094909401359450505050565b60006020828403121561043057600080fd5b813567ffffffffffffffff81111561044757600080fd5b6104538482850161034c565b949350505050565b600181811c9082168061046f57607f821691505b60208210810361048f57634e487b7160e01b600052602260045260246000fd5b50919050565b601f8211156104df57600081815260208120601f850160051c810160208610156104bc5750805b601f850160051c820191505b818110156104db578281556001016104c8565b5050505b505050565b815167ffffffffffffffff8111156104fe576104fe610336565b6105128161050c845461045b565b84610495565b602080601f831160018114610547576000841561052f5750858301515b600019600386901b1c1916600185901b1785556104db565b600085815260208120601f198616915b8281101561057657888601518255948401946001909101908401610557565b50858210156105945787850151600019600388901b60f8161c191681555b5050505050600190811b01905550565b600082516105b68184602087016102bf565b919091019291505056fea2646970667358221220b36d7516bd2e81c318a8ad665aad931e6d330cdd7ca5094e5bb5e0ce93413b4764736f6c63430008150033",
        "nonce": "0x2",
        "accessList": []
      },
```
- Any time state is changed on the blockchain, it does it in a transaction
	- The differentiator is whatever is in the ``data`` field
	- The data field contains the opcodes
- ``cast`` is a built in foundry command
	- ``cast --to-base 0x714c2 dec // 464066``
- ``cast --help``
```
Perform Ethereum RPC calls from the comfort of your command line

Usage: cast.exe <COMMAND>

Commands:
  4byte                  Get the function signatures for the given
                             selector from https://openchain.xyz [aliases:
                             4, 4b]
  4byte-decode           Decode ABI-encoded calldata using
                             https://openchain.xyz [aliases: 4d, 4bd]
  4byte-event            Get the event signature for a given topic 0
                             from https://openchain.xyz [aliases: 4e, 4be]
  abi-decode             Decode ABI-encoded input or output data
                             [aliases: ad, --abi-decode]
  abi-encode             ABI encode the given function argument,
                             excluding the selector [aliases: ae]
  access-list            Create an access list for a transaction
                             [aliases: ac, acl]
  address-zero           Prints the zero address [aliases:
                             --address-zero, az]
  admin                  Fetch the EIP-1967 admin account [aliases:
                             adm]
  age                    Get the timestamp of a block [aliases: a]
  balance                Get the balance of an account in wei [aliases:
                             b]
  base-fee               Get the basefee of a block [aliases: ba, fee,
                             basefee]
  bind                   Generate a rust binding from a given ABI
                             [aliases: bi]
  block                  Get information about a block [aliases: bl]
  block-number           Get the latest block number [aliases: bn]
  call                   Perform a call on an account without
                             publishing a transaction [aliases: c]
  calldata               ABI-encode a function with arguments [aliases:
                             cd]
  calldata-decode        Decode ABI-encoded input data [aliases:
                             --calldata-decode, cdd]
  chain                  Get the symbolic name of the current chain
  chain-id               Get the Ethereum chain ID [aliases: ci, cid]
  client                 Get the current client version [aliases: cl]
  code                   Get the runtime bytecode of a contract
                             [aliases: co]
  codesize               Get the runtime bytecode size of a contract
                             [aliases: cs]
  completions            Generate shell completions script [aliases:
                             com]
  compute-address        Compute the contract address from a given
                             nonce and deployer address [aliases: ca]
  concat-hex             Concatenate hex strings [aliases:
                             --concat-hex, ch]
  create2                Generate a deterministic contract address
                             using CREATE2 [aliases: c2]
  decode-transaction     Decodes a raw signed EIP 2718 typed
                             transaction [aliases: dt]
  disassemble            Disassembles hex encoded bytecode into
                             individual / human readable opcodes [aliases:
                             da]
  estimate               Estimate the gas cost of a transaction
                             [aliases: e]
  etherscan-source       Get the source code of a contract from
                             Etherscan [aliases: et, src]
  find-block             Get the block number closest to the provided
                             timestamp [aliases: f]
  format-bytes32-string  Formats a string into bytes32 encoding
                             [aliases: --format-bytes32-string]
  from-bin               "Convert binary data into hex data." [aliases:
                             --from-bin, from-binx, fb]
  from-fixed-point       Convert a fixed point number into an integer
                             [aliases: --from-fix, ff]
  from-rlp               Decodes RLP encoded data [aliases: --from-rlp]
  from-utf8              Convert UTF8 text to hex [aliases:
                             --from-ascii, --from-utf8, from-ascii, fu, fa]
  from-wei               Convert wei into an ETH amount [aliases:
                             --from-wei, fw]
  gas-price              Get the current gas price [aliases: g]
  generate-fig-spec      Generate Fig autocompletion spec [aliases:
                             fig]
  hash-zero              Prints the zero hash [aliases: --hash-zero,
                             hz]
  help                   Print this message or the help of the given
                             subcommand(s)
  implementation         Fetch the EIP-1967 implementation account
                             [aliases: impl]
  index                  Compute the storage slot for an entry in a
                             mapping [aliases: in]
  interface              Generate a Solidity interface from a given ABI
                             [aliases: i]
  keccak                 Hash arbitrary data using Keccak-256 [aliases:
                             k]
  logs                   Get logs by signature or topic [aliases: l]
  lookup-address         Perform an ENS reverse lookup [aliases: la]
  max-int                Prints the maximum value of the given integer
                             type [aliases: --max-int, maxi]
  max-uint               Prints the maximum value of the given integer
                             type [aliases: --max-uint, maxu]
  min-int                Prints the minimum value of the given integer
                             type [aliases: --min-int, mini]
  namehash               Calculate the ENS namehash of a name [aliases:
                             na, nh]
  nonce                  Get the nonce for an account [aliases: n]
  parse-bytes32-address  Parses a checksummed address from bytes32
                             encoding. [aliases: --parse-bytes32-address]
  parse-bytes32-string   Parses a string from bytes32 encoding
                             [aliases: --parse-bytes32-string]
  pretty-calldata        Pretty print calldata [aliases: pc]
  proof                  Generate a storage proof for a given storage
                             slot [aliases: pr]
  publish                Publish a raw transaction to the network
                             [aliases: p]
  receipt                Get the transaction receipt for a transaction
                             [aliases: re]
  resolve-name           Perform an ENS lookup [aliases: rn]
  rpc                    Perform a raw JSON-RPC request [aliases: rp]
  run                    Runs a published transaction in a local
                             environment and prints the trace [aliases: r]
  send                   Sign and publish a transaction [aliases: s]
  shl                    Perform a left shifting operation
  shr                    Perform a right shifting operation
  sig                    Get the selector for a function [aliases: si]
  sig-event              Generate event signatures from event string
                             [aliases: se]
  storage                Get the raw value of a contract's storage slot
                             [aliases: st]
  to-ascii               Convert hex data to an ASCII string [aliases:
                             --to-ascii, tas, 2as]
  to-base                Converts a number of one base to another
                             [aliases: --to-base, --to-radix, to-radix, tr,
                             2r]
  to-bytes32             Right-pads hex data to 32 bytes [aliases:
                             --to-bytes32, tb, 2b]
  to-check-sum-address   Convert an address to a checksummed format
                             (EIP-55) [aliases: --to-checksum-address,
                             --to-checksum, to-checksum, ta, 2a]
  to-dec                 Converts a number of one base to decimal
                             [aliases: --to-dec, td, 2d]
  to-fixed-point         Convert an integer into a fixed point number
                             [aliases: --to-fix, tf, 2f]
  to-hex                 Converts a number of one base to another
                             [aliases: --to-hex, th, 2h]
  to-hexdata             Normalize the input to lowercase, 0x-prefixed
                             hex [aliases: --to-hexdata, thd, 2hd]
  to-int256              Convert a number to a hex-encoded int256
                             [aliases: --to-int256, ti, 2i]
  to-rlp                 RLP encodes hex data, or an array of hex data
                             [aliases: --to-rlp]
  to-uint256             Convert a number to a hex-encoded uint256
                             [aliases: --to-uint256, tu, 2u]
  to-unit                Convert an ETH amount into another unit
                             (ether, gwei or wei) [aliases: --to-unit, tun,
                             2un]
  to-wei                 Convert an ETH amount to wei [aliases:
                             --to-wei, tw, 2w]
  tx                     Get information about a transaction [aliases:
                             t]
  upload-signature       Upload the given signatures to
                             https://openchain.xyz [aliases: ups]
  wallet                 Wallet management utilities [aliases: w]

Options:
  -h, --help     Print help
  -V, --version  Print version

Find more information in the book:
http://book.getfoundry.sh/reference/cast/cast.html
```
#### Private Keys
- .env
	- This shouldn't be done for production? testing only
	- we can add private key and rpc url in our env file
	- ``source .env`` will add the environment variables into our shell
	- ``echo $VARIABLE_NAME`` will display on the console
- For the moment a `$PRIVATE_KEY` in the `.env` is okay as long as the `.env` isn't exposed
	- For production, use `--interactive`
	- A keystore file with a password is a good option when it becomes available
	- [dapptools - Ethsign](https://github.com/dapphub/dapptools/blob/master/src/ethsign/README.md)
#### ThirdWeb Deploy
- [nodejs install](https://nodejs.org/en/download)
- [npm install](https://nodejs.org/en/download)
- [thirdweb](https://thirdweb.com/)
	- ``npx thirdweb deploy``
	- Uploads contract data to ipfs, and it automatically gets verified
#### Private Key Summary
```
Summary:
When you look to deploy
with real money, you should use either:
1. A password encrypted keystore
2. Something like thirdweb deploy

The idea is you never want to have
your private key or password
ANYWHERE written in plain text
(Aka, you always want it encrypted)
```
#### Cast Send
```
$ cast send --help
Sign and publish a transaction

Usage: cast.exe send [OPTIONS] [TO] [SIG] [ARGS]... [COMMAND]

Commands:
  --create  Use to deploy raw contract bytecode
  help      Print this message or the help of the given subcommand(s)

Arguments:
  [TO]
          The destination of the transaction.

          If not provided, you must use cast send --create.

  [SIG]
          The signature of the function to call

  [ARGS]...
          The arguments of the function to call

Options:
      --async
          Only print the transaction hash and exit immediately

          [env: CAST_ASYNC=]

      --confirmations <CONFIRMATIONS>
          The number of confirmations until the receipt is fetched

          [default: 1]

      --resend
          Reuse the latest nonce for the sender account

      --unlocked
          Send via `eth_sendTransaction using the `--from` argument or
          $ETH_FROM as sender

  -h, --help
          Print help (see a summary with '-h')

Display options:
  -j, --json
          Print the transaction receipt as JSON

Transaction options:
      --gas-limit <GAS_LIMIT>
          Gas limit for the transaction

          [env: ETH_GAS_LIMIT=]

      --gas-price <PRICE>
          Gas price for legacy transactions, or max fee per gas for EIP1559
          transactions

          [env: ETH_GAS_PRICE=]

      --priority-gas-price <PRICE>
          Max priority fee per gas for EIP1559 transactions

          [env: ETH_PRIORITY_GAS_PRICE=]

      --value <VALUE>
          Ether to send in the transaction, either specified in wei, or as
          a string with a unit type.

          Examples: 1ether, 10gwei, 0.01ether

      --nonce <NONCE>
          Nonce for the transaction

      --legacy
          Send a legacy transaction instead of an EIP1559 transaction.

          This is automatically enabled for common networks without
          EIP1559.

Ethereum options:
  -r, --rpc-url <URL>
          The RPC endpoint

          [env: ETH_RPC_URL=]

      --flashbots
          Use the Flashbots RPC URL (https://rpc.flashbots.net)

      --jwt-secret <JWT_SECRET>
          JWT Secret for the RPC endpoint.

          The JWT secret will be used to create a JWT for a RPC. For
          example, the following can be used to simulate a CL
          `engine_forkchoiceUpdated` call:

          cast rpc --jwt-secret <JWT_SECRET> engine_forkchoiceUpdatedV2
          '["0x6bb38c26db65749ab6e472080a3d20a2f35776494e72016d1e339593f21c
59bc",
          "0x6bb38c26db65749ab6e472080a3d20a2f35776494e72016d1e339593f21c59
bc",
          "0x6bb38c26db65749ab6e472080a3d20a2f35776494e72016d1e339593f21c59
bc"]'

          [env: ETH_RPC_JWT_SECRET=]

  -e, --etherscan-api-key <KEY>
          The Etherscan (or equivalent) API key

          [env: ETHERSCAN_API_KEY=]

  -c, --chain <CHAIN>
          The chain name or EIP-155 chain ID

          [env: CHAIN=]

Wallet options - raw:
  -f, --from <ADDRESS>
          The sender account

          [env: ETH_FROM=]

  -i, --interactive
          Open an interactive prompt to enter your private key

      --private-key <RAW_PRIVATE_KEY>
          Use the provided private key

      --mnemonic <MNEMONIC>
          Use the mnemonic phrase of mnemonic file at the specified path

      --mnemonic-passphrase <PASSPHRASE>
          Use a BIP39 passphrase for the mnemonic

      --mnemonic-derivation-path <PATH>
          The wallet derivation path.

          Works with both --mnemonic-path and hardware wallets.

      --mnemonic-index <INDEX>
          Use the private key from the given mnemonic index.

          Used with --mnemonic-path.

          [default: 0]

Wallet options - keystore:
      --keystore <PATH>
          Use the keystore in the given folder or file

          [env: ETH_KEYSTORE=]

      --account <ACCOUNT_NAME>
          Use a keystore from the default keystores folder
          (~/.foundry/keystores) by its filename

          [env: ETH_KEYSTORE_ACCOUNT=]

      --password <PASSWORD>
          The keystore password.

          Used with --keystore.

      --password-file <PASSWORD_FILE>
          The keystore password file path.

          Used with --keystore.

          [env: ETH_PASSWORD=]

Wallet options - hardware wallet:
  -l, --ledger
          Use a Ledger hardware wallet

  -t, --trezor
          Use a Trezor hardware wallet

Wallet options - AWS KMS:
      --aws
          Use AWS Key Management Service
```

- Sending a tx cast
	- ``$ cast send CONTRACT ADDRESS "fn(type)" arg --rpc-url $RPC_URL --private-key $PRIVATE_KEY``
- Calling with cast
	- ``cast call CONTRACT ADDRESS "fn()"  --rpc- url $RPC_URL --private-key $PRIVATE_KEY``
	- values are returned in hex so we can use ``cast --to-base HEXVALUE dec``

#### Deploying to a testnet or mainnet
- update .env
	- Add actual private key from metamask
	- add rpc url from one of the providers below
- [Alchemy](https://alchemy.com/?a=673c802981)
	- ``$ forge script script/FILENAME.s.sol --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY --broadcast``
- Other node as a service:
    - [Quicknode](https://www.quicknode.com/endpoints)
    - [Infura](https://www.infura.io/)

#### Verifying a contract the manual way
- [Example verified contract](https://sepolia.etherscan.io/address/0xe2e9f468eb7f063aa01670bb4bce4119fb6e4b65#code)
- Etherscan
	- We can manually verify a contract using etherscan
	- We fill in the blanks and paste our code
	- We now have access to read and write functions we can interact with metamask

#### Cleaning up the Project
- `forge fmt`
	- command that automatically formats all our solidity code
- `README.md`
	- Information about your project

#### Alchemy and the mempool
- [Alchemy](https://alchemy.com/?a=673c802981)
	- Whenever we send a transaction to a blockchain, it enters a mempool
	- The mempool is where transactions go before they get sent

#### Summary
- create a new foundry project: ``forge --init``
- forge
	- used for interacting with and compiling contracts
- cast
	- used for interacting with contracts that have already been deployed
- anvil
	- used to deploy a local blockchain
- sending a transaction with metamask is sending an http post request to an rpc url
- we can take an rpc url from somewhere like alchemy and use it in our foundry projects
- we can compile our code in foundry and write a script in solidity to deploy our contracts
- we can use a ``.env`` file, but we may not want to store private keys there
- ``cast call`` to interact with deployed contracts
- ``forge fmt`` to autoformat code
- we can verify contracts manually