import React from "react";

const Blocks = ({ blocks }) => {
  return (
    <div className="blocks-container">
      <div className="header">
        <h4>Latest Blocks</h4>
      </div>
      <div className="blocks">
        {blocks.map((block) => (
          <div className="block" key={block.number}>
            <div className="number">
              <p>Block: {block.number}</p>
            </div>
            <div className="fee-txns">
              <p>Fee: {block.baseFeePerGas.toString()}</p>
              <p>{block.transactions.length} txns</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blocks;
