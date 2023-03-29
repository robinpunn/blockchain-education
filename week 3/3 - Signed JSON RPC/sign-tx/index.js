const { Alchemy, Network, Wallet, Utils } = require("alchemy-sdk");
require("dotenv").config();

const { TEST_API_KEY, TEST_PRIVATE_KEY } = process.env;

const settings = {
  apiKey: TEST_API_KEY,
  network: Network.ETH_GOERLI,
};
const alchemy = new Alchemy(settings);

let wallet = new Wallet(TEST_PRIVATE_KEY);

let mine = "0x7814b4cee7fb171d08686d86a18fecce39eea573";
let gasLimit = "21000";

async function main() {
  const nonce = await alchemy.core.getTransactionCount(
    wallet.address,
    "latest"
  );

  let transaction = {
    to: "0x189fEC77aD177d9463CB6B186b8dc1607EbD07AB",
    value: Utils.parseEther("0.25"), // 0.001 worth of ETH being sent
    gasLimit: "84000",
    maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
    maxFeePerGas: Utils.parseUnits("20", "gwei"),
    nonce: nonce,
    type: 2,
    chainId: 5, // göerli transaction
  };

  let rawTransaction = await wallet.signTransaction(transaction);
  console.log("Raw tx: ", rawTransaction);
  let tx = await alchemy.core.sendTransaction(rawTransaction);
  console.log(`https://goerli.etherscan.io/tx/${tx.hash}`);
}

main();
