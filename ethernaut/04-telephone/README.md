## Telephone
Claim ownership of the contract

##### Things that might help
Use Remix to write the code and deploy it in the corresponding network See Remix Solidity IDE.
Setup a local truffle project to develop and deploy the attack contracts. See Truffle Framework.

#### Understanding the contract
1. State Variables
- This contract has one state variable: ``address public owner;``
- It is a public variable called ``owner`` which is an address

2. Constructor
- The constructor sets the owner as the ``msg.sender``
```js
constructor() {
    owner = msg.sender;
  }
```

3. Functions
- The contract has one public function called ``changeOwner``
```js
function changeOwner(address _owner) public {
    if (tx.origin != msg.sender) {
        owner = _owner;
    }
}
```
- The function takes one parameter, an address
- If the origin of this transaction is not the ``msg.sender``, then the owner becomes whatever address was used as an argument for the function

#### Solving
Solving this contract involves calling the ``changeOwner`` function
However, simply calling the function would not work. We need to make sure that the address that is calling the function in ``Telephone`` is not the address that initiated the transactoin
To solve this challenge, we need to create a second contract
The second contract will call the ``changeOwner`` function in the ``Telephone`` contract
This will mean
  - ``tx.origin`` is our address (we call the function on the attack contract)
  - ``msg.sender`` is the attack contract (it will call the ``changeOwner`` function)
use ``await contract.owner()`` to verify the owner address

#### Summary
While this example may be simple, confusing `tx.origin` with `msg.sender` can lead to phishing-style attacks, such as [this](https://blog.ethereum.org/2016/06/24/security-alert-smart-contract-wallets-created-in-frontier-are-vulnerable-to-phishing-attacks/).

An example of a possible attack is outlined below.

1. Use `tx.origin` to determine whose tokens to transfer, e.g.
```
function transfer(address _to, uint _value) {
  tokens[tx.origin] -= _value;
  tokens[_to] += _value;
}
```
2. Attacker gets victim to send funds to a malicious contract that calls the transfer function of the token contract, e.g.
```
function () payable {
  token.transfer(attackerAddress, 10000);
}
```
In this scenario, `tx.origin` will be the victim's address (while `msg.sender` will be the malicious contract's address), resulting in the funds being transferred from the victim to the attacker.