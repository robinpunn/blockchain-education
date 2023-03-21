const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const fs = require("fs");

app.use(cors());
app.use(express.json());

let balances = {};
if (fs.existsSync("balances.json")) {
  balances = JSON.parse(fs.readFileSync("balances.json"));
} else {
  fs.writeFileSync("balances.json", JSON.stringify(balances));
}

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.post("/balances", (req, res) => {
  const { address, balance } = req.body;
  balances[address] = balance;
  console.log("got it");
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
