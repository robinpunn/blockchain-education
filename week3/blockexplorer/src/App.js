import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import "./App.css";
import Input from "./components/HomePage/Input";
import PriceGasBlocks from "./containers/PriceGasBlocks";
import BlocksAndTransactions from "./containers/BlocksAndTransactions";
import BlockPage from "./containers/BlockPage";
import BlockTransactions from "./containers/BlockTransactions";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [finalizedBlock, setFinalizedBlock] = useState();
  const [safeBlock, setSafeBlock] = useState();
  const [gas, setGas] = useState();
  const [transactions, setTransactions] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [ethereumPrice, setEthereumPrice] = useState(null);
  const [marketCap, setMarketCap] = useState(null);
  const [page, setPage] = useState("home");
  const [blockInfo, setBlockinfo] = useState(null);
  const [transactionReceipts, setTransactionReceipts] = useState([]);

  useEffect(() => {
    console.log("Fetching Ethereum Price...");
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
        );
        const data = await response.json();
        setEthereumPrice(data.market_data.current_price.usd);
        setMarketCap(data.market_data.market_cap.usd);
        // console.log("Ethereum Price:", ethereumPrice, "Market Cap:", marketCap);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    async function fetchBlocks() {
      const latestBlock = await alchemy.core.getBlockNumber();

      const blockPromises = [];
      for (let i = 0; i < 10; i++) {
        const blockNumber = latestBlock - i;
        const blockPromise = alchemy.core.getBlock(blockNumber);
        blockPromises.push(blockPromise);
      }

      const blocks = await Promise.all(blockPromises);
      const finalizedBlock = await alchemy.core
        .getBlock(latestBlock)
        .then((res) => res.number);
      const safeBlock = await alchemy.core
        .getBlock(latestBlock - 10)
        .then((res) => res.number);

      setBlocks(blocks);
      setFinalizedBlock(finalizedBlock);
      setSafeBlock(safeBlock);

      console.log(
        "blocks",
        blocks,
        "finalized",
        finalizedBlock,
        "safe",
        safeBlock
      );
    }
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

  useEffect(() => {
    const fetchTransactionReceipts = async () => {
      try {
        const params = {
          blockHash: blockInfo?.hash,
        };
        const response = await alchemy.core.getTransactionReceipts(params);
        setTransactionReceipts(response.receipts);
        console.log("Transaction Receipts:", response.receipts);
      } catch (error) {
        console.log("Error fetching transaction receipts:", error);
      }
    };

    if (blockInfo) {
      fetchTransactionReceipts();
    }
  }, [blockInfo]);

  // const navigateToHome = () => {
  //   setPage("home");
  // };

  const navigateToBlockPage = (block) => {
    setPage("blockPage");
    setBlockinfo(block);
  };

  const navigateToBlockTransactions = (blockNumber) => {
    setBlockNumber(blockNumber);
    setPage("blockTransactions");
  };

  return (
    <div className="App">
      {page === "home" && (
        <>
          <Input />
          <PriceGasBlocks
            ethereumPrice={ethereumPrice}
            marketCap={marketCap}
            gas={gas}
            blockNumber={blockNumber}
            finalizedBlock={finalizedBlock}
            safeBlock={safeBlock}
          />
          <BlocksAndTransactions
            blocks={blocks}
            transactions={transactions}
            onClickBlock={navigateToBlockPage}
          />
        </>
      )}
      {page === "blockPage" && (
        <>
          <BlockPage
            blockInfo={blockInfo}
            onClickTransactionCount={navigateToBlockTransactions}
          />
        </>
      )}
      {page === "blockTransactions" && (
        <>
          <BlockTransactions transactionReceipts={transactionReceipts} />
        </>
      )}
    </div>
  );
}

export default App;
