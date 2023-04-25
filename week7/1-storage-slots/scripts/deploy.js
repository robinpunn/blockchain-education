// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Storage = await hre.ethers.getContractFactory("Storage");
  const storage = await Storage.deploy();

  await storage.deployed();

  console.log(`Contract deployed to ${storage.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// Contract deployed to 0x5FbDB2315678afecb367f032d93F642f64180aa3
