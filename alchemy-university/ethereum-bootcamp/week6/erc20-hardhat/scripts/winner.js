const { ethers } = require("hardhat");
require("dotenv").config();
const MayhemCoin = require("../artifacts/contracts/MayhemCoin.sol/MayhemCoin.json");
const Bucket = [
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: "address", name: "", type: "address" },
    ],
    name: "Winner",
    type: "event",
  },
  {
    inputs: [
      { internalType: "address", name: "erc20", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "drop",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function main() {
  const bucketAddress = "0x873289a1aD6Cf024B927bd13bd183B264d274c68";
  const mayhemCoinAddress = "0x42CBab5E2F66FA5f5BC93BD38cb65353DED3882B";
  const amount = ethers.utils.parseUnits("1", "ether");

  // get a signer using the private key from the environment variables
  const [signer] = await ethers.getSigners();

  // create a contract instance for the Bucket contract using its ABI and address
  const bucket = new ethers.Contract(bucketAddress, Bucket, signer);

  // create a contract instance for the Mayhemcoin contract using its ABI and address
  const mayhemcoin = new ethers.Contract(
    mayhemCoinAddress,
    MayhemCoin.abi,
    signer
  );

  // approve the Bucket contract to spend 1 Mayhemcoin from the signer's address
  await mayhemcoin.approve(bucketAddress, amount);

  // call the drop function on the Bucket contract to transfer 1 Mayhemcoin from the signer's address
  const tx = await bucket.drop(mayhemCoinAddress, amount);
  console.log("Transaction hash:", tx.hash);

  // wait for the transaction to be mined
  await tx.wait();

  console.log("Winner event emitted!");
}

// call the main function
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
