import React, { useState } from "react";
import server from "../server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

const AddNewWallet = ({ wallets, setWallets }) => {
  const [walletCount, setWalletCount] = useState(wallets?.length ?? 0);
  console.log(wallets);

  const onClick = async () => {
    const privateKey = secp.utils.randomPrivateKey();
    const publicKey = secp.getPublicKey(privateKey);
    const getAddress = (publicKey) => keccak256(publicKey.slice(1)).slice(-20);
    const address = getAddress(publicKey);

    const newWallet = {
      private: toHex(privateKey),
      public: toHex(publicKey),
      address: toHex(address),
    };

    const walletName = `wallet${walletCount + 1}`;
    // wallets[walletName] = newWallet;
    setWallets([...wallets, (wallets[walletName] = newWallet)]);
    setWalletCount(walletCount + 1);

    try {
      // Make a POST request to set the initial balance to 10 for the new wallet
      await server.post(`balances/`, {
        address: newWallet.address,
        balance: 10,
      });
    } catch (error) {
      console.error(error);
    }

    return newWallet;
  };
  // try {
  //   // Make a POST request to set the initial balance to 10 for the new wallet
  //   await server.post(`balances/${newWallet.address}`, { balance: 10 });
  // } catch (error) {
  //   console.error(error);

  return (
    <div className="container create">
      <h1>Create a Wallet</h1>
      <button onClick={onClick}>CREATE</button>
    </div>
  );
};

export default AddNewWallet;
