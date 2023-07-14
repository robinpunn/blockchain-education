const { expect } = require("chai");
const hre = require("hardhat");

describe("tx.origin", () => {
  it("Attack.sol will be able to change the owner of Good.sol", async () => {
    // Get one address
    const [_, address1] = await hre.ethers.getSigners();

    // Deploy the Good Contract
    const GoodContract = await hre.ethers.getContractFactory("Good");
    const goodContract = await GoodContract.connect(address1).deploy();
    await goodContract.waitForDeployment();

    // Deploy the Attack Contract
    const attackContract = await hre.ethers.deployContract("Attack", [
      goodContract.target,
    ]);

    await attackContract.waitForDeployment();

    // Execute the attack
    const txn = await attackContract.connect(address1).attack();
    await txn.wait();

    // Now let's check if the current owner of the Good Contract is actually the Attack Contract
    expect(await goodContract.owner()).to.equal(attackContract.target);
  });
});
