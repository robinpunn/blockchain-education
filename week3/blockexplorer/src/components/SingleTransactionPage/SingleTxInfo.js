import React from "react";

const SingleTxInfo = ({ singleTx }) => {
  console.log("singlePage:", singleTx);
  return (
    <div className="singletx-info">
      <div className="singletx-hash">
        <p className="title">Tx Hash: </p>
        <p className="value">{singleTx.hash}</p>
      </div>
      <div className="singletx-block">
        <p className="title">Block Number:</p>
        <p className="value">{singleTx.blockNumber}</p>
      </div>
      <div className="singletx-confirmations">
        <p className="title">Confirmations:</p>
        <p className="value">{singleTx.confirmations}</p>
      </div>
    </div>
  );
};

export default SingleTxInfo;
