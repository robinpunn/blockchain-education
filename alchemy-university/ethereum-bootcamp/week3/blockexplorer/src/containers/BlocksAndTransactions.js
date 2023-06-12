import React from "react";
import Blocks from "../components/HomePage/Blocks";
import Transactions from "../components/HomePage/Transactions";
import "./BlocksAndTransactions.css";

const BlocksAndTransactions = ({ transactions, blocks, onClickBlock }) => {
  return (
    <div className="lower-container">
      <Blocks blocks={blocks} onClickBlock={onClickBlock} />
      <Transactions transactions={transactions} />
    </div>
  );
};

export default BlocksAndTransactions;
