import { ethers } from "hardhat";

async function main() {
  const amount = ethers.parseEther("1");

  // deploy the challenge contract
  const factory = await ethers.getContractFactory("GuessTheNewNumberChallenge");

  const contract = await factory.deploy({ value: amount });

  await contract.waitForDeployment();

  console.log(`GuessTheNumber deployed to ${contract.target}`);

  // deploy solver contract with challenge contract address
  const factory2 = await ethers.getContractFactory("GuessTheNumberSolver");

  const contract2 = await factory2.deploy(contract.target);

  await contract2.solve({ value: amount });

  const isComplete = await contract.isComplete();

  console.log(isComplete);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
