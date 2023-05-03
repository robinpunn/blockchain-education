## JSON-RPC Requests

---
### Table of Contents
1. [API Key](#api-key)
    - [Alchemy API Key](#alchemy-api-key)
    - [Get API Key (with pictures!)](#get-api-key-with-pictures)
    - [Your Goal: Fetch the key!](#your-goal-fetch-the-key)
---

### API Key
#### Alchemy API Key
- In this exercise, you'll need to grab your [Alchemy API Key](https://dashboard.alchemy.com/) so you can start making some JSON RPC Requests!
> An API key is a unique identifier that grants access to an API (Application Programming Interface). It acts as a secret token that allows the user to gain access to a set of methods.
- When using your Alchemy API key, it's important to keep it safe and secure, so only your code can access your Alchemy Apps. 
- For that reason, we'll be putting it in .env file. 
    - The .env file is a configuration file that is used to store environment variables in a project. 
    - Sometimes, these variables are sensitive and should not be kept with the source code of the project. 
    - Other times, they are simply variables that are different depending on the environment you're in (i.e. your local environment vs production).
>We'll be making use of the [dotenv](https://www.npmjs.com/package/dotenv) module to load our environment variables. We recommend you follow this same practice in your own projects!
- The format of a ``.env`` file is:
```
KEY1=VALUE1
KEY2=VALUE2
```
- Often times you'll see the values in quotes. 
    - This is only necessary if your value has a space in it like "my value". 
    - Whitespace surrounding the value is not an issue in a .env file.

#### Get API Key (with pictures!)
1. Create an App
![Create an App](https://res.cloudinary.com/divzjiip8/image/upload/v1676613941/alchemyu/json-rpc/createapp.png)
2. Choose Ethereum Mainnet
![Choose Ethereum Mainnet](https://res.cloudinary.com/divzjiip8/image/upload/v1676613941/alchemyu/json-rpc/chainandnetwork.png)
3. View Key
![View Key](https://res.cloudinary.com/divzjiip8/image/upload/v1676613941/alchemyu/json-rpc/viewkey.png)
4. Copy API Key
![Copy API Key](https://res.cloudinary.com/divzjiip8/image/upload/v1676613941/alchemyu/json-rpc/copy.png)

#### Your Goal: Fetch the key!
- The goal of this stage is to fill in the .env file with your Alchemy API Key!
    - When you do so, the test cases will attempt to make a request to your Alchemy endpoint.
    - If it's successful, you'll pass the test cases! You'll need to:
1. Visit the [Alchemy Dashboard](https://dashboard.alchemy.com/). If it's your first time visiting the dashboard, you'll need to go through a sign up flow.
1. Once you're on the dashboard page, you'll need a mainnet app. If you don't have one, click "+Create App". Choose Ethereum as your Chain and Mainnet as your Network.
1. Click "View Key" on your Mainnet App and copy the API Key. Paste it into your ``.env`` as the value for the ``API_KEY``.
1. Once you've pasted the API Key, run your code!


### Current Block Number
- The Ethereum Blockchain adds a new block about every 12 seconds
- The first Ethereum block was [block #0](https://etherscan.io/block/0) mined on July 30th, 2015. If you visit the main [etherscan homepage](https://etherscan.io/) you'll see all the latest blocks mined.
- We can also always find this information on a Mainnet Ethereum Node by using Alchemy's **JSON-RPC API**!
#### Your Goal: Current Block Number
- Let's ask Mainnet Ethereum what the current block number is!
    - To do this, we'll make a JSON RPC request to our Alchemy endpoint using the [axios http library](https://www.npmjs.com/package/axios) and using [dotenv](https://www.npmjs.com/package/dotenv) to load our api key environment variable.
1. Update the ``getBlockNumber`` function to retrieve the current block number. The method we're going to use is called **eth_blockNumber**.
1. Take a look at the response you get back in the ``console.log``. Can you find the block number and return it?
> You can learn more about the [axios response object](https://axios-http.com/docs/res_schema) here. The data is what the JSON RPC API responded with! This will match the response body documented in Alchemy's reference for the [eth_blockNumber method](https://docs.alchemy.com/reference/eth-blocknumber).
> In future exercises, requests like this will become even easier with the [Alchemy SDK](https://www.alchemy.com/sdk)!

---
**SOLUTION**
```js
const axios = require('axios');

// grab the API key from the .env
require('dotenv').config();
const url = `https://eth-mainnet.g.alchemy.com/v2/${process.env.API_KEY}`;

async function getBlockNumber() {
    const response = await axios.post(url, {
        jsonrpc: "2.0",
        id: 1,
        method: "eth_blockNumber", // <-- TODO: fill in the method name
    });

    // axios has a data prop which is the response from the server
    // TOOD: use this console log to locate the block number
    console.log(response.data);

    // TODO: return the block number
    return response.data.result
}

module.exports = getBlockNumber;
```
---
###  Get Balance
#### Alchemy JSON RPC Tools
- As you're going through these exercises, be sure to check out:
    - **Alchemy Explorer** - Check it out! The JSON RPC requests you're making in these exercises will show up here: https://dashboard.alchemy.com/explorer
    - **Alchemy Composer** - If you ever want to quickly run a JSON RPC method, this is the easiest place to do it: https://dashboard.alchemy.com/composer

#### Balances
- Let's talk about ether balances!
    - Every Ethereum address has an associated balance.
    - This is true whether it's an Externally Owned Account, or a smart contract!
    - You can see this balance if you go to Etherscan: here's an example address.




#### Transaction Nonce
- When sending transactions in Ethereum it's a requirement to include a nonce.
- The reasoning is quite simple: you wouldn't want your transaction to be executed multiple times!
- How could that happen?
    - Well, let's say you sign a transaction to send 1 ether to someone else.
    - Once you sign this transaction and broadcast it to the network, everyone can see the data associated with the transaction.
- Anyone could take your transaction and send it to miners again.
    - The miners would see that it is your signature afterall, so why shouldn't they execute it twice?
    - The reason they won't execute it the second time is because of the account nonce!
- The account nonce is simply a counter of all the transactions sent by an address.
    - Every time you send a transaction from your account the counter goes up by 1.
    - This makes each request unique, even if it has the same parameters!
    - Each time you sign a transaction, you'll sign it with the latest transaction count as the nonce.
    - If your or someone else tries to replay a transaction with a nonce lower than your transaction count, it will be rejected by the network.

#### Block Transactions
- Ethereum blocks contain a list of transactions.
- This list can be empty or it can grow as large as the gas limit allows.
- The block gas limit can vary from block to block as we learned in the Gas on Ethereum section.
>Remember a transaction has its own gas limit which is the amount of gas the owner is willing to spend on a transaction. The actual gas spent on a transaction can be lower than the limit and the sender will be issued a refund. This is quite different than the block's gas limit, so be careful not to get them confused!
- Since a transfer costs 21000 gas, this means that ~714 transfer transactions could fit into a single block (assuming we hit the target gas limit of 15 million).
>The gas cost of a contract transaction depends heavily on its computational complexity. Its possible that a contract function requires so much gas to execute that its impossible to fit into a block!

#### Batch Transactions
- Have you noticed the id property on all of our JSON-RPC requests?
- This property is used when batching requests.
- If we want to make several different remote procedure calls, we can do them all at once and receive responses for each one.
- The id will tell us which response corresponds to which request.
- For example:
```js
const request1 = {
    jsonrpc: "2.0",
    id: 1,
    method: "eth_blockNumber",
}

const request2 = {
    jsonrpc: "2.0",
    id: 2,
    method: "net_version"
}

const response = await axios.post(url, [request1, request2]);

console.log(response.data);
/*
    [
        { id: 1, jsonrpc: '2.0', result: '0x0' },
        { id: 2, jsonrpc: '2.0', result: '0xb1a2bc2ec50000' }
    ]
*/
```
- Here we are able to batch request1 and request2 together so that we only make one HTTP call for both requests.
- The response comes back as an array of responses containing a result for each request with a corresponding id property.
#### Your Goal: Total Balance
- The ``getTotalBalance`` method will receive an array of several addresses.
1. Take each address and find its ether balance
1. Add all of these balances together to find the total balance of all the addresses and return it
> You'll notice from the example above that the result is coming back as a hexadecimal string. You can use ``parseInt('0xb1a2bc2ec50000')`` method to convert hex values to integers in order to add them.
---
**SOLUTION**
```js
require('dotenv').config();
const { API_KEY } = process.env;
const axios = require('axios');
const url = `https://eth-mainnet.g.alchemy.com/v2/${API_KEY}`;

async function getTotalBalance(addresses) {
    // console.log(addresses)
    const batch = addresses.map((address,index) =>({
        // TODO: fill in with several JSON RPC requests
            jsonrpc: "2.0",
            id: index,
            method: "eth_getBalance", // <-- fill in the method
            params: [address],  // <-- fill in the params
        }))
    const response = await axios.post(url, batch);
     // use this if you want to inspect the response data!
    let total = await response.data.map(total=>{
        let counter = 0
        counter += parseInt(total.result)
        return counter
        });
    return total.reduce((a,c)=>{
        return a += c
    })
```
---