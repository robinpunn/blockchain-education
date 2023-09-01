import { expect } from "chai";
import { ethers } from "hardhat";

describe("GuessTheSecretNumberChallenge", () => {
  it("Solves the challenge", async () => {
    const factory = await ethers.getContractFactory(
      "GuessTheSecretNumberChallenge"
    );
    const contract = await factory.deploy({ value: ethers.parseEther("1") });
    await contract.waitForDeployment();

    const answerHash =
      "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365";
    let secretNumber;
    for (let i = 0; i <= 255; i++) {
      const numberBytes = ethers.toBeHex(i);
      const hash = ethers.keccak256(numberBytes);
      if (answerHash === hash) {
        secretNumber = i;
        console.log(`The secret number is ${secretNumber}`);
        break;
      }
    }
    if (secretNumber === undefined) {
      throw new Error("The secret number could not be found");
    }

    const tx = await contract.guess(secretNumber, {
      value: ethers.parseEther("1"),
    });
    await tx.wait();

    expect(await contract.isComplete()).to.be.true;
  });
});
