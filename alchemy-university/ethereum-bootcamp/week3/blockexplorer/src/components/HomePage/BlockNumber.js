import React from "react";

const BlockNumber = ({ blockNumber }) => {
  return (
    <div className="current-block">
      <p>Current</p>
      <p>{blockNumber}</p>
    </div>
  );
};

export default BlockNumber;
