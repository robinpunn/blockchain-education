import Wallet from "./components/Wallet";
import Transfer from "./components/Transfer";
import AddNewWallet from "./components/AddNewWallet";
import "./App.scss";
import { useState } from "react";

function App() {
  const [wallets, setWallets] = useState([]);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  console.log("app:", wallets);
  console.log(address);

  return (
    <div className="app">
      <Wallet
        balance={balance}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} wallets={wallets} />
      <AddNewWallet wallets={wallets} setWallets={setWallets} />
    </div>
  );
}

export default App;
