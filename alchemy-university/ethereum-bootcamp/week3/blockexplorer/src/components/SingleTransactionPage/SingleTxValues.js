import React from "react";
const { Utils } = require("alchemy-sdk");

const SingleTxValues = ({ singleTx, gasReceipt, ethereumPrice }) => {
  // {convertToNumber(blockInfo.gasLimit._hex)}
  // parseInt(gas, 16) / Math.pow(10, 11)
  console.log("string:", singleTx.value.toString() / 18);
  return (
    <div className="singletx-prices">
      {console.log("singleTX: ", singleTx)}
      <div className="singletx-value">
        <p className="title">Value: </p>
        <p className="value">
          {Utils.formatEther(singleTx.value)} ETH ($
          {(Utils.formatEther(singleTx.value) * ethereumPrice).toFixed(2)})
        </p>
      </div>
      <div className="singletx-fee">
        <p className="title">Gas Fee: </p>
        <p className="value">
          {Utils.formatUnits(
            singleTx.gasPrice.mul(gasReceipt.gasUsed),
            "ether"
          )}{" "}
          ETH ($
          {(
            Utils.formatUnits(
              singleTx.gasPrice.mul(gasReceipt.gasUsed),
              "ether"
            ) * ethereumPrice
          ).toFixed(2)}
          )
        </p>
      </div>
      <div className="singletx-price">
        <p className="title">Gas Price: </p>
        <p className="value">
          {Utils.formatUnits(singleTx.gasPrice, "gwei")} gwei (
          {Utils.formatUnits(singleTx.gasPrice, "ether")} ETH)
        </p>
      </div>
    </div>
  );
};

export default SingleTxValues;
