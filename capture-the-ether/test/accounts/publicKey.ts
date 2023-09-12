import { expect } from "chai";
import { ethers } from "hardhat";

describe("PublicKeyChallenge", () => {
  it("Solves the challenge", async () => {
    // deploy contract
    const contract = await ethers.deployContract("PublicKeyChallenge");
    await contract.waitForDeployment();
  });
});
