import React from "react";

const BlockTxs = ({ blockInfo, onClickTransactionCount }) => {
  const handleClick = (block) => {
    onClickTransactionCount(block);
  };
  return (
    <div className="block-info-bot">
      <p className="title">Transactions:</p>
      <p
        onClick={() => handleClick(blockInfo.hash)}
        className="value block-transactions-length"
      >
        {blockInfo.transactions.length} transactions
      </p>
    </div>
  );
};

export default BlockTxs;
