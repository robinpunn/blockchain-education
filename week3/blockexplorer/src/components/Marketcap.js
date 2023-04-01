import React from "react";

const Marketcap = ({ marketCap }) => {
  return (
    <div className="marketcap">
      <p>Market Cap</p>
      <p>{marketCap}</p>
    </div>
  );
};

export default Marketcap;
