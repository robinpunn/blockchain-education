import React from "react";

const Final = ({ finalizedBlock }) => {
  return (
    <div className="final">
      <p>Finalized</p>
      <p>{finalizedBlock}</p>
    </div>
  );
};

export default Final;
