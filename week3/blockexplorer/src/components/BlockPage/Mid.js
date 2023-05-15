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
        <p className="fee-recipient">Fee Recipient: </p>
        <p className="fee-miner">{blockInfo.miner}</p>
      </div>
      <div className="gas-used-limit">
        <div className="gas-used">
          <p>Gas Used:</p>
          <p>{convertToNumber(blockInfo.gasUsed._hex)}</p>
        </div>
        <div className="gas-limit">
          <p>Gas Limit:</p>
          <p>{convertToNumber(blockInfo.gasLimit._hex)}</p>
        </div>
      </div>
    </div>
  );
};

export default Mid;
