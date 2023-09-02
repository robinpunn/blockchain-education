import { expect } from "chai";
import { ethers } from "hardhat";

describe("GuessTheRandomNumberChallenge", () => {
  it("Solves the challenge", async () => {
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

    expect(await contract.isComplete()).to.be.true;
  });
});

// const deploymentTransaction = await contract.deploymentTransaction();

// const blockHash = deploymentTransaction?.blockHash;

// const block = await ethers.provider.getBlock(blockHash!);

// const blockNumber = block!.number;
// const timeStamp = block!.timestamp;
// const previousBlock = await ethers.provider.getBlock(blockNumber - 1);
// const concat = previousBlock + timeStamp.toString();

// const challengeAnswer = ethers.keccak256(concat);

// console.log("answer:", answer, "challengeAnswer:", challengeAnswer);
