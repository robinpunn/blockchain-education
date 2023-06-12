const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Proxy", function () {
  async function deployFixture() {
    const Proxy = await ethers.getContractFactory("Proxy");
    const proxy = await Proxy.deploy();

    const Logic1 = await ethers.getContractFactory("Logic1");
    const logic1 = await Logic1.deploy();

    const Logic2 = await ethers.getContractFactory("Logic2");
    const logic2 = await Logic2.deploy();

    const proxyAsLogic1 = await ethers.getContractAt("Logic1", proxy.address);
    const proxyAsLogic2 = await ethers.getContractAt("Logic2", proxy.address);

    return { proxy, proxyAsLogic1, proxyAsLogic2, logic1, logic2 };
  }

  // eth_getStorageAt

  async function lookupUint(contractAddr, slot) {
    return parseInt(await ethers.provider.getStorageAt(contractAddr, slot));
  }

  it("should work with logic1", async function () {
    const { proxy, proxyAsLogic1, logic1 } = await loadFixture(deployFixture);

    await proxy.changeImplementation(logic1.address);

    assert.equal(await lookupUint(proxy.address, "0x0"), 0);

    await proxyAsLogic1.changeX(52);

    assert.equal(await lookupUint(proxy.address, "0x0"), 52);
  });

  it("should work with upgrades", async function () {
    const { proxy, proxyAsLogic1, proxyAsLogic2, logic1, logic2 } =
      await loadFixture(deployFixture);

    // START AT LOGIC 1
    await proxy.changeImplementation(logic1.address);

    assert.equal(await lookupUint(proxy.address, "0x0"), 0);

    await proxyAsLogic1.changeX(45);

    assert.equal(await lookupUint(proxy.address, "0x0"), 45);

    // UPGRADE TO LOGIC 2
    await proxy.changeImplementation(logic2.address);

    assert.equal(await lookupUint(proxy.address, "0x0"), 45);

    // await proxyAsLogic2.changeX(79);
    await proxyAsLogic2.tripleX();

    assert.equal(await lookupUint(proxy.address, "0x0"), 135);
  });
});
