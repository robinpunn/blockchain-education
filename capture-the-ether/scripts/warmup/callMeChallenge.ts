import { ethers } from "hardhat";

async function main() {
  const callMeChallenge = await ethers.deployContract("CallMeChallenge");

  await callMeChallenge.waitForDeployment();

  console.log(`deployed to ${callMeChallenge.target}`);

  let isComplete = await callMeChallenge.isComplete();
  console.log("isComplete1:", isComplete);

  await callMeChallenge.callme();

  isComplete = await callMeChallenge.isComplete();

  console.log("isComplete2:", isComplete);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
