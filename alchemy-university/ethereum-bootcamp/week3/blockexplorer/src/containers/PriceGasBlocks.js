import React from "react";
import Price from "../components/HomePage/Price";
import Gas from "../components/HomePage/Gas";
import BlockNumber from "../components/HomePage/BlockNumber";
import Marketcap from "../components/HomePage/Marketcap";
import Final from "../components/HomePage/Final";
import Safe from "../components/HomePage/Safe";
import "./PriceGasBlocks.css";

const PriceGasBlocks = ({
  ethereumPrice,
  marketCap,
  gas,
  blockNumber,
  finalizedBlock,
  safeBlock,
  onClickBlock,
}) => {
  let displayBlockNumber = blockNumber;
  if (typeof blockNumber === "string" && blockNumber.startsWith("0x")) {
    displayBlockNumber = parseInt(blockNumber, 16);
  }
  return (
    <div className="upper-container">
      <div className="price-gas-cap">
        <div className="price-gas">
          <Price ethereumPrice={ethereumPrice} />
          <Gas gas={gas} />
        </div>
        <Marketcap marketCap={marketCap} />
      </div>
      <div className="upper-blocks">
        <div className="final-safe">
          <Final finalizedBlock={finalizedBlock} onClickBlock={onClickBlock} />
          <Safe safeBlock={safeBlock} onClickBlock={onClickBlock} />
        </div>
        {blockNumber ? (
          <BlockNumber
            blockNumber={displayBlockNumber}
            onClickBlock={onClickBlock}
          />
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default PriceGasBlocks;
