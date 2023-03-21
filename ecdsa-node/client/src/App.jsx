import Wallet from "./components/Wallet";
import Transfer from "./components/Transfer";
import AddNewWallet from "./components/AddNewWallet";
import "./App.scss";
import { useState } from "react";

function App() {
  const [wallets, setWallets] = useState(
    JSON.parse(localStorage.getItem("wallets")) || []
  );
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [verified, setVerified] = useState(false);
  const [recovery, setRecovery] = useState("");

  return (
    <div className="app">
      <Wallet
        balance={balance}
        privateKey={privateKey}
        setPrivateKey={setPrivateKey}
        setBalance={setBalance}
        address={address}
        setAddress={setAddress}
      />
      <Transfer setBalance={setBalance} address={address} />
      <AddNewWallet wallets={wallets} setWallets={setWallets} />
    </div>
  );
}

export default App;
