import { useState } from "react";
import server from "../server";
import * as secp from "ethereum-cryptography/secp256k1";
import { toHex, utf8ToBytes } from "ethereum-cryptography/utils";
import { keccak256 } from "ethereum-cryptography/keccak";

function Transfer({ address, setBalance, wallets }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");
  console.log("transfer:", wallets);

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const createMessageHash = (address, amount, recipient) => {
    const msg = `I am sending ${amount} ETH to ${recipient} from ${address}`;
    const messageHash = (message) => toHex(keccak256(utf8ToBytes(message)));
    return messageHash(msg);
  };

  const findPrivateKey = (address) => {
    const wallet = wallets.find((wallet) => wallet.address === address);
    return wallet.private;
  };

  const sign = async (address, message) => {
    const privateKey = findPrivateKey(address);
    const signed = await secp.sign(message, privateKey, { recovered: true });
    const signature = toHex(signed[0]);
    const recoveryId = signed[1];
    return { signature, recoveryId };
  };

  // if veri
  async function transfer(evt) {
    evt.preventDefault();
    const message = createMessageHash(address, sendAmount, recipient);
    const { signature, recoveryId } = await sign(address, message);
    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        signature,
        recoveryId,
        recipient,
        message,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
