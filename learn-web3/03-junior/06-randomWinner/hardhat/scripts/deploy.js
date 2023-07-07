const { ethers } = require("hardhat");
require("dotenv").config({ path: ".env" });
const { FEE, VRF_COORDINATOR, LINK_TOKEN, KEY_HASH } = require("../constants");

async function main() {
  /*
 DeployContract in ethers.js is an abstraction used to deploy new smart contracts,
 so randomWinnerGame here is a factory for instances of our RandomWinnerGame contract.
 */
  // deploy the contract
  const randomWinnerGame = await hre.ethers.deployContract("RandomWinnerGame", [
    VRF_COORDINATOR,
    LINK_TOKEN,
    KEY_HASH,
    FEE,
  ]);

  await randomWinnerGame.waitForDeployment();

  // print the address of the deployed contract
  console.log("Verify Contract Address:", randomWinnerGame.target);

  console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(30000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: randomWinnerGame.target,
    constructorArguments: [VRF_COORDINATOR, LINK_TOKEN, KEY_HASH, FEE],
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
