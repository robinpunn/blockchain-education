import React from "react";

const BlockHashTime = ({ blockInfo }) => {
  return (
    <div className="block-info-top">
      <div className="blocktop-hash">
        <p className="title">Hash:</p>
        <p className="value">{blockInfo.hash}</p>
      </div>
      <div className="blocktop-parent-hash">
        <p className="title">Parent Hash:</p>
        <p className="value">{blockInfo.parentHash}</p>
      </div>
      <div className="blocktop-timestamp">
        <p className="title">Timestamp: </p>
        <p className="value">{blockInfo.timestamp}</p>
      </div>
    </div>
  );
};

export default BlockHashTime;
