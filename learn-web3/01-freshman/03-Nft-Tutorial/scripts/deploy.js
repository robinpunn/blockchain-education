// Import the Hardhat package
const hre = require("hardhat");

async function main() {
  /*
DeployContract in ethers.js is an abstraction used to deploy new smart contracts,
so nftContract here is a factory for instances of our NFTee contract.
*/
  // here we deploy the contract
  const nftContract = await hre.ethers.deployContract("NFTee");

  // wait for the contract to deploy
  await nftContract.waitForDeployment();

  // print the address of the deployed contract
  console.log("NFT Contract Address:", nftContract.target);

  // deployed: 0x7135748A5ae4A10f7E27f43f1df50719A1970f3d
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
