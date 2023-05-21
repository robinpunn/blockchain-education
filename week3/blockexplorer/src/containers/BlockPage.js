import React from "react";
import Input from "../components/HomePage/Input";
import BlockHashTime from "../components/BlockPage/BlockHashTime";
import BlockFeeGas from "../components/BlockPage/BlockFeeGas";
import BlockTxs from "../components/BlockPage/BlockTxs";
import "./BlockPage.css";

const BlockPage = ({ blockInfo, onClickTransactionCount }) => {
  console.log("blockPage:", blockInfo);
  return (
    <>
      <Input />
      <div className="block-page">
        <div className="block-head">
          <h3>Block {blockInfo.number}</h3>
        </div>
        <BlockHashTime blockInfo={blockInfo} />
        <BlockFeeGas blockInfo={blockInfo} />
        <BlockTxs
          blockInfo={blockInfo}
          onClickTransactionCount={onClickTransactionCount}
        />
      </div>
    </>
  );
};

export default BlockPage;
