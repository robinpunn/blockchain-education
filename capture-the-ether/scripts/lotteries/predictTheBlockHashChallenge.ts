import { ethers } from "hardhat";

async function main() {
  const amount = ethers.parseEther("1");

  // deploy contract
  const factory = await ethers.getContractFactory(
    "PredictTheBlockHashChallenge"
  );
  const contract = await factory.deploy({ value: amount });
  await contract.waitForDeployment();

  // make guess, 0
  const guess = await contract.lockInGuess(
    "0x0000000000000000000000000000000000000000000000000000000000000000",
    { value: amount }
  );
  await guess.wait();

  // loop through blocks to get to 257
  for (let i = 0; i < 257; i++) {
    await ethers.provider.send("evm_mine");
  }

  // settle after blocks are mined
  await contract.settle();

  const isComplete = await contract.isComplete();
  console.log(isComplete);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
