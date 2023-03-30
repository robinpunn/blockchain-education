import React from "react";

const BlockTop = ({ finalizedBlock, safeBlock }) => {
  return (
    <div className="final-safe">
      <div className="final">
        <p>Last Finalized Block</p>
        <p>{finalizedBlock}</p>
      </div>
      <div className="safe">
        <p>Last Safe Block</p>
        <p>{safeBlock}</p>
      </div>
    </div>
  );
};

export default BlockTop;
