import React from "react";

const Price = ({ ethereumPrice }) => {
  return (
    <div className="price">
      <p>Ether</p>
      <p>${ethereumPrice}</p>
    </div>
  );
};

export default Price;
