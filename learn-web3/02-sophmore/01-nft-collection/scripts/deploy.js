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

/*
Whitelist Contract Address: 0xC656e41471F650D0Cf44b13b15C0CC8a588eacaE
The contract 0xC656e41471F650D0Cf44b13b15C0CC8a588eacaE has already been verified.
https://sepolia.etherscan.io/address/0xC656e41471F650D0Cf44b13b15C0CC8a588eacaE#code
*/
