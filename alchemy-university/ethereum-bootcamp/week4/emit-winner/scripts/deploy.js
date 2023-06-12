const hre = require("hardhat");

const contractAddress = "0xcF469d3BEB3Fc24cEe979eFf83BE33ed50988502";

async function deploy() {
  const WinnerInterface = await hre.ethers.getContractFactory(
    "WinnerInterface"
  );
  const contractInterface = await WinnerInterface.deploy(contractAddress);

  await contractInterface.deployed();

  console.log("WinnerInterface deployed to:", contractInterface.address);
  //0xd27e14A872247290709E69012c630CafA4012954

  await contractInterface.attempt();
  //https://goerli.etherscan.io/tx/0x329da5abddc2fdf1dc262d1232b7320bcb1e7bd5c8340662cee4f3285eca0895
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
