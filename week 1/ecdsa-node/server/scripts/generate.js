const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");
const { keccak256 } = require("ethereum-cryptography/keccak");

const privateKey = secp.utils.randomPrivateKey();
const publicKey = secp.getPublicKey(privateKey);
const getAddress = (publicKey) => keccak256(publicKey.slice(1)).slice(-20);
const public = getAddress(publicKey);

console.log(privateKey.length, publicKey.length, public.length);
console.log("privateHex:", toHex(privateKey));
console.log("publicHex:", toHex(publicKey));
console.log("address:", toHex(public));
