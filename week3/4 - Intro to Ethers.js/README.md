### Let's Make Wallets
- First task is simple: create two wallets!
- We're going to look at two different ways to instantiate a wallet: from a private key and from a mnemonic phrase.

#### Wallet
- Ethers.js has a class Wallet which manages a private/public key pair and provides a number of useful functions for signing and sending transactions. 
- There are several ways to [instantiate a wallet](https://docs.ethers.io/v5/api/signer/#Wallet-constructor) on Ethers! 
    - You could create one randomly, create one from an encrypted JSON Wallet, from a private key or from a mnemonic. 
    - For this tutorial we focus specifically on those last two options.

#### Private Key
- A private key on Ethereum is a 256-bit value that is used to authenticate us to the rest of the network. 
    - When you want to create an account on Ethereum all you need to do is generate a private key. 
- Once you've done this **do not share this private key with anyone else**! 
    - Sharing your private key will compromise your account security and can very easily lead to stolen funds!
- You can plug your private key into a one-way mathematical function which will give you a public key. 
    - The public key is hashed and the last 20 characters are used as the address. 
    - The address is then stored in the ethereum account state, along with the balance and account nonce.
>You may be wondering: "Could someone else generate a private key for my address?" - as long as you use a **good source of randomness** in generating your address, the odds are astronomically low for a **collision** (when distinct hash inputs produce identical output). An address in Ethereum is 160 bits so ``2^160`` would represent the total number of distinct addresses. This is such a large number that it is inconceivable for even the worlds largest supercomputer to **brute-force** (guess repeatedly for) a collision, even if that's all it was trying to do all day, every day for years.
- If you are curious about the underlying mathematics of all of this, click on the following links to learn more about: [Public-key cryptography](https://en.wikipedia.org/wiki/Public-key_cryptography) and [Elliptic-curve cryptography](https://en.wikipedia.org/wiki/Elliptic-curve_cryptography).

#### Mnemonic 
- A mnemonic phrase, sometimes referred to as a 'seed phrase', is a human-readable string of words that represents your private key. 
    - [Here is an example of what one might look like](https://en.bitcoin.it/wiki/File:Mnemonic-seed-still-life.jpg). 
    - This makes it easier for us to write down our private key claim should it be needed at a later time. 
    - An illegible letter or accidental misspelling is unlikely to break the mnemonic because the word is stored in a [wordlist](https://github.com/bitcoin/bips/blob/master/bip-0039/english.txt) - these words are intentionally common spellings so as to mitigate any risk of wrong input. 
    - This is in contrast to having to write down a 64 character hexadecimal string where even one misplaced letter could have devastating consequences. 
> Even though the mnemonic phrase is human-friendly, you should treat it **with the same caution as you treat your private key**! Anyone who has access to your mnemonic phrase will be able to generate the private key to your address. In fact, mnemonics are often used to secure many private keys, so they may be even more critical to the security of your assets!
- There are two Bitcoin Improvement Protocols that govern the mnemonics: [BIP-039](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki) and [BIP-044](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki). 
    - BIP-039 discusses how the words for the mnemonic phrase should be chosen. 
    - BIP-044 discusses a standard "path" to allow a mnemonic phrase to handle **many addresses** across **multiple chains**.
    - Thus, a private key may give you access to a single address, but a mnemonic phrase may give you access to many!

### Sign a Transaction
- When a transaction is broadcasted to Ethereum, how do we know who it's from?
- And how can we say for sure that **they authorized it**?
- In the last stage, we created a wallet using a private key.
- Now we're going to use that wallet to sign a transaction!

#### Signing Transactions
- As you might imagine, signing transactions is essentially a way to authenticate yourself to the network.
    - You are "signing" a message and your signature can be traced back to you. Just like a paper signature!
- After signing the transaction with the private key in this stage, your encoded transaction should look like this:
```
0xf86b80843b9aca0082520894dd0dc6fb59e100ee4fa9900c2088053bbe14de92880de0b6b3a7640000801ba0f503c1f50c6d97c0b34dd39b87c59d32934a1f0422ffe5d430730ea27a323e9ba02711bd4be63bfd78a74d5a5fd77aaa6d66a8b0415cb60326f21e2821232dd7a4
```
- This is a raw encoded transaction.
    - It is actually the resulting signed transaction we got when we ran our solution on this stage!
- We can learn quite a bit about a transaction just from its raw encoding.
- Let's take a look at each piece of the raw transaction from the start:
    - **``0x``** - Prefix representing the rest of the message is in hexadecimal
     - **``f86b``** -[ RLP Encoding](https://github.com/ethereum/wiki/wiki/RLP) indicating a list of 107 (0x6b) bytes is coming up next
    - **``80``** - This is the nonce value (0) encoded in RLP
    - **``84``** - RLP Encoding telling us a string of length 4 is coming next
    - **``3b9aca00``** - The **``gasPrice``** that the sender is willing to pay, 1000000000 Wei or 1 Gwei.
    - **``82``** - RLP Encoding telling us a string of length 2 is coming next
    - **``5208``** - The **``gasLimit``** of the transaction which is the max amount willing to be paid, 21000 Wei.
    - **``94``** - RLP Encoding telling us a string of length 20 is coming next
    - **``dd0dc6…14de92``** - The **``to``** address, which is a string of 20 hexadecimal characters
    - **``88``** - RLP Encoding telling us a string of length 8 is coming next
    - **``0de0b6b3a7640000``** - The amount in Wei being sent over this transaction (1000000000000000000 in decimal)
    - **``80``** - Indicates that no data is being sent on this transaction. This is a value transfer, not a contract call. A contract call would use this field to invoke methods on the contract with parameters.
    - **``1b``** - This indicates whether the public key is on the positive side of the y-axis or negative, often referred to as the ``v`` value of the signature. This value makes signature recovery easier since the [secp256k1 elliptic curve](https://en.bitcoin.it/wiki/Secp256k1) is symmetrical over the y-axis. Ever since [EIP-155](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md) was introduced in the Spurious Dragon Hard Fork, this value can also indicate the chain.
    - **``a0``** - RLP Encoding telling us a string of length 32 is coming next
    - **``f503c1f…a323e9b``** - One of the coordinates of the digital signature known as ``r``.
    - **``a0``** - RLP Encoding telling us a string of length 32 is coming next
    - **``2711bd…32dd7a4``** - The other coordinate of the digital signature known as ``s``.
    -  Just from examining the raw encoding we can tell that this is a transaction sending 1 Ether (1000000000000000000 Wei) to the address **``0xdd0dc6fb59e100ee4fa9900c2088053bbe14de92``**. We know how much gas the sender is willing to spend and we can recover their public key and address using the component parts of their digital signature ``v``, ``r`` and ``s``. This is how an Ethereum client sees and understands a transaction.
    > When we use **``wallet.sign``** in the ethers.js library, it will create a digital signature from the private key we provided and append ``v``, ``r`` and ``s`` to the raw transaction shown above.

#### Ethers Parsing Methods
- When working with ether, the default denomination is typically Wei.
- Unfortunately for our purposes, this value is generally very small in comparison with the values we are working with!
- For example, 1 Ether is equal to 1,000,000,000,000,000,000 Wei.
- Fortunately the ethers.js library provides us with plenty of [utilities for parsing](https://docs.ethers.io/v5/api/utils/display-logic/) different values of ether!
- Let's take a look at ``utils.parseUnits``:
```javascript
const { utils } = require('ethers');

const oneEther = utils.parseUnits('1', 'ether');
const oneBillionGwei = utils.parseUnits('1000000000', 'gwei');

console.log(oneEther.eq(oneBillionGwei)); // true

const oneGwei = utils.parseUnits('1', 'gwei');
const oneBillionWei = utils.parseUnits('1000000000', 'wei');

console.log(oneGwei.eq(oneBillionWei)); // true
```
- In these examples we're using the ``eq`` method to show that ``oneEther`` **is equal to** ``oneBillionGwei``.
- This method is available on the [Ethers.js BigNumber](https://docs.ethers.io/v5/api/utils/bignumber/) object.
- The ``parseUnits`` method will return a ``BigNumber``, which is why we can use this method in these examples.
- We can find all the names of units that ``utils.parseUnits`` accepts [here](https://github.com/ethers-io/ethers.js/blob/v4.0.23/src.ts/utils/units.ts#L13-L21). Here's a table of the units for reference:

<table>
    <thead>
        <tr>
            <th>NAME</th>
            <th>VALUE</th>
            <th>TOTAL WEI</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>wei</td>
            <td>1 wei</td>
            <td>1</td>
        </tr>
         <tr>
            <td>kwei</td>
            <td>1e3 wei</td>
            <td>1000</td>
        </tr>
         <tr>
            <td>Mwei</td>
            <td>1e6 wei</td>
            <td>1,000,000</td>
        </tr>
         <tr>
            <td>Gwei</td>
            <td>1e9 wei</td>
            <td>1,000,000,000</td>
        </tr>
         <tr>
            <td>szabo</td>
            <td>1e12 wei</td>
            <td>1,000,000,000,000</td>
        </tr>
         <tr>
            <td>finney</td>
            <td>1e15 wei</td>
            <td>1,000,000,000,000,000</td>
        </tr>
         <tr>
            <td>ether</td>
            <td>1e18 wei</td>
            <td>1,000,000,000,000,000,0000</td>
        </tr>
    </tbody>
</table>

- There is also the **``parseEther``** method which works as a shortcut for **``parseUnits(value, 'ethers')``**:
```javascript
const { utils } = require('ethers');

// two ways to do the same thing!
const oneEtherA = utils.parseUnits('1', 'ether');
const oneEtherB = utils.parseEther('1');

// show the output with some commas :)
console.log(utils.commify( oneEtherA )); // 1,000,000,000,000,000,000
console.log(utils.commify( oneEtherB )); // 1,000,000,000,000,000,000
```

### Connect to Ethereum
- In the previous stages, we created a wallet and used that wallet to sign a transaction.
- Has the transaction been processed on Ethereum? … No?
- Oh! **We need to broadcast the transaction to the network**!
- It's time to connect to Ethereum! For this, we'll use an ethers.js provider.
- In our case we'll be connecting to a local ganache instance for testing purposes.
- If you wanted to connect to the mainnet, you could simply configure the provider to point at our [Alchemy API key](https://alchemy.com/?a=eth-bootcamp).

#### Provider
- Many Ethereum libraries use the term **provider** for an object that acts as a connection to the Ethereum blockchain.
    - In Ethers.js, a provider helps us reduce the code we write.
    - Once you configure the provider you can interact with its methods without worrying about the underlying details.
- This is commonly referred to as an **abstraction** in programming.
- The connection details are **abstracted away from the programmer**.
- Instead we can focus on what we want to do!
    - For instance, we can write code to ask the provider for the latest block number in the Ethereum blockchain.
    - We don't need to worry whether it's getting that block number from infura, etherscan, a local testnet or a remote mainnet node!
- Once it's configured, the provider can get us information about an [account](https://docs.ethers.io/v5/api/providers/provider/#Provider--account-methods) (i.e. the balance), the [blockchain](https://docs.ethers.io/v5/api/providers/provider/#Provider--block-methods) (i.e. the latest block) and more!
    - With the ethers.js provider, we can connect to a JSON-RPC endpoint and no longer concern ourselves with the specific syntax and implementation details of the method calls happening underneath the hood.

### Account Nonce
- Time to expand on the code from the last stage.
- We made a ``sendEther`` function that will broadcast a transaction to the Ethereum network through our provider.
- Unfortunately this code doesn't work if we try to run multiple transactions.
- The test cases on this stage attempt to send multiple transactions.
- You'll see this issue if you try and run the tests now:
```bash
TXRejectedError: the tx doesn't have the correct nonce. account has nonce of: 1 tx has nonce of: 0
```
- Remember our old friend, the account ``nonce``? It keeps a running total of the number transactions sent from an account. The account nonce must be incremented after each successful transaction!
> Check out details for a refresher on what could happen without a nonce to protect your transactions!

#### Double-Spend
- For this example, let's imagine a malicious person named Mallory.
- I need to send some ether to Mallory.
- I send the transaction to the ethereum network and it is successfully mined.
- Mallory sees the transaction and receives the money.
- Mallory thinks to herself, "What if that transaction ran 2 times? **I'd get 2 times the money!**"
- Mallory takes the transaction and sends it to the network.
    - A miner checks the transaction and sees that it is my signature. Uh-oh…
- Then the miner checks to see if the nonce accurately reflects the number of transactions my account has sent.
    - NOPE. The nonce is one value short of what it should be!
    - The transaction is rejected bt the miner. **Mallory's Attack is Foiled**.
> You might be wondering, "What if Mallory ran her own miner and changed her miner's rules so it would mine the transaction?" This is entirely possible; Ethereum client code is open-source after all! **However**, after Mallory successfully mines the transaction on her own machine, she'll need to send it to the other network nodes. The nodes will try to validate the block and realize this transaction is invalid due to the nonce count. **It will be rejected by the network**.

#### Under The Hood
- The ``wallet.sendTransaction`` is a super helpful function! We can take a look at the code in Ethers.js to see what's happening up close.
- First things first, we see that ``sendTransaction`` is adding a nonce if one wasn't provided. We can see that [here](https://github.com/ethers-io/ethers.js/blob/v4.0.23/wallet.js#L109-L112):
```javascript
if (transaction.nonce == null) {
    transaction = properties_1.shallowCopy(transaction);
    transaction.nonce = this.getTransactionCount("pending");
}
```
- If the ``transaction.nonce == null`` is checking if nonce is either ``null`` or ``undefined``.
- If we have not provided a nonce, it will be ``undefined``.
- In that case, ``ethers.js`` will automatically fetch the nonce using the provider.
- From previous lessons, you should be familiar with the ``eth_getTransactionCount`` method on the JSON-RPC API.
- That's what's happening here.
- You might notice that it's using ``"pending"`` which means that it will also count any transactions already in the transaction pool!
>  Wondering about the ``shallowCopy``? This ensures that the library doesn't make any changes to **your object**. By making a copy, it will only affect its object and not the reference that you shared by passing your object to ``sendTransaction``.
- From there ``sendTransaction`` calls ``populateTransaction`` which attempts to fill in quite a few additional properties! You can see that [here](https://github.com/ethers-io/ethers.js/blob/v4.0.23/utils/transaction.js#L157-L173):
```javascript
if (tx.to != null) {
    // will resolve ENS names like vitalik.eth
    tx.to = provider.resolveName(tx.to);
}
if (tx.gasPrice == null) {
    // for JSON-RPC providers, this calls eth_gasPrice
    tx.gasPrice = provider.getGasPrice();
}
if (tx.nonce == null) {
    // for JSON-RPC providers, this calls eth_gettransactioncount
    tx.nonce = provider.getTransactionCount(from);
}
if (tx.gasLimit == null) {
    // for JSON-RPC providers, this calls eth_estimategas
    var estimate = properties_1.shallowCopy(tx);
    estimate.from = from;
    tx.gasLimit = provider.estimateGas(estimate);
}
if (tx.chainId == null) {
    // if not provided during construction,
    // this will call net_version on JSON-RPC
    tx.chainId = provider.getNetwork().then(function (network) {
        return network.chainId;
    });
}
```
- We added comments to make it easier to see what's going on here.
    - As you can see, the ``sendTransaction`` function will go ahead and make all of these calls on our behalf if we don't provide the information. Quite useful!
- Lastly, the function will call ``wallet.sign`` after populating the remaining properties and before it publishes the transaction to the network. We can see that [here](https://github.com/ethers-io/ethers.js/blob/v4.0.23/wallet.js#L114).
```js
return transaction_1.populateTransaction(transaction, this.provider, this.address)
    .then(function (tx) {
        return _this.sign(tx).then(function (signedTransaction) {
            return _this.provider.sendTransaction(signedTransaction);
        });
    });
```
- At this point you might be wondering why ``sign`` even exists as it's own function.
    - Why not just have ``sendTransaction``?
- In some cases it's useful to sign a transaction to be sent later!
    - Sometimes you may want to batch your JSON-RPC calls.
    - Other times you may need to sign a transaction on a device not connected to the internet (see [air gap](https://en.wikipedia.org/wiki/Air_gap_(networking))) for security purposes.

### Retrieve the Balance
- We'll leave this stage mostly up to you, but don't panic! You know enough to figure this one out.
- Given a ``privateKey``, return a promise that will resolve with the balance of the address associated with it.
>Use this list of methods that a [Wallet connected to a provider](https://docs.ethers.io/v5/api/signer/#Signer--blockchain-methods) will have.