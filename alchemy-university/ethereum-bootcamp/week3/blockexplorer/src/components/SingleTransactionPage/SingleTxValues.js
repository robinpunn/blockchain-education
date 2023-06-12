import React from "react";
const { Utils } = require("alchemy-sdk");

const SingleTxValues = ({ singleTx, gasReceipt }) => {
  // {convertToNumber(blockInfo.gasLimit._hex)}
  // parseInt(gas, 16) / Math.pow(10, 11)
  return (
    <div className="singletx-prices">
      <div className="singletx-value">
        <p className="title">Value: </p>
        <p className="value">{Utils.formatUnits(singleTx.value, "ether")}</p>
      </div>
      <div className="singletx-fee">
        <p className="title">Gas Fee: </p>
        <p className="value">
          {Utils.formatUnits(
            singleTx.gasPrice.mul(gasReceipt.gasUsed),
            "ether"
          )}
        </p>
      </div>
      <div className="singletx-fee">
        <p className="title">Gas Price: </p>
        <p className="value">{Utils.formatUnits(singleTx.gasPrice, "gwei")}</p>
      </div>
    </div>
  );
};

export default SingleTxValues;
