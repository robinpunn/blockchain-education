import React from "react";

const Bot = ({ blockInfo }) => {
  return (
    <div className="block-info-bot">
      <p className="title">Transactions:</p>
      <p className="value">{blockInfo.transactions.length} transactions</p>
    </div>
  );
};

export default Bot;
