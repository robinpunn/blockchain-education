import React from "react";
import "./Input.css";

const Input = () => {
  return (
    <div className="input">
      <h4>THE ETHEREUM BLOCKCHAIN EXPLORER</h4>
      <input
        className="search"
        type="text"
        placeholder="Enter address/transaction..."
      />
    </div>
  );
};

export default Input;
