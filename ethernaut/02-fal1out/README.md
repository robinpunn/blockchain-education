#### You will beat this level if
- you claim ownership of the contract.

##### Things that might help
- Solidity Remix IDE

#### Understanding the contract
1. Libraries
```solidity
import 'openzeppelin-contracts-06/math/SafeMath.sol';

using SafeMath for uint256;
```
- This contract is using the Safe Math library from OpenZeppelin

2. State variables
```solidity
mapping (address => uint) allocations;
address payable public owner;
```
- There are two state variables: ``allocations`` and ``owner``
    - ``allocations`` is a mapping that maps an ``address`` to ``uint``
    - ``owner`` is an ``address`` that is ``public`` and ``payable``... anyone can look this address up and it can receive ether

3. Constructor
```solidity
/* constructor */
  function Fal1out() public payable {
    owner = msg.sender;
    allocations[owner] = msg.value;
}
```
- This functions has a comment of "constructor", but it is a regular function that is ``public`` and ``payable``
    - Anyone can call this function and it can receive ether
    - When called, the address calling the function becomes the ``owner`` and the amount sent during the transaction is associated with the ``owner`` address in the ``allocations`` mapping

4. Modifier
```solidity
modifier onlyOwner {
    require(
        msg.sender == owner,
        "caller is not the owner"
    );
    _;
}
```

5. Functions
```solidity
function allocate() public payable {
    allocations[msg.sender] = allocations[msg.sender].add(msg.value);
}
```
- ``allocate()`` is public and payable
    - Can be called by anyone and it can receive ether
    - When called, the address calling the function is added to the ``allocations`` mapping with the amount of ether sent

```solidity
function sendAllocation(address payable allocator) public {
    require(allocations[allocator] > 0);
    allocator.transfer(allocations[allocator]);
}
```
- ``sendAllocation`` has one input and is public
    - Takes an address that is payable as an argument with the variable name ``allocator``
    - Requires that the address taken as an argument is found in the allocations mapping and has an associated value greater than 0
    - Funds mapped to the allocator address in allocations is transferred to the allocator address

```solidity
function collectAllocations() public onlyOwner {
    msg.sender.transfer(address(this).balance);
}
```
- ``collectAllocations`` is a ``public`` function with the ``onlyOwner`` modifier
    - even though the function is ``public``, the modifier dicatates that this function can only be called by the owner
    - When called, this function transfers the balance on the smart contract to the address calling the function

```solidity
function allocatorBalance(address allocator) public view returns (uint) {
    return allocations[allocator];
}
```
- ``allocatorBalance`` takes an address as an argument, and it is a ``public``, ``view`` function that returns a ``uint``
    - Anyone can call this function and this function can only read state
    - When called, the function will show the balance of the address that was used as the input of this function using the allocations mapping

#### Solving
- We only need to gain ownership of the contract in order to pass this level
- Analyzing all of the functions, none of them have the ability to change ownership except for the "contructor"
- When we analyze ``Fal1out``, we see that it is a constructor prototype
    - A traditional constructor function is only executed once when the contract is deployed
    - However, ``Fal1out`` is set to public, and it appears as though it can be called multiple times after deployment
- All we need to do is to call ``Fal1out``
```solidity
await contract.Fal1out()
```
- We should now be the owner of the contract... calling ``owner()`` should return our address