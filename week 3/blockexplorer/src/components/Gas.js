import React from "react";

const Gas = ({ gas }) => {
  return (
    <div className="gas">
      <p>Gas</p>
      <p>{Math.floor(gas)} gwei</p>
    </div>
  );
};

export default Gas;
