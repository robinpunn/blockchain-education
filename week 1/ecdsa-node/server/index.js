const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const fs = require("fs");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

app.use(cors());
app.use(express.json());

let balances = {};
// if (fs.existsSync("balances.json")) {
//   balances = JSON.parse(fs.readFileSync("balances.json"));
// } else {
//   fs.writeFileSync("balances.json", JSON.stringify(balances));
// }

const recoverKey = async (message, signature, recoveryId) => {
  const sign = await signature;
  const recoveredPublicKey = await secp.recoverPublicKey(
    message,
    signature,
    recoveryId
  );
  return recoveredPublicKey;
};

const getAddress = (publicKey) =>
  toHex(keccak256(publicKey.slice(1)).slice(-20));

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", async (req, res) => {
  const { sender, recipient, amount, message, signature, recoveryId } =
    req.body;

  const publicKeyRecovered = await recoverKey(message, signature, recoveryId);
  const addressRecovered = getAddress(publicKeyRecovered);

  // if recoverPublicKey turned into an address matches the sender address
  if (addressRecovered === sender) {
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.send({ message: "signature failed" });
  }
});

app.post("/balances", (req, res) => {
  const { address, balance } = req.body;
  Object.keys(balances).forEach((key) => {
    balances[key] += 10;
  });
  balances[address] = balance;
  console.log(balances);
  res.send({ message: "Balance set successfully" });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
