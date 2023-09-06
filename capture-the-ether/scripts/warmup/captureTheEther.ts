const { ethers } = require("hardhat");

async function main() {
  const accounts = await ethers.getSigners();

  const capture = await ethers.deployContract("CaptureTheEther");

  await capture.waitForDeployment();

  console.log(`Capture deployed to ${capture.target}`);

  let name = ethers.encodeBytes32String("Robin");

  const setNickname = await capture.setNickname(name);
  await setNickname.wait();

  const nickNameHash = await capture.nicknameOf(accounts[0].address);

  console.log(nickNameHash === name);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
