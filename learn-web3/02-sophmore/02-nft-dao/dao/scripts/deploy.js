const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  // Deploy the NFT Contract
  const nftContract = await hre.ethers.deployContract("CryptoDevsNFT");
  await nftContract.waitForDeployment();
  console.log("CryptoDevsNFT deployed to:", nftContract.target);

  // Deploy the Fake Marketplace Contract
  const fakeNftMarketplaceContract = await hre.ethers.deployContract(
    "FakeNFTMarketplace"
  );
  await fakeNftMarketplaceContract.waitForDeployment();
  console.log(
    "FakeNFTMarketplace deployed to:",
    fakeNftMarketplaceContract.target
  );

  // Deploy the DAO Contract
  const daoContract = await hre.ethers.deployContract("CryptoDevsDAO", [
    fakeNftMarketplaceContract.target,
    nftContract.target,
  ]);
  await daoContract.waitForDeployment();
  console.log("CryptoDevsDAO deployed to:", daoContract.target);

  // Sleep for 30 seconds to let Etherscan catch up with the deployments
  await sleep(30 * 1000);

  // Verify the NFT Contract
  await hre.run("verify:verify", {
    address: nftContract.target,
    constructorArguments: [],
  });

  // Verify the Fake Marketplace Contract
  await hre.run("verify:verify", {
    address: fakeNftMarketplaceContract.target,
    constructorArguments: [],
  });

  // Verify the DAO Contract
  await hre.run("verify:verify", {
    address: daoContract.target,
    constructorArguments: [
      fakeNftMarketplaceContract.target,
      nftContract.target,
    ],
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

/*CryptoDevsNFT deployed to: 0xF4e19f2bfB37AeCBe36DE126A3494afc19b1d274
FakeNFTMarketplace deployed to: 0xC285DbcB278a4ffF7598e01cAe66C51662F9ba07
CryptoDevsDAO deployed to: 0x688AF90C99Be0Bb3B19A17964728867358c39B74
The contract 0xF4e19f2bfB37AeCBe36DE126A3494afc19b1d274 has already been verified.
https://sepolia.etherscan.io/address/0xF4e19f2bfB37AeCBe36DE126A3494afc19b1d274#code
Successfully submitted source code for contract
contracts/FakeNFTMarketPlace.sol:FakeNFTMarketplace at 0xC285DbcB278a4ffF7598e01cAe66C51662F9ba07
for verification on the block explorer. Waiting for verification result...

Successfully verified contract FakeNFTMarketplace on the block explorer.
https://sepolia.etherscan.io/address/0xC285DbcB278a4ffF7598e01cAe66C51662F9ba07#code
Successfully submitted source code for contract
contracts/CryptoDevsDAO.sol:CryptoDevsDAO at 0x688AF90C99Be0Bb3B19A17964728867358c39B74
for verification on the block explorer. Waiting for verification result...

Successfully verified contract CryptoDevsDAO on the block explorer.
https://sepolia.etherscan.io/address/0x688AF90C99Be0Bb3B19A17964728867358c39B74#code
*/
