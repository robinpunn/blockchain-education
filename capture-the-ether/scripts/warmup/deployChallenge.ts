import { ethers } from "hardhat";

async function main() {
  const deployChallenge = await ethers.deployContract("DeployChallenge");

  await deployChallenge.waitForDeployment();

  console.log(`deployed to ${deployChallenge.target}`);

  const isComplete = await deployChallenge.isComplete();
  console.log("isComplete:", isComplete);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
