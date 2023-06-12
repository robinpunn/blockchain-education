import React from "react";
import "./Input.css";

const Input = ({ onClickHome }) => {
  const homeClick = () => {
    onClickHome();
  };
  return (
    <div className="input">
      <h4 onClick={homeClick}>THE ETHEREUM BLOCKCHAIN EXPLORER</h4>
      <input
        className="search"
        type="text"
        placeholder="Enter address/transaction..."
      />
    </div>
  );
};

export default Input;
