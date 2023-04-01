
---

# Blockchain Cryptography

---

## The First Primitive

---

### Blockchain and Crypto
- The first core cryptographic primitive: the cryptographic hash function

#### Blockchains
1. What is the purpose of a blockchain?
    - The purpose of a blockchain is to have a network of computers agree upon a common state of data.
    - Generally the term consensus is used to describe a network coming to an agreement on the state of the data.
    - The most common use-case for blockchains: cryptocurrency

#### Why is blockchain needed for cryptocurrency?
1. Problem number 1: Trust
    - In, 2008, such a system was imagined. A person or persons, under the pseudonym Satoshi Nakamoto released a [whitepaper for Bitcoin](https://bitcoin.org/bitcoin.pdf). In this paper they described a system that would create a peer-to-peer network for exchanging value
    - Blockchain was invented to solve for trust. To create a system that is completely neutral and resistant to any censorship or bribe.

#### Smart Contract Blockchains
1. Smart Contract blockchains provide developers with a way to decentralize where the code runs.
    - This means code can run without any direct ownership, making it censorship resistant and transparently verifiable.
2. One important point to drill home is that the decentralization isn't about the code itself, but how the code is executed: 
    ```js
        // this data structure will keep track of which address has a balance
        mapping(address => uint) balances;

        function transfer(address to, uint amount) external {
        // subtract the amount from the sender's balance
        balances[msg.sender] -= amount;

        // add the amount to the recipient's balance
        balances[to] += amount;
        }
    ```
    -  This function is the bread and butter of ERC20 tokens, which we'll talk about later in the course. You'll see there's nothing special about the transfer function here from a programming standpoint. Coming from other languages this code may look quite familiar.
    - The key difference which makes this code a smart contract is when you take this code, compile it and deploy it to a decentralized blockchain.
    - When you do that, the code becomes publicly available on the blockchain and the nodes in the network will enforce the logic of the code through the financial incentives of the blockchain protocol.
    - A key takeaway here is that a smart contract is code that will always run the way it is programmed.

#### Cryptographic Hash Functions
1. A hash function is a function which takes an input of any size and turns it into a fixed size output.

    <table>
        <tr>
            <th>Input</th>
            <th>Input Size</th>
            <th>Output</th>
            <th>Output Size</th>
        </tr>
        <tr>
            <td>52</td>
            <td>8 bytes</td>
            <td>0x41cf...</td>
            <td>32 bytes</td>
        </tr>
            <tr>
            <td>'happy times'</td>
            <td>22 bytes</td>
            <td>0xd6bf...</td>
            <td>32 bytes</td>
        </tr>
        </tr>
            <tr>
            <td>monalisa.jpg</td>
            <td>875000 bytes</td>
            <td>0x7cde...</td>
            <td>32 bytes</td>
        </tr>
        </tr>
            <tr>
            <td>worldseries.mp4</td>
            <td>1.6e+10 bytes</td>
            <td>0x9c0e...</td>
            <td>32 bytes</td>
        </tr>
    </table>

    - These inputs get larger from top to bottom but they always map to an output of 32 bytes. There are many different [algorithms for hash functions](https://en.wikipedia.org/wiki/Hash_function#Hashing_integer_data_types) which could take these inputs and create outputs of fixed sizes.
2. Cryptographic hash functions need five specific properties:
    - **Deterministic** - One specific input always maps to the same specific output
    - **Pseudorandom** - It is not possible to guess the output based on the output of similar inputs
    - **One-way** - If someone gives you a new output, you could not determine an input without guessing
    - **Fast to Compute** - It must be a quick calculation for a computer
    - **Collision-resistant** - The chance of a collision should be infinitesimally small
3. With a secure cryptographic hash function you can create a unique, fixed-size representation of an input regardless of its size.
    - For blockchains this feature is critically important for saving space. In many cases blockchains and smart contracts will not need to store an input, they can just store the hash output.

---

## Digital Signatures

---

### Public Key Cryptography
#### Cryptography Historically
- Historically, up until the 1970s, cryptography was the study of encrypting messages so that they could not be decrypted even if intercepted. Cryptography was used for passing important secrets, especially within the military.
- The sender would take their message and pass it through a function to create an encrypted output. This could be something as simple as moving each character in a string down one position in the alphabet.
- As cryptography advanced over the years, more complex functions were introduced to hide messages better. One important leap forward was the idea of a secret key.
    - If two parties can meet prior to their exchange of messages they both can come to an agreement upon a particular key. This key plus a function (like the alphabet shift mentioned above) could be used together to create a more secure encryption.
    - Having keys on both sides of the message is considered symmetric-key cryptography.

#### Personal Computing
-  State of the art cryptography had been increasingly complex versions of symmetric-key cryptography. The objective of the game was to never let your adversary have your key.
-  How could two parties communicate securely without having met beforehand to exchange keys?
    - In 1976 [Whitfield Diffie](https://en.wikipedia.org/wiki/Whitfield_Diffie) proposed an idea. What if there was a **public key**?
        -  There is a private key that can decrypt a message from a public key and vice-versa. Each key is the only key that can decrypt a message encrypted by the other key
        - Private key that corresponds to his public key.
        - Private key decrypts a message which can be shared publicly and decrypted with public key.
        - If a message is encrypted with a public key, only the private key can decrypt it.
-  Public key cryptography is considered asymetric encryption involving only one party having a private key.

#### RSA and ECDSA
- The [RSA](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) algorithm is based on the idea that it's very easy to find the product of two prime numbers, yet extremely difficult to factor out those two prime numbers if you have the product.
- The [ECDSA](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) algorithm uses elliptic curves. It can provide the same level security as other public key algorithms with smaller key sizes, which is the reason it's become quite popular. It is the Digital Signing Algorithm used by Bitcoin, specifically the [secp256k1](https://en.bitcoin.it/wiki/Secp256k1) curve.

---

### Supplemental Resources on Digital Signatures

---

#### ECDSA
- Cloudflare provides a [great article](https://blog.cloudflare.com/ecdsa-the-digital-signature-algorithm-of-a-better-internet/) on how ECDSA is used on the web. If you've ever thought about how HTTPS works, this is your chance to dig in further!
- Of course, [wikipedia](https://en.wikipedia.org/wiki/Elliptic_Curve_Digital_Signature_Algorithm) has a write-up on ECDSA. Naturally, it's very heavy math, however there are some interesting tidbits in here to pick up even if your math isn't super strong!
- This [resource](https://cryptobook.nakov.com/digital-signatures/ecdsa-sign-verify-messages) is similar to the wikipedia article above, except it does a much better job of explaining ECDSA mathematics in simpler language.

#### Bitcoin
- Bitcoin uses [secp256k1](https://en.bitcoin.it/wiki/Secp256k1). The parameters for this curve are thought to be the least random, they are predictably selected, so there is supposedly less likelihood of a backdoor hidden in this algorithm.
- In our Exchange project, we'll need a way to go from a public key to an address, so it is useful to understand how [Bitcoin derives addresses](https://en.bitcoin.it/wiki/Address). The diagram at the bottom of this article shows the derivation of the address starting all the way from the private key.
- This is further technical detail of the [address derivation](https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses#:~:text=A%20Bitcoin%20address%20is%20a,that%20the%20signature%20is%20valid.). It also explains the Checksum written into Bitcoin
    -  Bitcoin chose Base 58 for it's addresses because this format removes commonly mistaken characters like zero "0" and upper-case o "O".

#### Diffie-Hellman Key Exchange
- We didn't talk much about the [Diffie-Hellman exchange](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) which is critical to the [TLS handshake for HTTPS](https://security.stackexchange.com/a/41226).
    - The Diffie-Hellman key exchange is utilized in a hybrid cryptosystem since it uses asymmetric cryptography for the handshake and then symmetric cryptography for the message passing.
- To understand more about this key exchange, check out this [colorful explanation](https://www.youtube.com/watch?v=NmM9HA2MQGI) as well as this [more mathematical one](https://www.youtube.com/watch?v=Yjrfm_oRO0w). And another good follow up is this video on [Elliptic Curves](https://www.youtube.com/watch?v=NF1pwjL9-DE).

#### RSA
- Just like with ECDSA, wikipedia gives a [good overview](https://en.wikipedia.org/wiki/RSA_(cryptosystem)) and the cryptobook gives a [good explanation in plain English](https://cryptobook.nakov.com/digital-signatures/rsa-signatures).
- There are two great videos on RSA mathematics given by Eddie Woo on YouTube: [part 1](https://www.youtube.com/watch?v=4zahvcJ9glg) and [part 2](https://www.youtube.com/watch?v=oOcTVTpUsPQ).
    - There is supposedly evidence of a [RSA Backdoor](https://www.reuters.com/article/us-usa-security-nsa-rsa/exclusive-nsa-infiltrated-rsa-security-more-deeply-than-thought-study-idUSBREA2U0TY20140331) planted at some point in time.

---

## Proof of Work

---

#### Proof of Work and Mining
- Blockchain networks, like Ethereum, are essentially distributed and decentralized databases consisting of many nodes (fancy name for computers!).
- In a decentralized environment, common issues are:
    - How do all nodes agree on what the current and future state of user account balances and contract interactions is?
    - Who gets to add new blocks/transactions to a chain? How do we know any blocks added are "valid"?
    - How the heck are all of these things coordinated without any central actor in place?

#### Consensus Mechanisms
- Consensus means coming to a general agreement. Blockchain consensus typically means at least 51% of nodes are in agreement over the current global state of the network.
- Consensus mechanisms end up simply being rules that a distributed + decentralized blockchain network follows in order to stay in agreement over what is considered valid.
- Remember that consensus mechanisms are inter-changeable and there are many out there that we have yet to cover, like proof-of-stake.
- The main consensus rules for proof-of-work typically look like religious commandments
    - You cannot double spend.
    - The "longest" chain will be the one the rest of the nodes accept as the one "true" chain, determined by a chain's cumulative work. Also known as Nakamoto Consensus.
- Bitcoin being a blockchain network, use a consensus mechanism called proof-of-work.
- Ethereum was previously using proof of work but has since moved to proof-of-stake.

#### Proof of Work
- Proof-of-work is the consensus mechanism that allows decentralized networks like Bitcoin and (previously) Ethereum to come to consensus, or agree on things like account balances and the order of transactions.
- This prevents users from "double spending" their coins and ensures that everyone is following the rules, making proof-of-work-based networks resistant to attack.
- The consensus mechanism ends up providing security to a blockchain network just because it demands that everyone follow the consensus rules if they want to participate!
- In proof-of-work, mining is the "work" itself.

#### Mining
- Mining is process of creating a block of transactions to be added to a blockchain.
- But how does that tie in to proof-of-work? Well, proof-of-work could just as well be called proof-of-mining
    - "Mining" can be considered an industry misnomer. The term gained popularity as it has a close tie in to "miners" digging
- In proof-of-work consensus, nodes in the network continuously attempt to extend the chain with new blocks - these are the miners, nodes that contain mining software.
    - Miners are in charge of extending a blockchain by adding blocks that contain "valid" transactions.
    - In order to add a block, the network will ask miners for their 'proof-of-work'.
- A proof-of-work-based system will typically require miners produce an output in a very difficult-to-get target range.
- A valid proof-of-work would currently look like this in the Bitcoin network:
    - 000000000000000000043f43161dc56a08ffd0727df1516c987f7b187f5194c6
- How the heck does a miner get an output like this right!? Well, the automated mining software has one job: take a piece of data (ie. the prev block header + new transactions to add to a chain) and [hash](https://emn178.github.io/online-tools/sha256.html) it. If the hash output is below a target difficulty, then the miner has found the answer to the puzzle: a valid proof of work.
- The proof of work shown above has 19 leading zeroes. Since the range of each possible character per space is in hexadecimal, this means we have 1/16 character possibilities per space.
- The hash outputs for SHA-256 are in hexadecimal which means we have 1/16 possible characters per space - a-f in letters and 0-9 in decimals = 16 total possibilities
- The thing is, once we start adding more difficulty, things start to get more difficult. Finding an output with 2 leading zeroes increases the average attempts to 256 - 16 possible characters in the first spot * 16 possible characters in the second spot. Finding 19 leading zeroes will take, on average, 75557863725914323419136000000000000000000000 attempts.
- Proof-of-work networks will typically have some sort of target_difficulty. In order for a miner to add a new block, they must find a proof-of-work lower than the network target difficulty. The way the math works, finding such a diffcult-to-find output is proof enough that a miner expended considerable resources to secure the network. There is no way to cheat the system, you either have a valid proof of work or you don't.
- Here's what the proof-of-work mining algorithm looks like:
    1. Take current block’s block header, add mempool transactions
    2. Append a nonce, starting at nonce = 0
    3. Hash data from #1 and #2
    4. Check hash versus target difficulty (provided by protocol)
    5. If hash < target, puzzle is solved! Get rewarded.
    6. Else, restart process from step #2, but increment nonce
- The miner nodes in a proof-of-work network will perform this algorithm regularly.
    - This gives the network a way to recognize the true state and validity of proposed transactions via following of the consensus rules.
    - As long as a majority of nodes on the network follow the consensus rules
- Why do miners expend resources to secure a proof-of-work blockchain network like Ethereum or Bitcoin?
    - In exchange for the large amounts of energy and hardware upkeep required to run mining software, miners receive currency as a reward.
    - If the consensus rules are followed, making a secure network, miners get paid.

#### Conclusion
- In proof-of-work, miners must present a proof (in the form of a hash output on valid input data) that they expended energy in order to successfully "mine" a block and have it extend a blockchain.

---

### Hashing and Proof of Work

---

- Proof of Work is another component of Bitcoin that is essential to its success.
- The term "Proof of Work" is used to describe the solution to a computationally expensive challenge for computers. For instance, we could program a computer to search for a hash starting with three 5's. That might take some time guessing:
    ```js
    sha256("0"); // 5feceb…
    sha256("1"); // 6b86b2…
    sha256("2"); // d4735e…
    // keep on guessing, keep on guessing…
    sha256("5118"); // 555850…
    ```
    - The difficulty to come up with these inputs gets exponentially harder the more 5s we require the output hash to start with. This is how it's possible to control difficulty of Proof-Of-Work.
    -  Technically Bitcoin controls this on a finer level by specifying a target hash that the new block must be equal or lower to.

#### Why would you use Proof of Work?
- One of the first use cases of Proof of Work was to prevent spamming. The idea is you can make each action a little bit difficult.
- If I wanted to send my Grandma a message "Hi Grandma!", I'd need to find a hash with my grandmas email address and the contents of the email plus some value to satisfy the hash:
    ```js
    sha256("Hi Grandma! coolgrandma555@hotmail.com 0"); // f2d9e2…
    sha256("Hi Grandma! coolgrandma555@hotmail.com 1"); // 4ee36e…
    sha256("Hi Grandma! coolgrandma555@hotmail.com 2"); // c25e5c…
    // keep on guessing, keep on guessing…
    sha256("Hi Grandma! coolgrandma555@hotmail.com 424"); // 5552ab…
    ```
    - We can manage the difficulty by changing the number of 5s to make it take a minute on my machine.
    -  The number that we're appending on the end of the message here is generally referred to as a **nonce**. We'll see how both Ethereum and Bitcoin make use of nonces in a few ways!

#### How does Bitcoin use Proof of Work?
- You can think of Proof of Work as the security of the Bitcoin system.
    - Thousands of nodes are working to find hashes of data in the Bitcoin network at any given time.
    - These machines are financially incentivized through rewards when they find the hash.
        - This process is known as **mining**.
    - In order to overpower this network and force your own version of the truth, you would need to come up with more computing power than all the nodes in the entire system.
        - This is referred to as a **51% attack** because you need to have 51% of the total hashing power in the network.

---

## Supplemental Resources on Proof of Work

---

#### History
- [Adam Beck](https://en.wikipedia.org/wiki/Adam_Back) created the concept of [HashCash](https://en.bitcoin.it/wiki/Hashcash) as a way to combat email spamming.
- [Hal Finney](https://en.wikipedia.org/wiki/Hal_Finney_(computer_scientist)) invented [Reusable Proofs of Work](https://nakamotoinstitute.org/finney/rpow/index.html) using the HashCash concept
- [Wei Dai](https://en.wikipedia.org/wiki/Wei_Dai) invented [B-Money](https://en.bitcoin.it/wiki/B-money) also using the HashCash concept.

#### Bitcoin Mining
- Bitcoin uses Mining & Proof of Work to create a decentralized clearing house.
- Transactions are added to each mined block.
- Blocks are, on average, mined every 10 minutes.
    - This, of course, varies due to the randomness of finding a valid hash.
- The Target is adjusted so that, as more machines enter the network and the hash power increases, the difficulty of finding a new block increases (and vice-versa).
    - This allows bitcoin to scale to its network size.

#### Mining Pools
- There are many different types of Mining Pools in Bitcoin.
- As a user who wants to mine Bitcoin, you may join a mining pool so you get plenty of consistent, small rewards rather than one random large prize by finding the block (which, depending on your hash power, may not happen for a long time!).
- For a good comparison of the mining pools [see this document](https://en.bitcoin.it/wiki/Comparison_of_mining_pools).

---

## Blockchain Network

---

### Blockchain Structure
- Blockchains are just fancy databases. Databases have designs based on the data they store.

#### Blockchain Architecture
- A blockchain is a distributed database of a list of validated blocks.
- Each block contains data in the form of transactions and each block is cryptographically tied to its predecessor, producing a "chain".
    ![Blockchain Architecture](https://miro.medium.com/max/1400/1*fIEWQ_6IttN39MMPHg-_lg.jpeg)
    - A blockchain's data structure is ressembled by the right-most example
- Blockchains are not just decentralized but also distributed databases. Those little circles are meant to be "nodes".
- In computer science, the term node simply means a unit or member of a data structure.
    - For practicality, a node can just be thought of as a computer.
    - So data structures have nodes, or computers, that you use to update data with.
- A blockchain has nodes scattered all over the world all acting together in real-time.
    - There is no central administrator, say a "supernode", responsible for verifying any changes to the state of data, all nodes are equal members of the network.
    - This means that the network will perform the same, no matter what node you interact with to update data.
        - In other words, blockchains are peer-to-peer networks.
![Peer to Peer](https://teachcomputerscience.com/wp-content/uploads/2020/11/Peer-to-Peer-Network-1.png)
- In the image above, the server-based network contains one central server solely responsible for keeping the state of data.
- In the peer-to-peer network, there is not even a central server - everyone maintains a copy of the state of data.
**How do distributed p2p networks agree on what data is valid without a central administrator running the show? **
    - Consensus mechanisms! The Bitcoin network decides validity of new data based on who is able to produce a valid proof-of-work.
>This is a famous computer science problem called the "[Byzantine General's Problem](https://www.mail-archive.com/cryptography@metzdowd.com/msg09997.html)".

#### Blockchain Demo
- Go to this link: [https://blockchaindemo.io/](https://blockchaindemo.io/). Feel free to go through this excellent demo by yourself, we will also break down a lot of the same info below!
1. Starting on step 3 of the demo, the demo starts by defining a **blockchain**.
> A blockchain has a list of blocks. It starts with a single block, called the genesis block.
- The **genesis block** is simply the first block in a blockchain. The block should have an index of 0 - this is computer science, everything is 0-indexed
2. Step 4-13 explains the information that each block stores:
    ![Blockchain Storage](https://i.imgur.com/ZB2fEKD.png)
- **index**: the position of the block in the blockchain.
- **timestamp**: a record of when the block was created. This is typically a UNIX timestamp, *aka: the number of seconds since January 1st, 1970.* This data is important since it establishes a blockchain as a chronological time-based structure.
- **hash**: this is commonly referred to as the block hash or block header. As opposed to what the demo says, this piece of data is NOT stored in the block but is actually a digital fingerprint representing the block's contents.
**How is the block hash calculated?**
- A hashing function takes data as input, and returns a unique hash.
> f ( data ) = hash
- Since the hash is a "digital fingerprint" of the entire block, the data is the combination of index, timestamp, previous hash, block data, and nonce.
> f ( index + previous hash + timestamp + data + nonce ) = hash
- Replace the values for the demo's genesis block, we get:
> f ( 0 + "0" + 1508270000000 + "Welcome to Blockchain Demo 2.0!" + 604 ) = 000dc75a315c77a1f9c98fb6247d03dd18ac52632d7dc6a9920261d8109b37cf
- **previous hash**: the hash of the previous block.
- **data**: each block can store data against it.
> In cryptocurrencies such as Bitcoin, the data would include money transactions.
- **nonce**: the nonce is the number used to find a valid hash.
> To find a valid hash, we need to find a nonce value that will produce a valid hash when used with the rest of the information from that block.
**What is a "valid" hash?**
- A valid hash for a blockchain is a hash that meets certain requirements.
- The number of leading zeros required is the **difficulty**.
- The process of finding valid hash outputs, via changing the **nonce** value, is called **mining**.
- A miner starts a "**candidate block**" with a nonce of 0 and incrementing it by 1 until we find a valid hash:
        ![Nonce](https://blockchaindemo.io/static/media/nonce.a6291d01.gif)

#### Data Integrity in a Blockchain Data Structure
- If a blockchain is just a distributed database, how does the data it stores maintain **data integrity**?
    - In other words, how do we make sure the state of the data is never corrupted in any way (ie, data lost, data maliciously manipulated, etc)?
- Blockchains like Bitcoin and Ethereum, protect the integrity of any data held inside blocks in their chains; manipulating data in a block that has been nested deeply in the chain is a fool's errand.
    - In Bitcoin's genesis block, Satoshi sent Hal Finney 10 BTC.
    - Manipulating this value from 10 BTC to 20 BTC (Maybe Hal wants some more BTC!) would require IMMENSE computational power.
        - It's a number so large that humans are not able to grasp how big it is.
**Why is so much computational power required to manipulate data in early blockchain blocks?**
1. The Bitcoin genesis block hash is ```000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f```
2. Mallory (crypto term for malicious actor!) manipulates a piece of data, producing a brand new hash for the same block: ```eb3e5df5eefceb8950e4a444507ce7df1cc534f54a5113f2792ab64830392db0```
3. Hash the genesis block data until a "valid hash" is found
4. Once a valid hash is found on the manipulated block, Mallory must repeat the hashing process for EVERY block thereafter in order to successfully "attack" the chain.
> This would take Mallory trillions and trillions of years of constant computation via hashing. All while the rest of the miner network continues to hash
5. Attack unsuccessful! The blockchain data integrity remains intact.

#### Adding a New Block
- When adding a new block to the blockchain, the new block needs to meet these requirements:
    1. Block index is one greater than latest block index.
    2. Block previous hash equal to latest block hash.
    3. Block hash meets difficulty requirement.
    4. Block hash is correctly calculated.

#### Peer-to-Peer Network / Conclusion
**Who performs validation of new blocks?**
- Well, pretty much every participant in the peer-to-peer network performs validation for every single new block proposed-then-added to the chain.
- If our blockchain consists of 10 nodes, then we have a peer-to-peer network consisting of 10 nodes all interconnected to each other.
    - When one node, or peer, proposes a new block, every other peer will verify it to make sure it meets the consensus requirements.
    - If it does, the peer adds the block to their own ledger and will see that version as the one "true" chain.

---

## Further Reading on the Bitcoin Network

---

#### 51% Attack
- A 51% attack refers to a point in time where a group of miners have control of more than 50% of the network and wish to act maliciously.
- Every block is built upon the hash of the block before it.
- To change a block that has been confirmed many times, let's say the block has been confirmed 6 times for example, the attacking blockchain would need to mine 8 new blocks before the existing blockchain mines 1 to be accepted as the Main Chain.
- This would require more than just 51% of the resources!
> Of course, the attacking blockchain could also just stubbornly stick to its chain for a longer period of time. The more time they do this, the more expensive the attack becomes. If they had these kind of resources, they could make significant money just playing along honestly!
-  One thing that an attack could do is double-spend a transaction, by choosing to override it within the new blocks.
- So if someone sent you a large payment, they could attack the network and essentially override that payment.
    - Of course, this attack would cost a lot of money, so it's very unlikely this would be cost-effective.
> Double-Spends can occur during a blockchain fork, as shown by the bug caused by the Berkeley DB when the bitcoin network was partially between versions. See [BIP_0050](https://en.bitcoin.it/wiki/BIP_0050).

#### Genesis Block and the Blockchain Explorer
- It's a good time to check out the [Genesis Block](https://blockchain.info/block/000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f) of Bitcoin.
- The number of confirmations is the number of blocks since the genesis block. Since the genesis block is the first block, this is also the block height of the blockchain!
- The nonce of the genesis block, it's 2,083,236,893. If you take a look at a more recent block, 632900 for example, you'll see that the nonce is actually much lower.
- It turns out that the block nonce is actually a 32-bit field, and 2 ** 32 is 4,294,967,296, so that is the max size of a nonce. What happens when the miner reaches this point? They can change anything else in the block header to also increase the randomness. Other properties include:
    - **Software Version** - Tracks Bitcoin software upgrades
    - **Previous Block Hash** - Hash of the block before this one
    - **Merkle Root** - We haven't gone over this yet, its a hash that represent all the transactions!
    - **Timestamp** - Approximate time (less than two hours in the future according to consensus rules)
    - **Target** - Difficulty Target that dictates how small the Proof Of Work must be