import React from "react";

const Transactions = ({ transactions, onClickAddress, onClickTransaction }) => {
  const latestTransactions = transactions.slice(0, 10);
  const handleClickAddress = (address) => {
    onClickAddress(address);
  };
  const handleClickTransaction = (transaction) => {
    onClickTransaction(transaction);
  };
  return (
    <div className="transactions-container">
      <div className="header">
        <h4>Latest Transactions</h4>
      </div>
      <div className="transactions">
        {latestTransactions.map((tx) => (
          <div className="transaction" key={tx.hash}>
            <div className="hash">
              <p onClick={() => handleClickTransaction(tx.hash)}>
                TX#: <span>{tx.hash.substring(0, 15)}...</span>
              </p>
            </div>
            <div className="to-from">
              <p onClick={() => handleClickAddress(tx.from)}>
                From:{" "}
                <span>
                  {tx.from.substring(0, 3)}...
                  {tx.from.substring(tx.from.length - 3)}
                </span>
              </p>
              <p onClick={() => handleClickAddress(tx.to)}>
                To:{" "}
                <span>
                  {tx.to.substring(0, 3)}...
                  {tx.to.substring(tx.to.length - 3)}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
