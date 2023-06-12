import React from "react";
import "./BlockTransactions.css";

const BlockTransactions = ({
  transactionReceipts,
  onClickTransaction,
  onClickAddress,
}) => {
  //   console.log(transactionReceipts);
  const transactionClick = (txHash) => {
    onClickTransaction(txHash);
  };
  const addressClick = (address) => {
    onClickAddress(address);
  };
  return (
    <div className="block-transactions">
      <table className="block-table">
        <thead className="block-head">
          <tr>
            <th>Txn Hash</th>
            <th>Block Number</th>
            <th>To</th>
            <th>From</th>
            <th>Gas Fees</th>
          </tr>
        </thead>
        <tbody className="block-body">
          {transactionReceipts.map((receipt) => (
            <tr key={receipt.transactionHash}>
              <td onClick={() => transactionClick(receipt.transactionHash)}>
                {receipt.transactionHash}
              </td>
              <td>{receipt.blockNumber}</td>
              <td onClick={() => addressClick(receipt.to)}>{receipt.to}</td>
              <td onClick={() => addressClick(receipt.from)}>{receipt.from}</td>
              <td>{receipt.gasUsed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlockTransactions;
