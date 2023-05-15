import React from "react";

const Bot = ({ blockInfo }) => {
  return (
    <div className="block-info-bot">
      <p className="bot-txs">Transactions:</p>
      <p className="bot-txs-lenth">
        {blockInfo.transactions.length} transactions
      </p>
    </div>
  );
};

export default Bot;
