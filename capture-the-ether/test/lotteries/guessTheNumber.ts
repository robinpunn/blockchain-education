import { expect } from "chai";
import { ethers } from "hardhat";

describe("GuessTheSecretNumberChallenge", () => {
  it("Solves the challenge", async () => {
    const factory = await ethers.getContractFactory("GuessTheNumberChallenge");
    const contract = await factory.deploy({ value: ethers.parseEther("1") });
    await contract.waitForDeployment();

    const tx = await contract.guess(42, {
      value: ethers.parseEther("1"),
    });
    await tx.wait();

    expect(await contract.isComplete()).to.be.true;
  });
});
