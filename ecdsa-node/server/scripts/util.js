const secp = require("ethereum-cryptography/secp256k1");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

//privateKey
const privateKey =
  "eff01fbc26f0b135a15314b6019c651c24139bbbafcbe53a61e60be728b464d2";

//hash message
function messageHash(message) {
  // console.log(keccak256(utf8ToBytes(message)));
  return toHex(keccak256(utf8ToBytes(message)));
}
// messageHash("hello world");

//get signature
const signature = async function signMessage(msg, privateKey) {
  const signed = await secp.sign(msg, privateKey);
  // console.log(toHex(signed));
  return signed;
};
// signature(messageHash("hello world"), privateKey);

//verify signature
async function verified(signature, msg, publicKey) {
  const sign = await signature;
  const result = await secp.verify(sign, msg, publicKey);
  console.log(result);
}
verified(
  signature(messageHash("hello world"), privateKey),
  messageHash("hello world"),
  getPublicKey(privateKey)
);

// get public key from private key
function getPublicKey(privatekey) {
  console.log(toHex(secp.getPublicKey(privatekey)));
  return toHex(secp.getPublicKey(privatekey));
}
// getPublicKey(privateKey);

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
