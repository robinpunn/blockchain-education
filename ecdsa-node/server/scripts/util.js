const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

//privateKey
const privateKey =
  "eff01fbc26f0b135a15314b6019c651c24139bbbafcbe53a61e60be728b464d2";
const shouldBe =
  "041c08837786e8891c5930c2b703ba5082e1b8573b367e5b2b6d00b30109f20180d4bc8097b75fb92c4077423fbe80427b224a2259e56cd7c1aa64dde922c56f0c";

//hash message
const messageHash = (message) => toHex(keccak256(utf8ToBytes(message)));
// messageHash("hello world");

// get public key from private key ( should be done client side)
function getPublicKey(privatekey) {
  console.log(toHex(secp.getPublicKey(privatekey)));
  return toHex(secp.getPublicKey(privatekey));
}
// getPublicKey(privateKey);

//get signature for client side ( no recovery)
const signature = async (msg, privateKey) => {
  const signed = await secp.sign(msg, privateKey);
  // console.log(signed);
  return signed;
};
// signature(messageHash("hello world"), privateKey);

/*verify signature (should be done client side to confirm transaction)
[may have to update to account for recovery from sign]*/
const verified = async (signature, msg, publicKey) => {
  const sign = await signature;
  const result = await secp.verify(sign, msg, publicKey);
  console.log(result);
};
verified(
  signature(messageHash("hello world"), privateKey),
  messageHash("hello world"),
  shouldBe
);

// verified(
//   signature(messageHash("hello world"), privateKey),
//   messageHash("hello world"),
//   getPublicKey(privateKey)
// );

// send signature and recoveryId to server (should be done client side and sent to server after verification)
const signature2 = async (msg, privateKey) => {
  const signed = await secp.sign(msg, privateKey, { recovered: true });
  const sign = toHex(signed[0]);
  const recoveryId = signed[1];
  // console.log(sign, recoveryId);
  return { sign, recoveryId };
};
// signature(messageHash("hello world"), privateKey);

// recover public key from signature ( should be done server side)
const recoverKey = async (message, signature) => {
  const sign = await signature;
  const recoveredPublicKey = await secp.recoverPublicKey(
    message,
    sign.sign,
    sign.recoveryId
  );
  console.log(toHex(recoveredPublicKey));
};
// recoverKey(
//   messageHash("hello world"),
//   signature(messageHash("hello world"), privateKey)
// );

/* Don't need these functions

// get address from public key
function publicToAddress(publicKey) {
  return toHex(keccak256(publicKey.slice(1)).slice(-20));
}
// publicToAddress(getPublicKey(privateKey))

// checking address and public key with private key
function check() {
  const privateKey =
    "eff01fbc26f0b135a15314b6019c651c24139bbbafcbe53a61e60be728b464d2";
  const publicKey = secp.getPublicKey(privateKey);
  const address = toHex(keccak256(publicKey.slice(1)).slice(-20));
  console.log(toHex(publicKey));
}
//check()

*/
