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
}) => {
  console.log("price:", ethereumPrice, "cap:", marketCap);
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
          <Final finalizedBlock={finalizedBlock} />
          <Safe safeBlock={safeBlock} />
        </div>
        <BlockNumber blockNumber={blockNumber} />
      </div>
    </div>
  );
};

export default PriceGasBlocks;
