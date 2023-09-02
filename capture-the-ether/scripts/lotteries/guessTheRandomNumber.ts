import { ethers } from "hardhat";

async function main() {
  const GuessTheNumber = await ethers.getContractFactory(
    "GuessTheRandomNumberChallenge"
  );

  const amount = ethers.parseEther("1");

  const contract = await GuessTheNumber.deploy({ value: amount });

  await contract.waitForDeployment();

  console.log(`GuessTheNumber deployed to ${contract.target}`);

  const answer = await ethers.provider.getStorage(contract.target, 0);

  const tx = await contract.guess(answer, {
    value: ethers.parseEther("1"),
  });
  await tx.wait();

  const isComplete = await contract.isComplete();

  console.log("isComplete:", isComplete);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
