import React from "react";

const Top = ({ blockInfo }) => {
  return (
    <div className="block-info-top">
      <div className="blocktop-hash">
        <p>Hash:</p>
        <p>{blockInfo.hash}</p>
      </div>
      <div className="blocktop-parent-hash">
        <p>Parent Hash:</p>
        <p>{blockInfo.parentHash}</p>
      </div>
      <div className="blocktop-timestamp">
        <p>Timestamp: </p>
        <p>{blockInfo.timestamp}</p>
      </div>
    </div>
  );
};

export default Top;
