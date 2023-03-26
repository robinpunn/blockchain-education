### Alchemy API Key
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

#### Current Block Number
- The Ethereum Blockchain adds a new block about every 12 seconds
- The first Ethereum block was [block #0](https://etherscan.io/block/0) mined on July 30th, 2015. If you visit the main [etherscan homepage](https://etherscan.io/) you'll see all the latest blocks mined.
- We can also always find this information on a Mainnet Ethereum Node by using Alchemy's **JSON-RPC API**!