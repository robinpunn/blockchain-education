import React, { useState, useEffect } from "react";
import { Alchemy, Network } from "alchemy-sdk";
import SingleTxInfo from "../components/SingleTransactionPage/SingleTxInfo";
import SingleTxParties from "../components/SingleTransactionPage/SingleTxParties";
import SingleTxValues from "../components/SingleTransactionPage/SingleTxValues";

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

const SingleTransaction = ({ transactionHash, onClickAddress }) => {
  const [singleTx, setSingleTx] = useState(null);
  const [gasReceipt, setGasReceipt] = useState(null);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await alchemy.core.getTransaction(transactionHash);
        const responseGas = await alchemy.core.getTransactionReceipt(
          transactionHash
        );
        setSingleTx(response);
        setGasReceipt(responseGas);
        console.log("Single Transaction Receipt:", response);
      } catch (error) {
        console.log("Error fetching transaction receipts:", error);
      }
    };

    fetchTransaction();
  }, [transactionHash]);

  return (
    <div>
      {singleTx && gasReceipt && (
        <>
          <SingleTxInfo singleTx={singleTx} />
          <SingleTxParties
            singleTx={singleTx}
            onClickAddress={onClickAddress}
          />
          <SingleTxValues singleTx={singleTx} gasReceipt={gasReceipt} />
        </>
      )}
    </div>
  );
};

export default SingleTransaction;
