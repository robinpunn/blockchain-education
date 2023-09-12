import { expect } from "chai";
import crypto from "crypto";
import { ethers } from "hardhat";

function getWallet() {
  let wallet;
  let foundWallet = undefined;
  let contractAddress;
  let counter = 0;
  let privateKey;
  while (!foundWallet) {
    privateKey = `0x${crypto.randomBytes(32).toString("hex")}`;
    wallet = new ethers.Wallet(privateKey);

    contractAddress = ethers.getCreateAddress({
      from: wallet.address,
      nonce: BigInt("0"), // First deployed contract with this address
    });

    if (contractAddress.toLowerCase().includes("badc0de")) {
      console.log("found", privateKey);
      foundWallet = wallet;
      return wallet;
    }

    counter++;
    if (counter % 1000 === 0) {
      console.log(`checked ${counter} addresses`);
    }
  }
}

// getWallet(); found key: 0xd687013e4119cc6037354d8091c5faa08ccde7b580d462bc6b7d12205d714088

describe("FuzzyIdentityChallenge", () => {
  it("Solves the challenge", async () => {
    // deploy challenge contract
    const contract = await ethers.deployContract("FuzzyIdentityChallenge");
    await contract.waitForDeployment;

    // get owner
    const [owner] = await ethers.getSigners();

    // const wallet = getWallet();
    const wallet = new ethers.Wallet(
      "0xd687013e4119cc6037354d8091c5faa08ccde7b580d462bc6b7d12205d714088",
      owner.provider
    );

    // send eth to wallet
    let tx;
    tx = await owner.sendTransaction({
      to: wallet.address,
      value: ethers.parseEther("0.1"),
    });
    await tx.wait();

    // deploy solve contract
    const solveFactory = await ethers.getContractFactory("FuzzyIdentitySolver");
    const solveContract = await solveFactory
      .connect(wallet)
      .deploy(contract.target);
    await solveContract.waitForDeployment();

    // call attack function on solve contract
    tx = await solveContract.attack();
    await tx.wait();

    expect(await contract.isComplete()).to.be.true;
  });
});
