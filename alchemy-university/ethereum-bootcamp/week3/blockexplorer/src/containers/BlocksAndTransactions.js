import React from "react";
import Blocks from "../components/HomePage/Blocks";
import Transactions from "../components/HomePage/Transactions";
import "./BlocksAndTransactions.css";

const BlocksAndTransactions = ({
  transactions,
  blocks,
  onClickBlock,
  onClickTransaction,
  onClickAddress,
  onClickTransactionCount,
}) => {
  return (
    <div className="lower-container">
      <Blocks
        blocks={blocks}
        onClickTransactionCount={onClickTransactionCount}
        onClickBlock={onClickBlock}
        onClickAddress={onClickAddress}
      />
      <Transactions
        onClickTransaction={onClickTransaction}
        transactions={transactions}
        onClickAddress={onClickAddress}
      />
    </div>
  );
};

export default BlocksAndTransactions;
