const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");
const { assert } = require("chai");

describe("Game5", function () {
  async function deployContractAndSetVariables() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();

    return { game };
  }

  //create a function using a while lopp that will create a wallet below the threshold and send it 1 either
  async function createWalletBelowThreshold() {
    const threshold = "0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf";
    let wallet = ethers.Wallet.createRandom();
    while (wallet.address > threshold) {
      wallet = ethers.Wallet.createRandom();
    }
    const provider = ethers.getDefaultProvider();
    const winner = ethers.Wallet.createRandom();
    const winnerWallet = new ethers.Wallet(winner.privateKey, provider);
    await winnerWallet.sendTransaction({
      to: wallet.address,
      value: ethers.utils.parseEther("1.0"),
    });
    return wallet;
  }

  it("should be a winner", async function () {
    const { game } = await loadFixture(deployContractAndSetVariables);
    const winner = await createWalletBelowThreshold();

    await game.connect(winner).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
