// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

// Returns the Ether balance of a given address
async function getBalance(address) {
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt)
}

// Logs the Ether balances for a list of addresses
async function printBalance(addresses) {
  let idx = 0;
  for (const address of addresses) {
    console.log(`Address ${idx} balance: `, await getBalance(address));
    idx++;
  }
}

// Logs the memos stored on-chain from coffee purchases
async function printMemos(memos) {
  for (const memo of memos) {
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress = memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`) 
  }
}

async function main() {
  // Get example accounts
  const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();
  
  // Get the contract to deploy & deploy
  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee deployed to ", buyMeACoffee.address);

  // Check balances before the coffee purchase
  const addresses = [owner.address, tipper.address, buyMeACoffee.address];
  console.log("== start ==");
  await printBalance(addresses);

  // Declare tip
  const tip = {value: hre.ethers.utils.parseEther("1")};

  // Buy the owner coffee
  await buyMeACoffee.connect(tipper).buyCoffee("Obrin", "Nice", tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Borin", "Real nice", tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Nibor", "Niiiiiice", tip);

  // Buy the owner a large coffee
  await buyMeACoffee.connect(tipper).buyLargeCoffee("Obrin", "Nice", tip);
  await buyMeACoffee.connect(tipper2).buyLargeCoffee("Borin", "Real nice", tip);
  await buyMeACoffee.connect(tipper3).buyLargeCoffee("Nibor", "Niiiiiice", tip);

  // Check balances after coffee purchase.
  console.log("== bought coffee ==");
  await printBalance(addresses);

  // Withdraw funds
  await buyMeACoffee.connect(owner).withdrawTips();

  // Check balances after withdrawal
  console.log("== withdraw tips ==");
  await printBalance(addresses);

  // Read all the memos left for the owner
  console.log("== memos ==");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
