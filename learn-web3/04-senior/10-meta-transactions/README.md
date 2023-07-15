# [Using metatransaction to pay for your users' gas](https://learnweb3.io/degrees/ethereum-developer-degree/senior/using-metatransaction-to-pay-for-your-users-gas/)

### Metatransactions and Signature Replay
- There are times when you want your dApp users to have a gas-less experience, or perhaps make a transaction without actually putting something on the chain.
    - These types of transactions are called meta-transactions, and in this level, we will dive deep into how to design meta-transactions and also how they can be exploited if not designed carefully.
- For those of you who have used OpenSea, ever noticed how OpenSea lets you make listings of your NFT for free?
    - No matter what price you want to sell your NFT at, somehow it never charges gas beyond the initial NFT Approval transaction?
    - The answer, Meta transactions.
- Meta transactions are also commonly used for gas-less transaction experiences, for example asking the users to sign a message to claim an NFT, instead of paying gas to send a transaction to claim an NFT.
- There are other use cases as well, for example letting users pay for gas fees with any token, or even fiat without needing to convert to crypto.
    - Multisig wallets also only ask the last signer to pay gas for the transaction being made from the multisig wallet, and the other users just sign some messages.