import { Alchemy, Network, AlchemySubscription } from "alchemy-sdk";
import { useEffect, useState } from "react";
import BlockNumber from "./components/BlockNumber";
import Transactions from "./components/Transactions";
import Gas from "./components/Gas";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [gas, setGas] = useState();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [blockNumber, gas] = await Promise.all([
        alchemy.core.getBlockNumber(),
        alchemy.core.getGasPrice(),
      ]);
      setBlockNumber(blockNumber);
      setGas(parseInt(gas, 16) / Math.pow(10, 11));
    }

    fetchData();
  }, []);

  useEffect(() => {
    async function getBlockTxNum() {
      if (blockNumber) {
        const block = await alchemy.core.getBlockWithTransactions(blockNumber);
        setTransactions(block.transactions);
      }
    }
    console.log(transactions);
    getBlockTxNum();
  }, [blockNumber]);

  return (
    <div className="App">
      <BlockNumber blockNumber={blockNumber} />
      <Gas gas={gas} />
      <Transactions transactions={transactions} />
    </div>
  );
}

export default App;
