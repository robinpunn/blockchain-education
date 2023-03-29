import { Alchemy, Network, AlchemySubscription } from "alchemy-sdk";
import { useEffect, useState } from "react";
import BlockNumber from "./components/BlockNumber";
import Transactions from "./components/Transactions";
import Blocks from "./components/Blocks";
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
  const [blocks, setBlocks] = useState([]);

  async function fetchBlocks() {
    const result = await alchemy.core.getBlockNumber().then((latestBlock) => {
      const blockPromises = [];
      for (let i = 0; i < 10; i++) {
        const blockNumber = latestBlock - i;
        const blockPromise = alchemy.core.getBlock(blockNumber);
        blockPromises.push(blockPromise);
      }
      return Promise.all(blockPromises);
    });
    setBlocks(result);
    console.log("blocks", blocks);
  }

  useEffect(() => {
    fetchBlocks();
  }, []);

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
        // console.log(block);
        setTransactions(block.transactions);
      }
    }
    // console.log(transactions);
    getBlockTxNum();
  }, [blockNumber]);

  return (
    <div className="App">
      <BlockNumber blockNumber={blockNumber} />
      <Gas gas={gas} />
      <Blocks blocks={blocks} />
      <Transactions transactions={transactions} />
    </div>
  );
}

export default App;
