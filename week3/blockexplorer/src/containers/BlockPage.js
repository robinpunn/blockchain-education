import React from "react";

const BlockPage = ({ blockInfo }) => {
  return (
    <div className="block-page">
      <div className="block-head">
        <h3>Block</h3>
      </div>
      <div className="block-info-top">
        <p>
          Block Height: <span>17161688</span>
        </p>
        <p>
          Status: <span>Finalized</span>
        </p>
        <p>
          Timestamp: <span>22 mins ago (Apr-30-2023 09:59:11 PM +UTC)</span>
        </p>
        <p>
          Proposed On: <span>Block proposed on slot 6338994, epoch 198093</span>
        </p>
        <p>
          Transactions:
          <span>
            183 transactions and 129 contract internal transactions in this
            block
          </span>
        </p>
        <p>
          Withdrawals: <span>16 withdrawals in this block</span>
        </p>
      </div>
      <div className="block-info-mid">
        <p>
          Fee Recipient:<span>builder0x69 in 12 secs</span>
        </p>
        <p>
          Block Reward:
          <span>
            0.256211625802316887 ETH (0 + 1.247244844504013995 -
            0.991033218701697108)
          </span>
        </p>
        <p>
          Total Difficulty:<span>58,750,003,716,598,352,816,469</span>
        </p>
        <p>
          Size:<span>186,802 bytes</span>
        </p>
      </div>
      <div className="block-info-bot">
        <p>
          Gas Used <span></span>
        </p>
        <p>
          Gas Limit: <span></span>
        </p>
        <p>
          Base Fee Per Gas: <span></span>
        </p>
        <p>
          Burnt Fees: <span></span>
        </p>
        <p>
          Extra Data: <span></span>
        </p>
      </div>
    </div>
  );
};

export default BlockPage;
