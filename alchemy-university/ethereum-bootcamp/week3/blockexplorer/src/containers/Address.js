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

const ViewAddress = ({ viewAddress, ethereumPrice }) => {
  const [balance, setBalance] = useState(null);
  const [tokens, setTokens] = useState(null);
  const [transfers, setTransfers] = useState(null);
  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const balanceWei = await alchemy.core.getBalance(viewAddress);
        const balance = balanceWei / 1e18;
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

  // const fetcTokenData = async () => {
  //   try {
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <>
      {balance && tokens && transfers && (
        <div>
          <h4>Address: {viewAddress}</h4>
          <div>
            <p>Balance: {balance} ETH</p>
            <p>ETH Value: ${(balance * ethereumPrice).toFixed(2)}</p>
          </div>

          <p>Tokens: {tokens.tokenBalances.length}</p>
          <p>Transfers: {transfers.transfers.length}</p>
        </div>
      )}
    </>
  );
};

export default ViewAddress;
