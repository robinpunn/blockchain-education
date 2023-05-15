import React from "react";
const { Utils } = require("alchemy-sdk");

const Mid = ({ blockInfo }) => {
  const convertToNumber = (gas) => {
    const decimalValue = Utils.formatUnits(gas, 0);
    return decimalValue;
  };
  return (
    <div className="block-info-mid">
      <div className="fee">
        <p className="title">Fee Recipient: </p>
        <p className="value">{blockInfo.miner}</p>
      </div>
      <div className="gas-used">
        <p className="title">Gas Used:</p>
        <p className="value">{convertToNumber(blockInfo.gasUsed._hex)}</p>
      </div>
      <div className="gas-limit">
        <p className="title">Gas Limit:</p>
        <p className="value">{convertToNumber(blockInfo.gasLimit._hex)}</p>
      </div>
    </div>
  );
};

export default Mid;
