import React from "react";
import Blocks from "../components/Blocks";
import Transactions from "../components/Transactions";

const BlocksAndTransactions = ({ transactions, blocks }) => {
  return (
    <div className="lower-container">
      <Blocks blocks={blocks} />
      <Transactions transactions={transactions} />
    </div>
  );
};

export default BlocksAndTransactions;
