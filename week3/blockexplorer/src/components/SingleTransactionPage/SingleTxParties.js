import React from "react";

const SingleTxParties = ({ singleTx }) => {
  return (
    <div className="singletx-parties">
      <div className="singletx-hash-to">
        <p className="title">To: </p>
        <p className="value">{singleTx.to}</p>
      </div>
      <div className="singletx-hash-from">
        <p className="title">From: </p>
        <p className="value">{singleTx.from}</p>
      </div>
    </div>
  );
};

export default SingleTxParties;
