import React, { useEffect, useState } from "react";
import { Alchemy, Network } from "alchemy-sdk";
/* 
getBalance 
getTokenBalances
getAssetTransfers
*/
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

const ViewAddress = ({ viewAddress }) => {
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [transfers, setTransfers] = useState(null);
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const balance = await alchemy.core.getBalance(viewAddress);
        const tokens = await alchemy.core.getTokenBalances(viewAddress);
        const transfers = await alchemy.core.getAssetTransfers({
          fromAddress: viewAddress,
          category: ["erc20", "erc721", "erc1155"],
        });
        setBalance(balance);
        setTokens(tokens);
        setTransfers(transfers);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTransaction();
  }, [viewAddress]);
  return (
    <>
      {balance && tokens && transfers && (
        <div>
          {console.log(
            "balance:",
            balance,
            "tokens:",
            tokens,
            "transfers:",
            transfers
          )}
        </div>
      )}
    </>
  );
};

export default ViewAddress;
