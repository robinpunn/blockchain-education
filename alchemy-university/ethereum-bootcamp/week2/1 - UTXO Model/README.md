## Coding the UTXO Model

---

### Table of Contents
1. [Unspent Transaction Outputs](#unspent-transaction-outputs)
    - [UTXO Exmaple 1](#utxo-example-1)
    - [UTXO Example 2](#utxo-example-2)
1. [Transaction Output](#transaction-output)
    - [Transaction Outputs](#transaction-outputs)
    - [Your Goal: Create a TXO class](#your-goal-create-a-txo-class)
1. [Sufficient Amount](#sufficient-amount)
    - [Inputs & Outputs](#inputs--outputs)
    - [Your Goal: Ensure Sufficient Amount](#your-goal-ensure-sufficient-input)
1. [Successful Execute](#successful-execute)
    - [Successful Transaction](#successful-transaction)
    - [Your Goal: Mark Inputs as Spent](#your-goal-mark-inputs-as-spent)
1. [Miners' Fee](#miners-fee)
    - [Miner's Fee](#miners-fee-1)
    - [Your Goal: Calculate the Fee](#your-goal-calculate-the-fee)

### Unspent Transaction Outputs
- Bitcoin uses Unspent Transaction Outputs for handling user ownership of coins. 
- This is opposed to an account based model used by Ethereum, which tracks balances of particular addresses.
#### UTXO Example 1
- Bob runs a Bitcoin Miner. 
    - He successfully computes a block and rewards himself with 12.5 BTC as per the emission rules. 
    - This is a brand new Unspent Transaction Output (UTXO) Bob has introduced to the system
- Now let's say Bob wants to send Alice 6.0 BTC. 
    - He can do so by using his UTXO with 12.5 BTC. 
    - But, wait, Bob doesn't want to send Alice 12.5 BTC! How do we handle the remainder?
- As it turns out Bitcoin allows you to designate multiple outputs per transaction. 
    - In this particular transaction, we'll create one UTXO of 6.0 BTC for Alice and another UTXO of 6.5 BTC for Bob (the remainder). 
    - Then, we'll mark the UTXO for 12.5 BTC as spent since it was used as an input for the transaction.
#### UTXO Example 2
- One thing that can often happen when using this model, is users end up with a lot of small UTXOs. 
    - As Alice transacts with the network her, UTXO breaks up into smaller outputs until she's left with 3 UTXOs of values 1.0 BTC, 1.5 BTC, and 0.8 BTC.
- Let's say that Alice wants to purchase something for 3.0 BTC. 
    - She can do so by specifying many inputs to the transaction. 
    - She can put all three of her UTXOs as inputs into the transaction for a to total of 3.3 BTC. 
    - After the transaction is executed, she'll receive a new UTXO of 0.3 BTC and her previous inputs will all be marked as spent.

### Transaction Output
#### Transaction Outputs
- Using a Bitcoin Block Explorer you can look up TXOs on the actual network.
- If we wanted to look up UTXOs for a particular address, for instance: https://blockchain.info/unspent?active=1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa
> The value after active= is an address. This particular address was the one Satoshi used when they mined the first Bitcoin block.
#### Your Goal: Create a TXO class
- Let's complete the ``constructor`` and ``spend`` methods for the ``TXO`` class in the ``TXO.js`` file.
1. The ``constructor`` should store the values passed into it on properties of the same name.
    - It should also create a property spent and default it to false.
1. The spend function should set the spent property to true. For example:
    ```js
    const txo = new TXO("1FNv3tXLkejPBYxDHDaZz6ENNz3zn3G4GM", 10);

    console.log( txo.owner ); // 1FNv3tXLkejPBYxDHDaZz6ENNz3zn3G4GM
    console.log( txo.amount ); // 10
    console.log( txo.spent ); // false

    txo.spend();

    console.log( txo.spent ); // true
    ```
- Notice how ``spent`` is initially ``false`` when we create the new ``TXO``. After invoking the ``spend`` function, ``spent`` should be set to true.
- **SOLUTION**
```js
class TXO {
    constructor(owner, amount) {
        this.owner = owner
        this.amount = amount
        this.spent = false
    }
    spend() {
        this.spent = true
    }
}

module.exports = TXO;
```

### Spent TXOs
#### Transactions
- Transactions on the Bitcoin network can have many inputs and many outputs.
> You can take a look at this [Bitcoin Transaction](https://www.blockchain.com/btc/tx/1c55e5e7446ce296fd78132b8196fb82190af050585867a04f9182c53dc480af) for an example of one with many outputs.
- This combined with a scripting system on each transaction allows Bitcoin users to engage in more complex financial agreements than one individual simply sending money to the other
- For your average transaction, the Script simply requires that new UTXOs can only be spent by the associated address.
#### Your Goal: Ensure Inputs are UTXOs
- On this stage, we introduce a new file ``Transaction.js``.
- In the ``Transaction`` constructor you'll see two arguments passed in: ``inputUTXOs`` and ``outputUTXOs``.
    - Both of these objects are arrays containing instances of transaction outputs.
1. Store ``inputUTXOs`` and ``outputUTXOs`` on the transaction object.
1. In the ``execute`` function do one thing for now: ensure that none of the ``inputUTXOs`` are already spent. We can't allow double-spending TXOs!
1. Throw an error in ``execute`` if any input TXO is already spent.
>  The terminology between UTXO and TXO can sometimes get confusing. Remember that a TXO is just the nomenclature for a UTXO that is already spent!
- **SOLUTIONS**
```js
class Transaction {
    constructor(inputUTXOs, outputUTXOs) {
        this.inputUTXOs = inputUTXOs
        this.outputUTXOs = outputUTXOs
    }
    execute() {
        for (let i=0;i<this.inputUTXOs.length;i++){
            if(this.inputUTXOs[i].spent === true){
                throw new Error
            }
        }
    }
}

module.exports = Transaction;
```

### Sufficient Amount
#### Inputs & Outputs
- With a multitude of input and output UTXOs allowed in every transaction, there are many possibilities of exchange that exist!
- Bitcoin wallet software will sometimes choose to include many input UTXOs just to aggregate them into one bigger UTXO to send back to the owner.
- For instance, if you have five UTXOs, each with amounts of 0.1 BTC, your wallet may choose to combine them into 0.5 BTC on the next transaction.
- The important part is ensuring there is **enough total value** in the input UTXOs to cover the total amount in the output UTXOs.
#### Your Goal: Ensure Sufficient Input
1. Let's make sure that the ``inputUTXOs`` have enough total value in them to cover the total value of the ``outputUTXOs``.
1. If the total value of the inputs **is less than** the total value of the outputs, throw an error in the ``execute`` function.
- **SOLUTION**
```js
class Transaction {
    constructor(inputUTXOs, outputUTXOs) {
        this.inputUTXOs = inputUTXOs
        this.outputUTXOs = outputUTXOs
    }
    execute() {
        for (let i=0;i<this.inputUTXOs.length;i++){

            if(this.inputUTXOs[i].spent === true){
                throw new Error
            }
        }
        const input = this.inputUTXOs.reduce((acc,ind)=>{return acc+ind.amount},0)
        const output = this.outputUTXOs.reduce((acc,ind)=>{return acc+ind.amount},0)
        if (input<output){
            throw new Error
        }
    }
}

module.exports = Transaction;
```

### Successful Execute
#### Successful Transaction
- When a transaction is successful and mined to the blockchain, the output UTXOs become new TXOs that are ready to be spent.
- The input UTXOs need to be marked as spent, to ensure that they are not spent again!
#### Your Goal: Mark Inputs as Spent
- If no errors are thrown during the ``execute`` function of the transaction, then it is successful!
- **SOLUTION**
```js
class Transaction {
    constructor(inputUTXOs, outputUTXOs) {
        this.inputUTXOs = inputUTXOs
        this.outputUTXOs = outputUTXOs
    }
    execute() {
        for (let i=0;i<this.inputUTXOs.length;i++){
            if(this.inputUTXOs[i].spent === true){
                throw new Error
            }
        }
        const input = this.inputUTXOs.reduce((acc,ind)=>{return acc+ind.amount},0)
        const output = this.outputUTXOs.reduce((acc,ind)=>{return acc+ind.amount},0)
        if (input<output){
            throw new Error
        }
        this.inputUTXOs.map(tx=>tx.spend())
    }
}

module.exports = Transaction;
```


### Miner's Fee
#### Miner's Fee
- At this point you may be wondering why in the third stage we only required that the total input amount be more than than the total output amount.
- Shouldn't we also throw an error when the output amount turns out to be less?
- Nope! Actually, the remainder is given to the miner!
- This is a design choice in the Bitcoin system. It is referred to as the **transaction fee**.
- The transaction fee can help expedite your request.
    - A miner is much more likely to include your transaction in their next block if you include a nice hefty prize for them to collect!
> Bitcoin has a [controlled supply](https://en.bitcoin.it/wiki/Controlled_supply). For a limited time there is a reward for the miner in every block. At a certain point, this will stop and the only reward for the miner will become the transaction fees.

#### Your Goal: Calculate the fee!
- At the end of the execute function, calculate the fee as the sum of all the inputs minus the sum of all the outputs.
1. Given that we throw an error if the inputs are insufficient, this number should be at least zero. Any time outputs are less, this should be a positive fee.
2. Store the fee amount in a property called fee on the transaction itself.
- For example:
```js
const iTXO = new TXO(fromAddress, 5);
const oTXO = new TXO(toAddress, 3);

const tx = new Transaction([iTXO], [oTXO]);

tx.execute();

console.log( tx.fee ); // 2
```
- **SOLUTOIN**
```js
class Transaction {
    constructor(inputUTXOs, outputUTXOs) {
        this.inputUTXOs = inputUTXOs
        this.outputUTXOs = outputUTXOs
        this.fee = null
    }
    execute() {
        for (let i=0;i<this.inputUTXOs.length;i++){
            if(this.inputUTXOs[i].spent === true){
                throw new Error
            }
        }
        const input = this.inputUTXOs.reduce((acc,ind)=>{return acc+ind.amount},0)
        const output = this.outputUTXOs.reduce((acc,ind)=>{return acc+ind.amount},0)
        if (input<output){
            throw new Error
        }
        this.inputUTXOs.map(tx=>tx.spend())
        this.fee = input - output
    }
}

module.exports = Transaction;
```