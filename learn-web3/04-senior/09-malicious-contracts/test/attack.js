const { expect } = require("chai");
const hre = require("hardhat");

describe("Malicious External Contract", () => {
  it("Should change the owner of the Good Contract", async () => {
    // Deploy the Malicious Contract
    const maliciousContract = await hre.ethers.deployContract("Malicious", []);
    await maliciousContract.waitForDeployment();

    // Deploy the Good Contract
    const goodContract = await hre.ethers.deployContract(
      "Good",
      [maliciousContract.target],
      {
        value: hre.ethers.parseEther("3"),
      }
    );

    await goodContract.waitForDeployment();

    // Get one address
    const [_, address1] = await hre.ethers.getSigners();

    // Now let's add an address to the eligibility list
    const txn = await goodContract.connect(address1).addUserToList();
    await txn.wait();

    // Check if the user is eligible
    const eligible = await goodContract.connect(address1).isUserEligible();
    expect(eligible).to.equal(false);
  });
});
