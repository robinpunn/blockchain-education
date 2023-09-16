#### You will beat this level if
Claim ownership of the contract
##### Things that might help
- Use Remix to write the code and deploy it in the corresponding network See Remix Solidity IDE.
- Setup a local truffle project to develop and deploy the attack contracts. See Truffle Framework.

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
- Solving this contract involves calling the ``changeOwner`` function
- However, simply calling the function would not work. We need to make sure that the address that is calling the function in ``Telephone`` is not the address that initiated the transactoin
- To solve this challenge, we need to create a second contract
- The second contract will call the ``changeOwner`` function in the ``Telephone`` contract 
- This will mean
    ``tx.origin`` is our address (we call the function on the attack contract)
    ``msg.sender`` is the attack contract (it will call the ``changeOwner`` function)
- use ``await contract.owner()`` to verify the owner address