# Build an NFT collection with a whitelist using Hardhat and Solidity

#### Setup
```bash
npm init --yes
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat
```

#### Writing the Whitelist Contract
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;


contract Whitelist {

    // Max number of whitelisted addresses allowed
    uint8 public maxWhitelistedAddresses;

    // Create a mapping of whitelistedAddresses
    // if an address is whitelisted, we would set it to true, it is false by default for all other addresses.
    mapping(address => bool) public whitelistedAddresses;

    // numAddressesWhitelisted would be used to keep track of how many addresses have been whitelisted
    uint8 public numAddressesWhitelisted;

    // Setting the Max number of whitelisted addresses
    // User will put the value at the time of deployment
    constructor(uint8 _maxWhitelistedAddresses) {
        maxWhitelistedAddresses =  _maxWhitelistedAddresses;
    }

    /**
        addAddressToWhitelist - This function adds the address of the sender to the
        whitelist
     */
    function addAddressToWhitelist() public {
        // check if the user has already been whitelisted
        require(!whitelistedAddresses[msg.sender], "Sender has already been whitelisted");
        // check if the numAddressesWhitelisted < maxWhitelistedAddresses, if not then throw an error.
        require(numAddressesWhitelisted < maxWhitelistedAddresses, "More addresses cant be added, limit reached");
        // Add the address which called the function to the whitelistedAddress array
        whitelistedAddresses[msg.sender] = true;
        // Increase the number of whitelisted addresses
        numAddressesWhitelisted += 1;
    }

}
```

#### Deployment Script
```js
const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  /*
    DeployContract in ethers.js is an abstraction used to deploy new smart contracts,
    so whitelistContract here is a factory for instances of our Whitelist contract.
    */
  // here we deploy the contract
  const whitelistContract = await hre.ethers.deployContract("Whitelist", [10]);
  // 10 is the Maximum number of whitelisted addresses allowed

  // wait for the contract to deploy
  await whitelistContract.waitForDeployment();

  // print the address of the deployed contract
  console.log("Whitelist Contract Address:", whitelistContract.target);

  // Sleep for 30 seconds while Etherscan indexes the new contract deployment
  await sleep(30 * 1000); // 30s = 30 * 1000 milliseconds

  // Verify the contract on etherscan
  await hre.run("verify:verify", {
    address: whitelistContract.target,
    constructorArguments: [10],
  });
}

// Call the main function and catch if there is any error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
```

#### Environment Variables
```js
PRIVATE_KEY="..."
RPC_URL="..."
ETHERSCAN_API_KEY="..."
```
```bash
npm install dotenv
```
```js
//hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });

const QUICKNODE_HTTP_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: QUICKNODE_HTTP_URL,
      accounts: [PRIVATE_KEY],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};
```

#### Deploy your Contract
```bash
npx hardhat run scripts/deploy.js --network sepolia
```
- This will run the deploy.js script we wrote earlier, and instruct Hardhat to use the configuration from the sepolia network that we just added above.
- If all goes well, you should get a contract address for where your Whitelist contract was deployed.
    - Take note of this address as we will need it later.

#### Adding users to the whitelist
- Go to Sepolia Etherscan and search up your contract address, and go to the Contract tab there.
- Go to the ``Read Contract`` tab and click on ``numAddressesWhitelisted`` - it should currently be set to 0 as nobody has joined the whitelist yet.
- Now, go to the ``Write Contract`` tab and first click on ``Connect to Web3`` - this will prompt you to connect your wallet to Etherscan.
    - Once you have connected a wallet, click on ``addAddressToWhitelist`` and then click on Write.
- This should pop open your wallet to confirm a transaction.
    - Confirm the transaction, and then wait for it to go through.
    - You can click on View your transaction on Etherscan to check it's status.
- Once the transaction is successful, go back to the ``Read Contract`` tab, refresh, and click on ``numAddressesWhitelisted``.
    - It should now say 1

#### Writing the NFT Contract
```bash
npm install @openzeppelin/contracts
```
```solidity
// CryptoDevs.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Whitelist.sol";

contract CryptoDevs is ERC721Enumerable, Ownable {
    //  _price is the price of one Crypto Dev NFT
    uint256 constant public _price = 0.01 ether;

    // Max number of CryptoDevs that can ever exist
    uint256 constant public maxTokenIds = 20;

    // Whitelist contract instance
    Whitelist whitelist;

    // Number of tokens reserved for whitelisted members
    uint256 public reservedTokens;
    uint256 public reservedTokensClaimed = 0;

    /**
      * @dev ERC721 constructor takes in a `name` and a `symbol` to the token collection.
      * name in our case is `Crypto Devs` and symbol is `CD`.
      * Constructor for Crypto Devs takes in the baseURI to set _baseTokenURI for the collection.
      * It also initializes an instance of whitelist interface.
      */
    constructor (address whitelistContract) ERC721("Crypto Devs", "CD") {
        whitelist = Whitelist(whitelistContract);
        reservedTokens = whitelist.maxWhitelistedAddresses();
    }

    function mint() public payable {
        // Make sure we always leave enough room for whitelist reservations
        require(totalSupply() + reservedTokens - reservedTokensClaimed < maxTokenIds, "EXCEEDED_MAX_SUPPLY");

        // If user is part of the whitelist, make sure there is still reserved tokens left
        if (whitelist.whitelistedAddresses(msg.sender) && msg.value < _price) {
            // Make sure user doesn't already own an NFT
            require(balanceOf(msg.sender) == 0, "ALREADY_OWNED");
            reservedTokensClaimed += 1;
        } else {
            // If user is not part of the whitelist, make sure they have sent enough ETH
            require(msg.value >= _price, "NOT_ENOUGH_ETHER");
        }
        uint256 tokenId = totalSupply();
        _safeMint(msg.sender, tokenId);
    }

    /**
    * @dev withdraw sends all the ether in the contract
    * to the owner of the contract
      */
    function withdraw() public onlyOwner  {
        address _owner = owner();
        uint256 amount = address(this).balance;
        (bool sent, ) =  _owner.call{value: amount}("");
        require(sent, "Failed to send Ether");
    }
}
```

#### Deploying the NFT Contract
```js
// deploy-nft.js
const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Deploy the CryptoDevs Contract
  const nftContract = await hre.ethers.deployContract("CryptoDevs", [
    "put Whitelist contract address here",
  ]);

  // wait for the contract to deploy
  await nftContract.waitForDeployment();

  // print the address of the deployed contract
  console.log("NFT Contract Address:", nftContract.target);

  // Sleep for 30 seconds while Etherscan indexes the new contract deployment
  await sleep(30 * 1000); // 30s = 30 * 1000 milliseconds

  // Verify the contract on etherscan
  await hre.run("verify:verify", {
    address: nftContract.target,
    constructorArguments: ["put Whitelist contract address here"],
  });
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```
```bash
npx hardhat run scripts/deploy-nft.js --network sepolia
```

#### Test Whitelisted Mint
- Open up your NFT Contract on Sepolia Etherscan and go to the Contract tab and then Write Contract.
    - Connect your wallet to Etherscan, and then let's call the mint function.
- Input payableAmount as 0, and then click on Write.
    - Confirm the transaction and watch it go through, and you will end up with a new NFT on Sepolia!

#### Testing non-whitelisted mint
- Try doing the mint again without changing the payableAmount - and you will see that the transaction will actually fail!
- However, if you change payableAmount to be 0.01 and press Write again - the transaction will go through because now you're paying the price of the NFT!