import React from "react";
import server from "../server";

const DisplayWallets = ({ wallets }) => {
  const copyWalletAddress = (address) => {
    navigator.clipboard.writeText(address);
  };

  const getWalletBalances = async () => {
    try {
      const response = await server.get(`balances/`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container scroll">
      {wallets.map((wallet) => {
        return (
          <div
            className="wallets"
            key={wallet.address}
            onClick={() => copyWalletAddress(wallet.address)}
          >
            <p>Wallet Address: {wallet.address}</p>
            <p>Wallet Public Key: {wallet.public}</p>
            <p>Wallet Private Key: {wallet.private}</p>
            {/*<p>Wallet Balance: {wallet.balance}</p>*/}
          </div>
        );
      })}
      {/*<button className="button" onClick={getWalletBalances}>
        Update Balances
    </button>*/}
    </div>
  );
};

export default DisplayWallets;
