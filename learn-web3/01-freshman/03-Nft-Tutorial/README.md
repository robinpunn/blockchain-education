# Build your own basic NFT contract on Ethereum

#### Setting up Hardhat
```bash
npm init --yes
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat
```
- Select Create a JavaScript Project and say yes to the other questions.
    - At the end, Hardhat will install any other dependencies it needs and set up a boilerplate project for you.

#### Installing OpenZeppelin Contracts
```bash
npm install --save-dev @openzeppelin/contracts
```

#### Writing the NFT Contract
```solidity
// NFTee.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

// Import the openzepplin contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// NFTee is  ERC721 signifies that the contract we are creating imports ERC721 and follows ERC721 contract from openzeppelin
contract NFTee is ERC721 {
    constructor() ERC721("NFTee", "ITM") {
        // mint an NFT to yourself
        _mint(msg.sender, 1);
    }
}
```
```bash
npx hardhat compile
```

#### Writing the Deploy Script
```js
// deploy.js
// Import the Hardhat package
const hre = require("hardhat");

async function main() {
    // Using `hre` - Hardhat Runtime Environment - we find and deploy
  	// a contract named `NFTee`
    const nftContract = await hre.ethers.deployContract("NFTee");

    // We wait for the contract to finish deploying
    await nftContract.waitForDeployment();

    // We print the address of the deployed contract to our console
    console.log("NFT Contract Address:", nftContract.target);
}

// Call the main function and catch if there is any error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

#### Configuring the Network
```js
QUICKNODE_RPC_URL="..."
PRIVATE_KEY="..."
```
```bash
npm install dotenv
```
```js
// hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");

// dotenv reads the `.env` file and makes it available to the NodeJS Environment
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    // Define the sepolia network parameters here
    sepolia: {
      url: process.env.QUICKNODE_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

#### Deploy your Contract
```bash
npx hardhat run scripts/deploy.js --network sepolia
```