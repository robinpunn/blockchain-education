import React from "react";
import "./BlockTransactions.css";

const BlockTransactions = ({ transactionReceipts }) => {
  console.log(transactionReceipts);
  return (
    <div className="block-transactions">
      <table>
        <thead>
          <tr>
            <th>Txn Hash</th>
            <th>Block Number</th>
            <th>To</th>
            <th>From</th>
            <th>Gas Fees</th>
          </tr>
        </thead>
        <tbody>
          {transactionReceipts.map((receipt) => (
            <tr key={receipt.transactionHash}>
              <td>{receipt.transactionHash}</td>
              <td>{receipt.blockNumber}</td>
              <td>{receipt.to}</td>
              <td>{receipt.from}</td>
              <td>{receipt.gasUsed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlockTransactions;
