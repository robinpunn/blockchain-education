
---

## Ethereum Features

---
---
### Introduction to Ethereum
---
#### Review: Ethereum Block Architecture
![Ethereum Block Architecture](https://i.stack.imgur.com/eOwjD.png)

#### What is Ethereum?
- The computer science "***technical***" definition:
    - **Ethereum** is a deterministic but practically unbounded state machine, consisting of a globally accessible singleton state and a virtual machine that applies changes to that state.
- The **practical** definition:
    - **Ethereum** is an open source, globally decentralized computing infrastructure that executes programs called smart contracts
        - Uses a blockchain to synchronize and store the system’s state changes
        - Uses a cryptocurrency called ether to meter and constrain execution resource costs
- The **visual** definition:
- Imagine thousands of computers all over the world connected by the Internet...
    - Each runs same computer program, always! These are the nodes…
    - This program sets out rules (consensus!) for how the computers should work together
    - How to talk to each other? How to store data? How to decide what is what…
- In a **real** sense, it is one computer. **This computer is Ethereum**.
> The above concept is extremely important to learn! Ethereum = A Computer. That's it! It's just a big ole' fancy decentralized computer! 🤯 Let's break it down even further...

#### Ethereum = A Computer
![Ethereum is a Computer](https://res.cloudinary.com/divzjiip8/image/upload/v1670476909/alchemyu/Screen_Shot_2022-12-07_at_9.20.57_PM.png)
- That's right. Ethereum can be seen just like any other consumer computer that we know! The thing is, the Ethereum computer isn't actually that fast. 
- In fact, code execution on the Ethereum computer is 5-100x slower than typical compiled code on other machines. 
- It's also quite expensive to use! Adding 5+5 is a lightning flash calculation even on phones... adding 5+5 in Ethereum can cost a few dollars. 
- Basically, the Ethereum computer's basic computation, storage and memory costs mirror those of a 1950's computer.

#### Properties of the Ethereum Computer
- Let's look at some properties of the Ethereum computer that make it actually useful...
1. Ethereum = Truly Global Singleton
    - Ethereum is possibly the first global singleton computer ever, that is fundamentally not localized (meaning, it's not located in any one single location). 
    - All other computers are either physical machines (laptops) or virtual machines, which reside in physical machines.
- Ethereum does not reside in any single machine, no physical presence in any part of the world… yet there is only one!
2. Censorship Resistance
    - No authority, government or corporation is behind the Ethereum computer. 
    - No one owns it, can shut it off or can use it as an advanced user (ie. a system administrator in a typical client-server setup).
3. Ethereum = Ubiquitous & Accessible
    - Where there is Internet, there is Ethereum. 
    - There are no barriers to participation. 
    - If you can connect to WiFi, you can interact with the Ethereum computer. 
    - If you want to write to the Ethereum computer, you'll just need some ETH on top of an Internet connection - to pay gas! So, the Ethereum computer is ubiquitous (everywhere!).
    - In terms of accessibility, Ethereum's main smart contract programming language is currently Solidity - a language with strong similarities in design to JavaScript. 
    - JS is the programming language that powers the Internet. 
    - Therefore, the learning curb for new Ethereum devs is not that particularly difficult - it's very similar to the most popular programming language on the planet. 
    - This means the Ethereum computer is not hidden behind layers of complexity, it is accessible, as a start, to anyone that knows (or learns!) JavaScript.
4. Ethereum = Natively Multi-User
    - The Ethereum computer, thanks to the wide input range of the keccack256 hash function, has a practically infinite range possible for account creation. 
    - The range is 2^160, a number so incredibly large, that our puny human brains cannot even comprehend it.
    - Basically, the Ethereum computer can supply as many accounts as we'll ever need - and then more. 
> [Here's a cool video](https://www.youtube.com/watch?v=S9JGmA5_unY) that breaks down such large number ranges used in cryptography! 
5. Ethereum is Verifiable & Auditable
    - Any code deployed onto the Ethereum computer is honored now and forever. 
    - Smart contracts inherit the cryptographic properties of the Ethereum computer: immutability, censorship-resistance and verifiability. 
    - Once you deploy a smart contract, unless you explicitly code in a clause with a call to selfdestruct, that contract will live on the Ethereum computer FOREVER. 
    - No one can change it, not even Vitalik.

#### So... Why Ethereum?
- The Ethereum platform enables developers to build powerful decentralized applications with built-in economic functions, while providing high availability, transparency, and neutrality.
- The point of Ethereum isn’t to be fast or cheap, the point is to be trustworthy. 
- Any program that runs on the Ethereum computer is guaranteed to run the same way everywhere, on every node. 
- Data stored on the Ethereum computer is available everywhere, and it is permanent. Now that's a cool computer right there!

#### Ethereum vs. Bitcoin
- One of the key differences between Ethereum and Bitcoin is that Ethereum has a virtual machine built into it that supports Turing-Complete languages, which means developers can build arbitrary applications and programs on top of it.
- In contrast, Bitcoin's Script language is purposefully restricted to simple true/false evaluations of conditions correlating to whether or not a UTXO can be spent. It does not allow for loops.
> Note that adding loop functionality is not particularly difficult, it's simply a matter of adding a conditional jump (i.e. if this condition is true, go to this line of code).
- Programs written in Turing-complete languages have a property that makes it impossible to tell if those programs will ever terminate. 
- Alan Turing proved it is generally impossible to do so, known as [The Halting Problem](https://en.wikipedia.org/wiki/Halting_problem).
- Let's consider the following JavaScript code:
```javascript
for(let i = 0; i >= 0; i++) {
  console.log(i);
}
```
- Looking at the conditions, we can see that this loop will never terminate. If we tried to run similar code on Ethereum, what would happen?
- A miner would receive the transaction, add it to their transaction memory pool, mine a block, add the transaction to the block, and then broadcast that block to the network. 
    - Now, all the other nodes in the network will try to run the transaction on their own machine, they will be stuck in an infinite loop! 
- In order to prevent such attacks from occurring, Ethereum designed its own Virtual Machine to run transactions within. 
    Let's take a deeper look at the **Ethereum Virtual Machine (EVM)**.
**Other differences between Ethereum and Bitcoin**
<table>
    <tr>
        <th></th>
        <th>Ethereum</th>
        <th>Bitcoin</th>
    </tr>
    <tr>
        <td>Consensus Mechanism</td>
        <td>Proof of stake</td>
        <td>Proof of work</td>
    </tr>
    <tr>
        <td>Accounting System</td>
        <td>Account Model</td>
        <td>UTXO Model</td>
    </tr>
    <tr>
        <td>Public Key Cryptography</td>
        <td>secp256k1 elliptic curve</td>
        <td>secp256k1 elliptic curve</td>
    </tr>
    <tr>
        <td>Stale/Orphan Blocks</td>
        <td>Rewarded (Ommer Blocks)</td>
        <td>Not Rewarded</td>
    </tr>
    <tr>
        <td>Block Time</td>
        <td>Approx every 12 seconds</td>
        <td>Approx every 10 minutes</td>
    </tr>
    <tr>
        <td>Network Difficulty</td>
        <td>Adjusted every block</td>
        <td>Every 2016 blocks</td>
    </tr>    
    <tr>
        <td>Language Support</td>
        <td>Turing Complete smart contracts, custom VMVM operations cost gas.</td>
        <td>non-Turing Complete scripts</td>
    </tr>
</table>

#### The Ethereum Virtual Machine
- A Virtual Machine is a program that emulates a particular environment for code to run in.
    - For instance, if you wanted to run macOS on Windows, you could download a virtual machine that would emulate the macOS environment.
    - In this case, the virtual machine emulates a hardware architecture.
- Another Virtual Machine you may have heard of is the Java Virtual Machine.
    - The JVM allows developers to write Java code on different machines without worrying about the underlying details of computer architecture.
    - Write once, run everywhere.
    - In this case, the JVM emulates a particular software environment.
- The EVM is similar to the JVM.
    - In fact, the JVM was considered as an option to build Ethereum on top of before development began on the EVM!
    - The problem is, the EVM had very specific requirements in order to run on a decentralized blockchain.
- Take, for example, that infinite loop from the previous section:
```javascript
for(let i = 0; i >= 0; i++) {
  console.log(i);
}
```
-  How could we create an environment in which code like this would not be able to run infinitely?
    - It turns out the simplest way to do this is by adding a monetary cost to each operation.
    - This cost on Ethereum is known as gas.
#### Gas
- Gas is a measurement of the cost to each operation that relates to the computational cost that the operation incurs on the network.
- So if you are making every node in the network do some kind of computationally expensive task every time they need to verify your transaction, you'll need to pay for significantly more than a simple transaction that is sending money from one individual to another.
> We learned about expressions and statements in JavaScript. An operation in assembly code is lower level, which means it describes a much simpler task. For example, storing/loading a value in memory require its own operation in most assembly languages.
- The Ethereum Virtual Machine has a [list of operation codes with a corresponding gas cost](https://github.com/crytic/evm-opcodes) (partially displayed below).
![EVM Opcodes](https://res.cloudinary.com/divzjiip8/image/upload/v1670438352/alchemyu/op-codes-costs.png)
>Even though the above gas costs are fixed, the actual price of gas is ever changing. This is similar to how literal gasoline works: cars have a “fixed” cost for the amount of gas they need to get from A to B but the price of that gas is ever-changing. We’ll learn more about this in the next article: Gas on Ethereum.
- We can split these operations up into a several categories:
    - Arithmetic (i.e. ``ADD``, ``DIV``, etc.)
    - Information about the current context of the transaction (i.e. ``TIMESTAMP`` , ``CALLVALUE``, etc.)
    - Operations that manipulate/retrieve from **temporary memory** (i.e. ``MSTORE``, ``PUSH32``, etc.)
    - Operations that manipulate/retrieve from **persistent memory** (i.e. ``SSTORE``, ``CREATE``, etc.)
    - Control Flow Operations that provide us with **loops** (i.e. ``JUMP``, ``JUMPI``, etc.)
- You can see that operations that create or modify persistent data on the blockchain have significantly more costs associated with them than simple arithmetic operations.
    - For example ADD requires 3 gas, while using SSTORE can require 20000 gas.
    - Even the operation BALANCE has significant costs associated with it (700 gas) because it requires a lookup in persistent memory.
> Quick note on persistent versus temporary memory. Temporary memory only exists for the extent of the transaction. It's like creating a variable inside a function in JavaScript. Once that function has completed, the variable is inaccessible. On the other hand, persistent memory lives on after the function call. You can read the state of this variable at any block by querying an Ethereum node.
- You might be wondering how they came up with such specific gas costs.
    - Benchmarking certainly helps for this, although in some ways this can be a bit of a guessing game.
    - The goal is to find a gas cost that is representative of the amount of strain the operation takes on the network.
    - All operations on the blockchain, as well as storage of persistant data, are run on every full node in the entire Ethereum Network.
- In the past, attackers have attempted to exploit any discrepancies between computationally expensive operations and their associated gas costs.
    - These attacks are referred to as denial of service attacks because they'll slow the network to a crawl and essentially deny users of the service.
    - Due to this, Ethereum has had to upgrade the VM at times in order to adjust gas costs.
- How does a decentralized network upgrade a Virtual Machine running on thousands of machines? Forks.
#### Understanding Forks
- Part of the philosophy of Ethereum is to move fast and embrace change.
- As such, Ethereum was designed with the ability to conduct upgrades, and built in a process for suggesting improvements to the system.
- Each update is specified in an Ethereum Improvement Proposal or EIP for short!
- Anyone can suggest standards for Smart Contracts like the popular EIP20 Token Standard or changes to the Virtual Machine itself like this addition of the DELEGATECALL opcode.
- Updates to the VM require forks.
- To understand why, let's consider how the EVM works.
- The Ethereum Virtual Machine is first and foremost **a specification**.
- This means that it is outlined in a formal paper called [The Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf).
- Several teams used this specification and implemented the EVM in different languages.
- Each of these EVM implementations is called an **Ethereum Client**.
- Two commonly used Ethereum clients today are [Erigon](https://github.com/ledgerwatch/erigon) and [Geth](https://geth.ethereum.org/docs/getting-started) both written in Go ([Parity](https://github.com/openethereum/parity-ethereum) used to be a popular client but was deprecated in 2020).
- There are many other clients in different languages that you can explore [here](https://ethereum.org/en/developers/docs/nodes-and-clients/).
> For a good example to drive the point home, check out how the ``ADD`` operation is implemented by Geth [here](https://github.com/ethereum/go-ethereum/blob/3bb9b49afb17ae4e66f52adba359670078883dcb/core/vm/instructions.go#L40-L46). This code is written in Go, but it should still look a bit familiar! The ``ADD`` operation is specified in the Ethereum Yellow Paper and then the client (in this case Geth) can choose to implement it however they like so long as it adheres to the specification!
- Some upgrades to the Ethereum Virtual Machine are planned and others are impromptu responses to attacks.
- Either way, when these changes are to be adopted a fork occurs.
- This is because active nodes need to update their client with the latest changes specified by the EIPs.
- It's called a fork because some nodes may choose to update their client version while others may choose not to.
> You may have heard the terms hard fork and soft fork for blockchains before. The difference between these terms is that a soft fork is backwards compatible (the older version can still be used) while a hard fork is not.
- In most cases, all clients update and the new changes are successfully adopted.
- Many of these upgrades were planned far in advance and make objectively good upgrades to the system.
- [Tangerine Whistle](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-608.md) is a good example of a Hard Fork in response to a Denial of Service attack that was adopted fully by the community.
    - This Hard Fork modified the gas costs of [specific operations](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-150.md) to ensure that were more reflective of the computational load required by the network.
- In other cases, especially updates that have **political implications**, clients may not adopt the new changes and may even fork client implementations.
    - This is what happened in the case of the [the DAO Fork](https://eips.ethereum.org/EIPS/eip-779) which was a particularly contentious fork splitting the network into two competing blockchains: Ethereum and Ethereum Classic.
    - You can see an example of a forked client by looking at [the version of Geth](https://github.com/etclabscore/go-ethereum) that is maintained by the Ethereum Classic Labs.
> Want to learn more about Hard Forks? Here's [a great list of all Ethereum Hard Forks](https://ethereum.stackexchange.com/questions/13014/summary-and-history-of-the-ethereum-hard-forks/13015#13015) since its initial release.

#### Conclusion
- Just remember, Ethereum = A Computer!

---
### Proof of Stake
---
- On September 15th, 2022 Ethereum transitioned from Proof of Work to Proof of Stake (POS), also known as “The Merge”.
- This was a massive migration that was always in the roadmap and original planning for Ethereum, but required coordination from the entire network to execute.
- We learned about Proof of Work, the consensus mechanism used by Bitcoin and previously Ethereum in week 1.
- Proof of Stake is a totally different mechanism that enables Ethereum to be:
    - More secure 🔒
    - Less energy intensive 🌎
    - Greater scalability

#### How PoS works
- In order to become a miner in PoW, there are large energy requirements, which makes it difficult for any individual to compete with the existing mining warehouses that are dedicating millions of dollars of resources to mining.
- However, in Proof of Stake, the energy requirement to become a validator is much lower and can be done by individuals without a high overhead energy cost.
    - This encourages more users to become validators, decreasing the centralization risk, and thereby increasing the security of the network.
- Instead of using mass amounts of electricity, validators are required to stake 32ETH by depositing it into a contract to have the ability to validate blocks.
    - This staked ETH is used as collateral against bad actors in the network.
    - If any given validator acts dishonest or malicious they put themselves at risk of losing their staked ETH.
- Rather than all validators competing at the same time for the next block, the network randomly selects a validator to propose a block every 12 seconds, all the other validators verify that the proposed block is correct, and the cycle repeats.
    - This means that the energy requirements to mine any given block are significantly lower than that of PoW.
> There are a lot more really interesting mechanisms for PoS, but rather than discuss them here we’re going to move onto how this new system affects Ethereum developers (like yourself!). If you’re interested in learning more about PoS and the Merge check out the Additional Resources section below.

#### How PoS affects Ethereum Development
- One of the largest ways that PoS affects Ethereum developers is with a new framework for block **finality**.
    - Finality in blocks refers to how confident you are that the given block will not change or get forked away.
    - For blocks that have been on the network for a very long time (older blocks) it is extremely unlikely that it will be removed from the canonical chain and therefor has high finality.
- Proof of Stake introduced 2 new levels of finality that developers should consider when requesting data from the network: ``safe`` and ``finalized``. Here is an overview of all “block tags”:
    1. ``earliest``: The lowest numbered block the client has available.
        - Intuitively, you can think of this as the first block created.
    1. ``finalized``: The most recent crypto-economically secure block, that has been accepted by >2/3 of validators.
        - Typically finalized in two epochs (64 blocks).
        - Cannot be re-orged outside of manual intervention driven by community coordination. Intuitively, this block is very unlikely to be re-orged.
    1. ``safe``: The most recent crypto-economically secure block, typically safe in one epoch (32 blocks).
        - Cannot be re-orged outside of manual intervention driven by community coordination.
        - Intuitively, this block is “unlikely” to be re-orged.
    1. ``latest``: The most recent block in the canonical chain observed by the client, this block may be re-orged out of the canonical chain even under healthy/normal conditions.
        - Intuitively, this block is the most recent block observed by the client.
    1. ``pending``: A sample next block built by the client on top of latest and containing the set of transactions usually taken from local mempool.
        - Intuitively, you can think of these as blocks that have not been mined yet.
- To remember the differences between the block tags you can think of them in the order of oldest to newest block numbers: ``earliest`` ≤ ``finalized`` ≤ ``safe`` ≤ ``latest`` ≤ ``pending``
**Making requests**
- There are several methods that take in a ``block number`` or ``block tag`` as a parameter when requesting data on-chain. You’ll want to keep block finality in mind when requesting newer information. We’ll learn more about JSON-RPC requests later on this week.

#### Additional Resources
- [Proof of stake (POS)](https://ethereum.org/en/developers/docs/consensus-mechanisms/pos/)
- [The Merge](https://www.alchemy.com/the-merge)
- [The Ethereum Developer Guide to the Merge](https://docs.alchemy.com/reference/ethereum-developer-guide-to-the-merge)

---
### Gas on Ethereum
---
- In the previous article we talked about the cost of operation codes in terms of gas. In this article we’ll take a look at the actual price of gas and understand what determines it.

#### EIP-1559
- As many of you may know, the price of gas is something that changes with every block.
- Historically, gas prices on Etheruem have been unpredictable and at times, astronomically high making transactions inaccessible to most people.
- However, In August 2021, after years of research and planning there was an EIP proposed to improve the calculation of gas prices on Ethereum, known as EIP-1559.
    - Instead of covering the antiquated computation of gas prices from before EIP-1559, we’re just going to focus on how this works for the current state of Ethereum (post EIP-1559).
    - If you want to learn more about the specific dynamics of EIP-1559 from a developer perspective, check out this [resource hub](https://docs.alchemy.com/docs/eip-1559).
<table>
    <tr>
        <th>DENOMINATION</th>
        <th>VALUE IN ETHER</th>
        <th>COMMON USAGE</th>
    </tr>
    <tr>
        <td>Wei</td>
        <td>10^-18</td>
        <td>Technical implementations</td>
    </tr>
    <tr>
        <td>Gwei</td>
        <td>10^-9</td>
        <td>Human-readable gas fees</td>
    </tr>
</table>

#### Gas Prices
- The cost of operations on Ethereum are fixed and measured in amount of “gas”, however the price of that gas (measured in Gwei) is ever-changing.
- We are going to understand how these prices are set so that you can be more informed about transaction costs.
>  To view the latest gas prices you can check out [Etherscan’s Ethereum Gas Tracker](https://etherscan.io/gastracker) that gets updated in realtime.
- With EIP-1559 the mechanism for setting the gas price has shifted from the previous model.
- We’ll be discussing the current way gas prices are determined since the legacy mechanism has been deprecated.

#### Denominations of Ether
- Just like dollars, Ether has different denominations that are used to express smaller values, particularly when describing gas costs.
- For example, similar to how 1 dollar is equal to 100 pennies, 1 ether is equal to 10^18 Wei (the smallest denomination of Ether) or 10^9 Gwei.
Here is a table with the relevant denominations for ether and their common use cases:
![Wei](https://res.cloudinary.com/divzjiip8/image/upload/v1670883266/alchemyu/Screen_Shot_2022-12-12_at_2.12.01_PM.png)
- You’ll often see gas cost estimates listed in Gwei, however if gas were to become much more or much less expensive we may see that denomination change to a different value.
> Gwei vs. Gas Gwei is not the same value as “gas” that we discussed as fixed cost for operation codes in the Intro to Ethereum section.

#### How is the price of gas set?
- Every block has a maximum amount of gas that can be used within it.
- This is how the number of transactions included within a block are determined.
- Every block has the capacity to use 30 million gas but has a target of 15 million gas total.
- The price of gas is determined by the amount of demand for transactions (or block space), where demand is measured by how filled the previous block was relative to the target gas.
- So let’s look at an example here:
![Gas Price](https://res.cloudinary.com/divzjiip8/image/upload/v1670445934/alchemyu/block-usage-image.png)
- The above screenshot shows two different blocks, one where block space was in high demand, and another where it was in lower demand.
- The network first sets a base fee, in an ideal world this base fee would result in 15 million gas getting used in a block, no more, no less.
- However, what happens in practice is the actual gas can be above or below the target gas.
- When blocks are above the target, the gas price (or base fee) is automatically increased, increasing the cost and barrier to entry for sending transactions and thereby reducing the number of people who are competing to fill the block.
- When the block is below the target the base fee is lowered to incentivize people to transact by lowering the barrier to entry for paying for a transaction.
- This base fee helps users select an efficient gas amount that is likely to get their transaction mined rather than wasting tons of money on unnecessarily high gas prices like we’ve seen in the past.
- These mechanisms also make it easy to predict future gas prices by looking at how “full” the previous blocks were.
- We can actually see what this looks like in practice by visiting [etherscan](https://etherscan.io/). Let’s take a look at block [16128921](https://etherscan.io/block/16128921) for example:
![Etherscan](https://res.cloudinary.com/divzjiip8/image/upload/v1670446077/alchemyu/block-16128921.png)
- We can see here that we are 57% below the desired gas target (only using 6.4 million gas instead of 15 million) and our base fee per gas is 12.044621651 Gwei.
- What do we think will happen with the next block? Will the base fee increase or decrease?
- Here is a screenshot of block [16128922](https://etherscan.io/block/16128922)
![Etherscan](https://res.cloudinary.com/divzjiip8/image/upload/v1670446069/alchemyu/block-16128922.png)
- We can see that the base fee decreased to 11.18 Gwei and by doing so this incentivized more people to send transactions and the gas used skyrocketed up to almost 30 million, 100% above the gas target! Now what do we think will happen with block [16128923](https://etherscan.io/block/16128923)? See for yourself!

#### What happens to the base fee?
- Instead of going straight into the miners pocket, the ``base fee`` actually gets burned. There are several reasons why the base fee is burned instead of being given to the miner:
    1. This prevents the miner from circumventing the payment of the base fee since they have to pay at least ``base fee`` * # of transactions for the block that the mine
    2. Burning the Ether also creates a deflationary pressure on Ether as an asset since supply is being taken out of the market

#### Setting the gas for your transaction
- Turns out when you are sending a transaction, you’re not actually setting the ``base fee`` value, but rather your setting the ``max fee`` which represents the maximum amount that you're willing to pay to get your transaction included.
- Luckily, unlike with the previous gas usage model, your transaction will only ever use the ``base fee``** amount to execute, the rest of the value (``max fee`` - ``base fee``) will be return to you.
- As a dApp develop you can actually create your own algorithm to determine how much gas to include in your transactions using endpoints like ``[eth_feeHistory](https://docs.alchemy.com/reference/eth-feehistory)``. If you’re interested in learning how to build this, check out [How to Build a Gas Fee Estimator using EIP-1559](https://docs.alchemy.com/docs/how-to-build-a-gas-fee-estimator-using-eip-1559).

#### How are miners paid?
- Since the ``base fee`` is entirely burned, the new incentive for miners is now known as the miner ``tip``.
- In a perfect world, the miner tip is the minimum amount that the miner is willing to accept in order to execute your transaction.
- This tip was originally set as 1gwei but can fluctuate depending on how full blocks are.
- Since the target gas value in blocks is 15M, in general, so long as blocks are hitting or near the target amount, there will always be room to add more transactions within a block.
- This is why the miner tip does not need to be insanely high to get your transaction included.
- Typically when you set the gas for your transaction you’re setting a value called ``maxPriorityFee`` which is equal to the ``max fee`` + the miner ``tip``.

---
### Accounts in Ethereum
---
- There are two types of accounts in Ethereum: **externally owned accounts** and **contract accounts**.

#### Externally Owned Accounts
- Externally Owned Accounts (or **EOAs** for short!) are similar to Bitcoin private/public key pairs.
- In both models, the address and public key are associated to a private key via an Elliptic Curve Digital Signature.
- However, the method to get from a private key to an address in Ethereum is different than Bitcoin.
- The resulting address in Ethereum is a 40 character hexadecimal string as opposed to a 26-35 alphanumeric string in Bitcoin.
>  Another difference is that Bitcoin addresses end in a checksum to ensure the address is typed properly. Ethereum addresses don't have a checksum by default, although EIP-55 introduced a capitalization scheme that can be validated by wallet software.
- The biggest difference between EOAs and Bitcoin Addresses is that EOAs have a balance.
- This means that the global state of the blockchain actively tracks how much ether every active address on the network holds.
>  Minor clarification here: an **active** address refers to an address that has interacted on the Ethereum blockchain. There are technically 16^40 (or 2^160 if you're thinking in binary!) possible Ethereum addresses which can be generated. These addresses are not included in the global state tree until they have interacted with the blockchain. Otherwise, this would be a massive amount of data stored! Take a look at [EIP-161](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-161.md) which was implemented when flaws in the Ethereum system allowed an attacker to create **19 million accounts** at extremely low gas costs.

#### Accounts vs UTXOs
- To transfer value in Bitcoin we spend UTXOs.
- In Ethereum there are no UTXOs. Instead, at the end of a transaction transferring ether, the transferred amount is subtracted from the sender's address balance and added to recipient's address balance in the global state tree.
- Compared to UTXOs, an account balance is quite straightforward, especially from an application developer perspective.
- The EVM has an operation BALANCE that allows us to look up an addresses balance inside code running on the EVM.
- This is much simpler than adding all unspent transaction outputs that have a particular address as their recipient.
- Each Ethereum address also contains a nonce.
- The nonce keeps a count of all transactions sent from that particular address.
- To understand why this is necessary, let's consider an example.
- Let's say you have 2 ether in your account and you want to send 1 ether to Bob:
```javascript
{
  to: BOBS_ADDRESS,
  value: 100000000000000000 // 1 ether
}
```
- You'll be able to broadcast this transaction to the network once you sign it with your private key.
- At that point, with the current parameters specified, what's stopping Bob from re-transmitting this same transaction again to the network?
**NOTHING**
- To combat this, Ethereum tracks the number of transactions sent by an account, called the account nonce.
- Each time a transaction is sent, the nonce is incremented:
```javascript
{
  to: BOBS_ADDRESS,
  value: 100000000000000000, // 1 ether
  nonce: 0x0 // this is the first transaction, nonce is zero!
}
```
- If Bob tried to re-broadcast the transaction now, the network would reject it.
- Once the first transaction is successfully mined the miners enforce the rule that the nonce of your next transaction should be 0x1.
> You may be thinking: "What if Bob tried to increment the nonce himself?" But, of course, Bob would need you to sign the transaction after he incremented the nonce. The result of a digital signature does not leave room for the underlying data to be tampered with.
- The word "nonce" simply means it's **a number we're using once** for its particular purpose.
- It's a rather ambiguous term.
- Accounts in Ethereum have a nonce that keeps a count of transactions to be used once per transaction.
- Blocks in Proof of Work have a nonce that allow it to randomly search for a valid hash to be used once in the search for that block hash.
- To summarize, the difference between Ethereum EOAs and Bitcoin addresses is that active EOAs are stored with a balance and a nonce.
- Whereas in Bitcoin the client only keeps track of UTXOs which contain an owner address.
> For more reasons why Ethereum chose accounts instead of UTXOs, it's best to refer to the [Design Rationale](https://eth.wiki/en/fundamentals/design-rationale) document in the Ethereum wiki.

#### Contract Accounts
- Finally, we broach the most exciting part of Ethereum: **Smart Contracts**!
- The term **Smart Contract** sounds pretty intimidating at first glance. Don't worry about the name, it's simply **a program that runs in the blockchain execution environment**.
- As a developer, you would write a **Smart Contract** when you want to decentralize a program's execution.
- Smart Contracts are generally written in a high-level language like **Solidity** or **Vyper**.
- Once you've completed the code (and tested it thoroughly!) you can deploy the contract to the Ethereum blockchain.
- You can do so by running a transaction from your Externally Owned Account with the **bytecode** of the compiled smart contract.
- This contract has its own **account** in that it also has a **balance** and **address**.
- The contract account cannot be controlled by a private key like a EOA.
- Instead, EOAs make transactions to call functions on the contract.
- From there, contracts can also make calls to other contracts synchronously.
- Once a contract is deployed, the **code cannot be changed**. However, the **storage** (persistent memory) of a contract can be updated through transactions.
>  A contract can store an address of another contract that it needs to interact with. Since the address is held in **storage** it can be updated through transactions. Therefore it's possible to upgrade a system by deploying new contracts and running a transaction to update references to point to the new addresses. This can be a bit of a challenging subject and is generally referred to as smart contract **upgradeability**.

####  Wrap Up
- In this article we discussed both types of accounts on Ethereum: Externally Owned Accounts and Contract Accounts.
- We talked about some of the differences between an account-based model and a UTXO model.
- We also briefly touched on Smart Contracts from a high-level perspective, we'll dive into these concepts further when we start programming our own smart contracts!

---
### Supplemental Reading
---
#### Node Clients
- Node client software is a crucial aspect to accessing the blockchain.
- Having a diverse set of node clients helps reduce risk factors of just using one.
- For example, if 100% of all nodes were running Geth and Geth had a vulnerability or bug it would put the entire chain at a risk.
- However, if the other node clients like Eigon or Nethermind are still working as expected, we can rely on those clients to maintain the integrity of the network.
> If you’re interested in seeing a breakdown of how many nodes are running each client in the network check out https://ethernodes.org/
- Since we’re using Alchemy for our development we don’t need to worry about which node client to choose or maintaining multiple different clients to reduce risk.
- Luckily, Alchemy runs a variety of node clients under the hood so if one were to have an issue we can always fall back on other ones.
- This also allows us to be able to use one API key for different API endpoints that are only available on unique clients.
- For example, with our single Alchemy API key, we can make requests to both the Trace API (unique to Erigon) and the Debug API (unique to Geth) without having to run or enable those respective node clients individually.

#### The History of Ethereum
- Here is an overview of key events that occurred on the Ethereum chain since inception.
- If you’re interested in learning more about the History of Ethereum check out the Infinite Machine by Camilla Russo.
<table>
    <tr>
        <th>YEAR</th>
        <th>PHASE</th>
        <th>DETAILS</th>
    </tr>
    <tr>
        <td>2013</td>
        <td>Ideation</td>
        <td>Vitalik Buterin releases the Ethereum white paper, proposing a new platform which would allow for decentralized application to mark the start of a new era of online transactions.</td>
    </tr>
    <tr>
        <td>2014</td>
        <td>Initial Sale</td>
        <td>Ether officially goes on sale for the first time. The Yellow paper is released.</td>
    </tr>
    <tr>
        <td>2015</td>
        <td>Project Drops</td>
        <td>Ethereum mainnet launches. The Ethereum network goes live.</td>
    </tr>
    <tr>
        <td>2016</td>
        <td>Major Split</td>
        <td>Ethereum is split into two separate blockchains, Ethereum, and Ethereum Classic, as a result of a US$50 million worth of funds being hacked.</td>
    </tr>
    <tr>
        <td>2021</td>
        <td>EIP1559</td>
        <td>Ethereum changes how the system processes and calculates transaction fees and gas.</td>
    </tr>
    <tr>
        <td>2022</td>
        <td>The Merge</td>
        <td>Ethereum transitions from Proof of Work to Proof of Stake.</td>
    </tr>
</table>

#### Ether: Ultrasound Money
- As we learned in the Gas on Ethereum section, Ether is now burned after transactions are included in blocks.
- This has a unique property of making Ether a deflationary asset since supply is being removed from circulation.
- If you’re interested in learning more about Ether as “Ultrasound Money” check out https://ultrasound.money/ which gives you a breakdown of the amount of ether burned and amount of supply in circulation.

#### Use cases of Ethereum
- If you’re taking this course you’re probably well aware of all the potential use cases of Ethereum.
- Here are a few that are helpful for understanding, however, this list is pretty much infinite.
1. Ownership records
    1. permanent way to verify ownership of a house or other asset
2. Code
    1. ability to deploy code to a public database where all parties can verify the functionality of it before buying in
3. Other popular areas:
    1. Decentralized finance
    2. NFTs
    3. DAOs
    4. Further applications

#### Other Resources
- There are tons of awesome resources about Ethereum and the EVM on the internet. Here are a few places we recommend you check out to learn more:
    - [Ethereum Whitepaper](https://ethereum.org/whitepaper/)
    - [Ethereum Yellowpaper](https://ethereum.github.io/yellowpaper/paper.pdf)
    - [Ethereum Beigepaper](https://github.com/chronaeon/beigepaper)
    - [ethereum.org](https://ethereum.org/en/)
    - [Alchemy Overviews](https://www.alchemy.com/overviews)
    - [Alchemy Dapp Store](https://www.alchemy.com/dapps)
    - [Alchemy Developer Hub](https://docs.alchemy.com/)
    - [EVM opcodes](https://github.com/crytic/evm-opcodes)
    - [A pre-history of Ethereum, if you're interested in the initial design decisions](https://vitalik.ca/general/2017/09/14/prehistory.html)
    - [Patricia Trie Specification](https://ethereum.org/en/developers/docs/data-structures-and-encoding/patricia-merkle-trie/)
    - [Design rationale of Ethereum](https://ethereumbuilders.gitbooks.io/guide/content/en/design_rationale.html)
    - Andreas Antonopoulos' [Ethereum Book](https://github.com/ethereumbook/ethereumbook)