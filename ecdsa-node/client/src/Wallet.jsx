import server from "./server";
import * as secp from 'ethereum-cryptography/secp256k1'
import {toHex, utf8ToBytes} from "ethereum-cryptography/utils"
import { keccak256 } from "ethereum-cryptography/keccak"

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const publicKey = secp.getPublicKey(privateKey)
    const address = toHex(keccak256(publicKey.slice(1)).slice(-20))
    setAddress(address)

    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type in a private key" value={privateKey} onChange={onChange}></input>
      </label>

      <div>
        Address: {address}
      </div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
