import React from "react";

const Blocks = ({
  blocks,
  onClickBlock,
  onClickAddress,
  onClickTransactionCount,
}) => {
  const handleClickBlock = (block) => {
    onClickBlock(block);
  };
  const handleClickAddress = (address) => {
    onClickAddress(address);
  };
  const handleClickTx = (tx) => {
    onClickTransactionCount(tx);
  };
  return (
    <div className="blocks-container">
      <div className="header">
        <h4>Latest Blocks</h4>
      </div>
      <div className="blocks">
        {blocks.map((block) => (
          <div className="block" key={block.number}>
            <div className="number">
              <p>
                {" "}
                Block:{" "}
                <span onClick={() => handleClickBlock(block)}>
                  {block.number}
                </span>
              </p>
            </div>
            <div className="fee-txns">
              <p>
                Miner:{" "}
                <span onClick={() => handleClickAddress(block.miner)}>
                  {block.miner.substring(0, 5)}...
                </span>
              </p>
              <p>
                {" "}
                <span onClick={() => handleClickTx(block.transactions)}>
                  {block.transactions.length} txns
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blocks;
