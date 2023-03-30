import React from "react";
import Price from "../components/Price";
import Gas from "../components/Gas";
import BlockNumber from "../components/BlockNumber";
import Marketcap from "../components/Marketcap";
import BlockTop from "../components/BlockTop";

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
