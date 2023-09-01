import { ethers } from "hardhat";

async function main() {
  const accounts = await ethers.getSigners();

  const GuessTheNumber = await ethers.getContractFactory(
    "GuessTheNumberChallenge"
  );

  const amount = ethers.parseEther("1");

  const guessNumber = await GuessTheNumber.deploy({ value: amount });

  await guessNumber.waitForDeployment();

  console.log(`GuessTheNumber deployed to ${guessNumber.target}`);

  await guessNumber.guess(42, { value: amount });

  const isComplete = await guessNumber.isComplete();

  console.log("isComplete:", isComplete);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
