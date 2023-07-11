const { expect } = require("chai");
const hre = require("hardhat");

describe("Attack", () => {
  it("Should empty the balance of the Good Contract", async () => {
    // Deploy the Good Contract
    const goodContract = await hre.ethers.deployContract("GoodContract", []);
    await goodContract.waitForDeployment();

    // Deploy the Bad Contract
    const badContract = await hre.ethers.deployContract("BadContract", [
      goodContract.target,
    ]);
    await badContract.waitForDeployment();

    // Get two addresses. Treat one as innocent user and the other as attacker
    const [_, innocentUser, attacker] = await hre.ethers.getSigners();

    // First value to deposit (10 ETH)
    const firstDeposit = hre.ethers.parseEther("10");

    // Innocent User deposits 10 ETH into GoodContract
    const goodTxn = await goodContract.connect(innocentUser).addBalance({
      value: firstDeposit,
    });

    // Wait the transaction complete
    await goodTxn.wait();

    // Check that at this point the GoodContract's balance is 10 ETH
    let goodContractBalance = await hre.ethers.provider.getBalance(
      goodContract.target
    );
    expect(goodContractBalance).to.equal(firstDeposit);

    // Attacker calls the `attack` function on BadContract and sends 1 ETH
    const attackTxn = await badContract.connect(attacker).attack({
      value: hre.ethers.parseEther("1"),
    });

    // Wait the transaction complete
    await attackTxn.wait();

    // Balance of the GoodContract's address is now zero
    goodContractBalance = await hre.ethers.provider.getBalance(
      goodContract.target
    );
    expect(goodContractBalance).to.equal(BigInt("0"));

    // Balance of BadContract is now 11 ETH (10 ETH stolen + 1 ETH from attacker)
    const badContractBalance = await hre.ethers.provider.getBalance(
      badContract.target
    );
    expect(badContractBalance).to.equal(hre.ethers.parseEther("11"));
  });
});
