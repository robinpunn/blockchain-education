import React from "react";

const SingleTxParties = ({ singleTx, onClickAddress }) => {
  const addressClick = (address) => {
    onClickAddress(address);
  };
  return (
    <div className="singletx-parties">
      <div className="singletx-hash-to">
        <p className="title">To: </p>
        <p onClick={() => addressClick(singleTx.to)} className="value">
          {singleTx.to}
        </p>
      </div>
      <div className="singletx-hash-from">
        <p className="title">From: </p>
        <p onClick={() => addressClick(singleTx.from)} className="value">
          {singleTx.from}
        </p>
      </div>
    </div>
  );
};

export default SingleTxParties;
