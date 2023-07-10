import React from "react";
import "./BlockTransactions.css";
const { Utils } = require("alchemy-sdk");

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
          <tr className="block-head-row">
            <th className="block-head-value block-head-hash">Txn Hash</th>
            <th className="block-head-value block-head-number">Block</th>
            <th className="block-head-value block-head-from">From</th>
            <th className="block-head-value block-head-to">To</th>
            <th className="block-head-value block-head-gas">Gas Fees</th>
          </tr>
        </thead>
        <tbody className="block-body">
          {transactionReceipts.map((receipt) => (
            <tr className="block-body-row" key={receipt.transactionHash}>
              <td
                className="block-body-value block-body-hash"
                onClick={() => transactionClick(receipt.transactionHash)}
              >
                {receipt.transactionHash.substring(0, 15)}...
              </td>
              <td className="block-body-value block-body-number">
                {parseInt(receipt.blockNumber, 16)}
              </td>
              <td
                className="block-body-value block-body-from"
                onClick={() => addressClick(receipt.from)}
              >
                {receipt.from.substring(0, 15)}...
              </td>
              <td
                className="block-body-value block-body-to"
                onClick={() => addressClick(receipt.to)}
              >
                {receipt.to.substring(0, 15)}...
              </td>
              <td className="block-body-value block-body-gas">
                {Utils.formatUnits(receipt.gasUsed, "gwei")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlockTransactions;
