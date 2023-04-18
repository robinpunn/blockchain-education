### Multiple Signature Wallet
- You can think of a Multiple Signature Wallet (Multi-Sig) as being like an EOA, except each transaction must be signed off by multiple parties. 
- In Ethereum, Multi-Sig Wallets are smart contracts that store a list of owner addresses and a number of confirmations (unique owner signatures) that are required to complete a transaction. 
![Multi-Sig Smart Contract](https://res.cloudinary.com/divzjiip8/image/upload/v1569277574/Frame_13_mcuqpx.png)
- The multi-sig keeps track of owners #1, #2, and #3. 
    - It is also configured with the number of required confirmations to move funds, 2 in this case.
- Owner #1 submits a transaction to move .5 ETH to 0xabc.... 
    - This transaction will be pending until there are enough confirmations to move it forward. 
    - Since this multi-sig only requires two confirmations, as soon as owner #3 confirms the transaction, it is executed.
- In this tutorial we will build an implementation of a multi-signature wallet smart contract!