import { expect } from "chai";
import { ethers } from "hardhat";

describe("CaptureTheEther", () => {
  it("Solves the challenge", async () => {
    const accounts = await ethers.getSigners();

    const contract = await ethers.deployContract("CaptureTheEther");
    await contract.waitForDeployment();

    console.log(`Capture deployed to ${contract.target}`);

    let name = ethers.encodeBytes32String("Robin");

    const setNickname = await contract.setNickname(name);
    await setNickname.wait();

    const nickNameHash = await contract.nicknameOf(accounts[0].address);

    expect(nickNameHash === name).to.be.true;
  });
});
