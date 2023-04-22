const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  // Read the contract's ABI from the artifact file
  const contractArtifact = await ethers.getContractFactory("RobCoin");
  const contractABI = contractArtifact.interface;

  // Connect to the deployed contract
  const deployedContract = new ethers.Contract(
    "0xC70013950d23ce6976bB148789CC72d9bb11e191", // Replace with the address of your deployed contract
    contractABI,
    deployer
  );

  // Define the airdrop parameters
  const airdropAmount = ethers.utils.parseEther("1"); // Replace with the amount of RobCoin to airdrop to each address
  const addresses = [
    // "0x433C914F6a6301F9c6adbe55BE4FD5Cf77DD87A3",
    // "0x58b89b5B576212f4e883fa09C2A5FFE5f731e72e",
    // "0x44f41396e29dc6e0066f7447f8ea50b0700c58bb",
    // "0xdd65fa6b37fb876637c318fd7c14fe541fe47371",
    "0xce240f77d3b6ae96a53f85047b97d120686a7b7f",
    "0xB4d3cC81c3af96fBCeBEB7C8Dc92CE5025d30348",
  ];

  // Send the airdrop
  for (const address of addresses) {
    const tx = await deployedContract.transfer(address, airdropAmount);
    console.log(
      `Sent ${ethers.utils.formatEther(
        airdropAmount
      )} RobCoin to ${address}. Transaction hash: ${tx.hash}`
    );
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
