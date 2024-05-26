## Fallback
1. Claim ownership of the contract
2. Reduce its balance to 0
  

##### Things that might help
How to send ether when interacting with an ABI
How to send ether outside of the ABI
Converting to and from wei/ether units (see help() command)
Fallback methods

#### Understanding the contract
1. State variables
```solidity
mapping(address => uint) public contributions;
address public owner;
```
- This contract has two state variables: ``contributions`` and ``owner``
- Both of these variables are public, so they should be accessible through the console
- ``contributions`` is a ``mapping`` which should associate and ``address`` to a ``uint``
- ``owner`` is an ``address``

2. Constructor
```solidity
constructor() {
    owner = msg.sender;
    contributions[msg.sender] = 1000 * (1 ether);
}
```
- The constructor runs once when the contract is deployed
- The ``owner`` state variable will be given the value of the address deploying the contract: ``msg.sender``
- The deploying address ``msg.sender`` is added tot he contributions mapping with a value of 1000 ether

3. Modifier
```solidity
 modifier onlyOwner() {
    require(msg.sender == owner, "caller is not the owner");
    _;
}
```
- A modifier can be applied to functions
- This modifier requires that the address currently interacting with its function is the owner

4. Functions

```solidity
function contribute() public payable {
    require(msg.value < 0.001 ether);
    contributions[msg.sender] += msg.value;
    if (contributions[msg.sender] > contributions[owner]) {
        owner = msg.sender;
    }
}
```
- The ``contribute()`` function is public and payable meaning anyone can access it and it can recieve ether
- The function requires that the amount of ether being sent must be less that 0.001
- This function adds the address sending the ether to the ``contributions`` state variable adding the value sent as the mapping association
- If the contributions of the sending address are greater than the contributions from the owner address, the sending address becomes the owner
    - Based on the contructor, this should mean that any address that sends over 1000 eth should become the owner

```solidity
function getContribution() public view returns (uint) {
    return contributions[msg.sender];
}
```
- The ``getContribution()`` function is a ``public``, ``view`` function that ``returns`` a uint value when called
    - ``public`` allows anyone can access that functions
    - ``view`` functions cannot change any state
    - this function will return the contributions associated with the address calling the function

```solidity
function withdraw() public onlyOwner {
    payable(owner).transfer(address(this).balance);
}
```
- The ``withdraw()`` function is a ``public`` function with the ``onlyOwner`` modifier
    - Even thought the function is ``public``, the ``onlyOwner`` modifier dictates that the only the ``owner`` can call this function
    - this function will transfer the funds stored in the contract address to the ``owner``

```solidity
receive() external payable {
    require(msg.value > 0 && contributions[msg.sender] > 0);
    owner = msg.sender;
}
```
- ``receive()`` is a fallback function and it exists only to receive ether
- ``external`` allows the contract to be called by other contracts or transactions
- ``payable`` declarations allow functions and addresses to recieve ether

#### Solving
After having understood the contract we can see that there are two ways to become the owner:
    1. We can send more that 1000 ether to the contract
    2. After making a contribution of less that 0.001 ether, we can send additional ether (>0) to the contract to become the owner

We can follow these steps to accomplish method 2:
    1. ``contribute()`` ether (less than 0.001) so our address is in the contributions mapping
    2. Now, if we send ether to the contract with the ``receive()`` function, our address should become the owner
    3. As the owner, we can use the ``withdraw`` function which should give us the entire balance of the contract

We can use ``web3`` in the console and it will show us a variety of methods we can use
    - For this challenge, we can use the ``toWei`` and ``sendTransaction`` methods
We can store the amount in a variable:
```js
const amount = web3.utils.toWei("0.0005", "ether")
```
We'll use .0005 to meet the <.001 requirements for ``contribute()``
```js
await contract.contribute({value: amount})
```
Next, we can send ether directly to the contract:
```js
await contract.sendTransaction({value:amount})
```
This should now make our address the owner
We can check this with:
```js
await contract.owner()
```
Our address should be returned confirming we are the owner, and we can now call ``withdraw()``

#### Summary
You know the basics of how ether goes in and out of contracts, including the usage of the fallback method.

You've also learnt about OpenZeppelin's Ownable contract, and how it can be used to restrict the usage of some methods to a privileged address.