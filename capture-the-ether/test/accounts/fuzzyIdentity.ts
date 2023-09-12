import { expect } from "chai";
import crypto from "crypto";
import { ethers } from "hardhat";

function getWallet() {
  let wallet;
  let contractAddress;
  let counter = 0;
  let privateKey;
  while (1) {
    privateKey = `0x${crypto.randomBytes(32).toString("hex")}`;
    wallet = new ethers.Wallet(privateKey);

    contractAddress = ethers.getCreateAddress({
      from: wallet.address,
      nonce: BigInt("0"), // First deployed contract with this address
    });

    if (contractAddress.toLowerCase().includes("badc0de")) {
      console.log("found", privateKey);
      return wallet;
    }

    counter++;
    if (counter % 1000 === 0) {
      console.log(`checked ${counter} addresses`);
    }
  }
}

getWallet();
