const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");

describe("Faucet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractAndSetVariables() {
    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy();

    const [owner, notOwner] = await ethers.getSigners();

    let withdrawAmount = ethers.utils.parseUnits("2", "ether");

    console.log("Signer 1 address: ", owner.address);
    return { faucet, owner, withdrawAmount, notOwner };
  }

  it("should deploy and set the owner correctly", async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await faucet.owner()).to.equal(owner.address);
  });
  it("should not allow withdrawals above .1 ETH at a time", async function () {
    const { faucet, withdrawAmount } = await loadFixture(
      deployContractAndSetVariables
    );

    await expect(faucet.withdraw(withdrawAmount)).to.be.reverted;
  });
  it("should only allow the owner to call withdrawAll()", async function () {
    const { faucet, owner, notOwner } = await loadFixture(
      deployContractAndSetVariables
    );

    await expect(faucet.connect(notOwner).withdrawAll()).to.be.reverted;

    await expect(faucet.connect(owner).withdrawAll()).to.not.be.reverted;
  });
  it("should only allow the owner to call destroyFaucet()", async function () {
    const { faucet, owner, notOwner } = await loadFixture(
      deployContractAndSetVariables
    );

    await expect(faucet.connect(notOwner).destroyFaucet()).to.be.reverted;

    await expect(faucet.connect(owner).destroyFaucet()).to.not.be.reverted;
  });
  it("should self destruct when destroyFaucet() is called by the owner", async function () {
    const { faucet, owner } = await loadFixture(deployContractAndSetVariables);

    expect(await ethers.provider.getCode(faucet.address)).to.not.equal("0x");

    await faucet.connect(owner).destroyFaucet();

    expect(await ethers.provider.getCode(faucet.address)).to.equal("0x");
  });
});
