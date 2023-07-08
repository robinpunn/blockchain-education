import React from "react";

const Transactions = ({ transactions, onClickAddress }) => {
  const latestTransactions = transactions.slice(0, 10);
  const handleClick = (address) => {
    onClickAddress(address);
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
              <p>TX#: {tx.hash.substring(0, 15)}...</p>
            </div>
            <div className="to-from">
              <p onClick={() => handleClick(tx.from)}>
                From: {tx.from.substring(0, 3)}...
                {tx.from.substring(tx.from.length - 3)}
              </p>
              <p onClick={() => handleClick(tx.to)}>
                To: {tx.to.substring(0, 3)}...
                {tx.to.substring(tx.to.length - 3)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Transactions;
