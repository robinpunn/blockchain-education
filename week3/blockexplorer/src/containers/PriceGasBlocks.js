import React from "react";
import Price from "../components/HomePage/Price";
import Gas from "../components/HomePage/Gas";
import BlockNumber from "../components/HomePage/BlockNumber";
import Marketcap from "../components/HomePage/Marketcap";
import BlockTop from "../components/HomePage/BlockTop";
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
        <BlockTop finalizedBlock={finalizedBlock} safeBlock={safeBlock} />
        <BlockNumber blockNumber={blockNumber} />
      </div>
    </div>
  );
};

export default PriceGasBlocks;
