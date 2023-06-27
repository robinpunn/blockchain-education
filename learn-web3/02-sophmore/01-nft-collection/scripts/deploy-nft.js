const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Deploy the CryptoDevs Contract
  const nftContract = await hre.ethers.deployContract("CryptoDevs", [
    "0xC656e41471F650D0Cf44b13b15C0CC8a588eacaE",
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
    constructorArguments: ["0xC656e41471F650D0Cf44b13b15C0CC8a588eacaE"],
  });
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

/*
NFT Contract Address: 0x0dc7c075393f191AFCF0aBA3fFaA4b5B90Df9404
Successfully submitted source code for contract
contracts/CryptoDevs.sol:CryptoDevs at 0x0dc7c075393f191AFCF0aBA3fFaA4b5B90Df9404
for verification on the block explorer. Waiting for verification result...

Successfully verified contract CryptoDevs on the block explorer.
https://sepolia.etherscan.io/address/0x0dc7c075393f191AFCF0aBA3fFaA4b5B90Df9404#code
*/
