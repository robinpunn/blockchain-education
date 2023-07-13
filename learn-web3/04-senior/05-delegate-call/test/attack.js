const { expect } = require("chai");
const hre = require("hardhat");

describe("delegatecall Attack", () => {
  it("Should change the owner of the Good Contract", async () => {
    // Deploy the Helper Contract
    const helperContract = await hre.ethers.deployContract("Helper", []);
    await helperContract.waitForDeployment();

    // Deploy the Good Contract
    const goodContract = await hre.ethers.deployContract("Good", [
      helperContract.target,
    ]);

    await goodContract.waitForDeployment();

    // Deploy the Attack Contract
    const attackContract = await hre.ethers.deployContract("Attack", [
      goodContract.target,
    ]);

    await attackContract.waitForDeployment();

    // Let's attack the Good Contract
    const txn = await attackContract.attack();
    await txn.wait();

    expect(await goodContract.owner()).to.equal(attackContract.target);
  });
});
