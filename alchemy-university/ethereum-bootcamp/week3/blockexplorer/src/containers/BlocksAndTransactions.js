import React from "react";
import Blocks from "../components/HomePage/Blocks";
import Transactions from "../components/HomePage/Transactions";
import "./BlocksAndTransactions.css";

const BlocksAndTransactions = ({
  transactions,
  blocks,
  onClickBlock,
  onClickAddress,
}) => {
  return (
    <div className="lower-container">
      <Blocks blocks={blocks} onClickBlock={onClickBlock} />
      <Transactions
        transactions={transactions}
        onClickAddress={onClickAddress}
      />
    </div>
  );
};

export default BlocksAndTransactions;
