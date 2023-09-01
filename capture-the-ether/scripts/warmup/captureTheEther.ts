const { ethers } = require("hardhat");

async function main() {
  const accounts = await ethers.getSigners();

  const capture = await ethers.deployContract("CaptureTheEther");

  await capture.waitForDeployment();

  console.log(`Capture deployed to ${capture.target}`);

  let name = ethers.encodeBytes32String("Robin");

  await capture.setNickname(name);

  const NicknameChallenge = await ethers.getContractFactory(
    "NicknameChallenge"
  );

  const nickName = await NicknameChallenge.deploy(accounts[0].address);

  await nickName.waitForDeployment();

  console.log(`Nickname deployed to ${nickName.target}`);

  const isComplete = await nickName.player();

  console.log("isComplete:", isComplete);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
