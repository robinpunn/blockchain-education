const hre = require("hardhat");
const { keccak256, hexZeroPad, toUtf8Bytes } = hre.ethers.utils;

const address = "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9";

async function lookup() {
  //eth_getStorageAt

  //   const value = await hre.ethers.provider.getStorageAt(address, "0x2");
  //   const key = hexZeroPad(4, 32);
  //   baseSlot = hexZeroPad(0x2, 32).slice(2);
  //   console.log(parseInt(key), baseSlot);
  //const slot = keccak256(key + baseSlot);
  //const value = await hre.ethers.provider.getStorageAt(address, slot);

  //   const slot = keccak256(toUtf8Bytes("robinpunn"));
  //   const value = await hre.ethers.provider.getStorageAt(address, slot);

  //   console.log(parseInt(value));

  const storage = await hre.ethers.getContractAt("Storage", address);

  // eth call
  await storage.check();
}

lookup();
