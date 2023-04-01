## Public Key Cryptography

---

#### Hashing Messages
- The first step in ECDSA is to hash the message before applying the signature algorithm.
- So if you wanted to sign a message with one your keypairs saying that you "Vote Yes on Proposal 327", the first step would be to hash this message:
    ```js
    // turn this into an array of bytes, the expected format for the hash algorithm
    const bytes = utf8ToBytes("Vote Yes on Proposal 327");
    // hash the message using keccak256
    const hash = keccak256(bytes); 

    console.log(toHex(hash)); // 928c3f25193b338b89d5646bebbfa2436c5daa1d189f9c565079dcae379a43be
    ```
    - After we have the message hash we can sign it with our private key to prove that a particular address votes yes on proposal 327. 

#### Signing the Hash
- It's time to sign a message using our private key to prove our intention!
- When signing a message with secp256k1 we can return the signature along with the [recovery bit](https://cryptobook.nakov.com/digital-signatures/ecdsa-sign-verify-messages#ecdsa-public-key-recovery-from-signature), allowing us to recover the public key from the signature. 
    - This will allow a blockchain node to take a signature of a transaction and understand which address authenticated this particular transaction.
- This is an important point, a blockchain transaction not only indicates the intent of the person who signed it, it also authenticates them through public key cryptography!

#### Recover the Public Key
- When the signature is passed with all of its components (recovery bit included), the public key can be recovered.
- This means that blockchain nodes will be able to understand who signed the transaction that was sent to them.
- A transaction could indicate the user would like to send 1 ether to another address and provide a certain transaction fee. Since the signature signs the hash containing this intention, it is enough to authenticate this action entirely.

#### Public Key to Address
- Bitcoin and Ethereum both have a transformation process to take a public key and turn it into an address.
    - For Bitcoin it includes a [checksum and Base58 encoding](https://en.bitcoin.it/wiki/Technical_background_of_version_1_Bitcoin_addresses)
    - Ethereum's address transformation is quite a bit simpler, its address is the last 20 bytes of the hash of the public key.
    - The important thing to recognize here is that the address is differentiated from the public key, but you can always derive the address if you have the public key.