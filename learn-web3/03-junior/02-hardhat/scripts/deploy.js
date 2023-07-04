// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

async function main() {
  // Compile the contract
  const Greeter = await ethers.getContractFactory("Greeter");

  // Deploy the contract
  console.log("Deploying Greeter contract...");
  const greeter = await Greeter.deploy("Hello, world!");

  // Wait for the deployment to be confirmed
  await greeter.waitForDeployment();

  // Log the contract address
  console.log("Greeter contract deployed to:", greeter.target);
}

// Run the deployment script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
