import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import "./App.css";
import Input from "./components/HomePage/Input";
import PriceGasBlocks from "./containers/PriceGasBlocks";
import BlocksAndTransactions from "./containers/BlocksAndTransactions";
import BlockPage from "./containers/BlockPage";
import BlockTransactions from "./containers/BlockTransactions";
import SingleTransaction from "./containers/SingleTransaction";
import ViewAddress from "./containers/Address";

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
  const [transactionHash, setTransactionHash] = useState(null);
  const [viewAddress, setViewAddress] = useState(null);

  const fetchHomeData = async () => {
    try {
      // Fetch Ethereum Price
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/ethereum?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false"
      );
      const data = await response.json();
      setEthereumPrice(data.market_data.current_price.usd);
      setMarketCap(data.market_data.market_cap.usd);

      // Fetch Blocks
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

      // Fetch Block Number and Gas Price
      const [blockNumber, gas] = await Promise.all([
        alchemy.core.getBlockNumber(),
        alchemy.core.getGasPrice(),
      ]);
      setBlockNumber(blockNumber);
      setGas(parseInt(gas, 16) / Math.pow(10, 11));

      // Fetch Block Transactions
      if (blockNumber) {
        const block = await alchemy.core.getBlockWithTransactions(blockNumber);
        setTransactions(block.transactions);
      }

      console.log("Data fetched successfully!");
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchHomeData();
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

  const navigateToHome = () => {
    setPage("home");
    fetchHomeData();
  };

  const navigateToBlockPage = (block) => {
    setPage("blockPage");
    setBlockinfo(block);
  };

  const navigateToBlockTransactions = (blockNumber) => {
    setBlockNumber(blockNumber);
    setPage("blockTransactions");
  };

  const navigateToSingleTransaction = (hash) => {
    setTransactionHash(hash);
    setPage("singleTransaction");
  };

  const navigateToAddress = (address) => {
    setViewAddress(address);
    setPage("viewAddress");
  };

  return (
    <div className="App">
      <>
        <Input onClickHome={navigateToHome} />
        {page === "home" && (
          <>
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
              onClickAddress={navigateToAddress}
            />
          </>
        )}
      </>
      {page === "blockPage" && (
        <>
          <BlockPage
            blockInfo={blockInfo}
            onClickTransactionCount={navigateToBlockTransactions}
            onClickAddress={navigateToAddress}
          />
        </>
      )}
      {page === "blockTransactions" && (
        <>
          <BlockTransactions
            transactionReceipts={transactionReceipts}
            onClickTransaction={navigateToSingleTransaction}
            onClickAddress={navigateToAddress}
          />
        </>
      )}
      {page === "singleTransaction" && (
        <>
          <SingleTransaction
            transactionHash={transactionHash}
            onClickAddress={navigateToAddress}
            ethereumPrice={ethereumPrice}
          />
        </>
      )}
      {page === "viewAddress" && (
        <>
          <ViewAddress
            viewAddress={viewAddress}
            ethereumPrice={ethereumPrice}
          />
        </>
      )}
    </div>
  );
}

export default App;
