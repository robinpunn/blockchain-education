import React from "react";
import Blocks from "../components/HomePage/Blocks";
import Transactions from "../components/HomePage/Transactions";

const BlocksAndTransactions = ({ transactions, blocks }) => {
  return (
    <div className="lower-container">
      <Blocks blocks={blocks} />
      <Transactions transactions={transactions} />
    </div>
  );
};

export default BlocksAndTransactions;
