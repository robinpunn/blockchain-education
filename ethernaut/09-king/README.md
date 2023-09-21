## King
The contract below represents a very simple game: whoever sends it an amount of ether that is larger than the current prize becomes the new king. On such an event, the overthrown king gets paid the new prize, making a bit of ether in the process! As ponzi as it gets xD

Such a fun game. Your goal is to break it.

When you submit the instance back to the level, the level is going to reclaim kingship. You will beat the level if you can avoid such a self proclamation.

##### Things that might help
???

#### Understanding the contract
1. State Variables
- the contract has three state variables
```js
address king;
uint public prize;
address public owner;
```
- ``king`` is an address with a default visbility of internal
- ``prize`` is a public uint
- ``owner`` is a public address

2. Constructor
```js
constructor() payable {
    owner = msg.sender;  
    king = msg.sender;
    prize = msg.value;
}
```
- The constructor doesn't take any arguments
- The constructor is ``payable``, so it can recieve Ether
- ``msg.sender`` becomes the ``owner`` and the ``king``
- ``prize`` is set to ``msg.value``, the amount of ETH sent when the contract is deployed

3. Functions
```js
receive() external payable {
    require(msg.value >= prize || msg.sender == owner);
    payable(king).transfer(msg.value);
    king = msg.sender;
    prize = msg.value;
  }
```
- The ``recieve`` function is similar to a fallback function but it is designed specifically to handle incoming ether
- ``receive`` requires that the value sent is greater than or equal to ``prize`` or that the ``msg.sender`` is the ``owner``
- ``king`` is assigned to ``msg.sender``
- ``prize`` is assigned to ``msg.value``

```js
function _king() public view returns (address) {
    return king;
}
```
- The function ``king()`` returns the address of the current ``king``


#### Solving
Exploiting this contract involves using a second contract
We also exploit the fact that ``receive`` uses the ``transfer`` method to send eth to the king... this means that a contract can receive the eth
We can create a contract that cannot receive eth to complete this challenge
``await contract.prize().then(v => v.toString())`` shows us that the current prize is ``1000000000000000`` wei
Utilizing a contract that reverts when receiving ether or a contract that can't receive ether should complete the challenge
```js
 receive() external payable {
    revert("You cannot become the king.");
}
```

#### Summary
Most of Ethernaut's levels try to expose (in an oversimplified form of course) something that actually happened — a real hack or a real bug.

In this case, see: [King of the Ether](https://www.kingoftheether.com/thrones/kingoftheether/index.html) and [King of the Ether Postmortem](http://www.kingoftheether.com/postmortem.html).