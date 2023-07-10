import React from "react";

const Safe = ({ safeBlock, onClickBlock }) => {
  console.log("safe:", safeBlock);
  const handleClick = (block) => {
    onClickBlock(block);
  };
  return (
    <div className="safe">
      <p>Safe</p>
      <p>{safeBlock}</p>
    </div>
  );
};

export default Safe;
