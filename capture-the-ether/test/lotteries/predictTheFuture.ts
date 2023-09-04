import { expect } from "chai";
import { ethers } from "hardhat";

describe("PredictTheFutureChallenge", () => {
  it("Solves the challenge", async () => {
    const amount = ethers.parseEther("1");

    // deploy challenge contract
    const factory = await ethers.getContractFactory(
      "PredictTheFutureChallenge"
    );
    const contract = await factory.deploy({ value: amount });
    await contract.waitForDeployment();
    console.log(`GuessTheNumber deployed to ${contract.target}`);

    // deploy solver contract
    const factory2 = await ethers.getContractFactory("PredictTheFutureSolver");
    const contract2 = await factory2.deploy(contract.target);
    await contract2.waitForDeployment();

    // guess predetermined number
    const guess = await contract2.lockInGuess({ value: amount });
    await guess.wait();

    // run until the answer is the same as the solver contract predetermined number
    while (!(await contract.isComplete())) {
      try {
        const solve = await contract2.solve({ gasLimit: 1000000 });
        await solve.wait();
      } catch (err) {
        console.log(`attack failed`);
      }
      const blockNumber = await ethers.provider.getBlockNumber();
      console.log(`Tried block number: ${blockNumber}`);
      //   await new Promise((resolve) => setTimeout(resolve, 500));
    }

    expect(await contract.isComplete()).to.be.true;
  }).timeout(1000000);
});
