## Privacy
The creator of this contract was careful enough to protect the sensitive areas of its storage.
Unlock this contract to beat the level.

##### Things that might help
Understanding how storage works
Understanding how parameter parsing works
Understanding how casting works
Remember that metamask is just a commodity. Use another tool if it is presenting problems. Advanced gameplay could involve using remix, or your own web3 provider.

#### Understanding the contract
1. State Variables
```js
bool public locked = true;
uint256 public ID = block.timestamp;
uint8 private flattening = 10;
uint8 private denomination = 255;
uint16 private awkwardness = uint16(block.timestamp);
bytes32[3] private data;
```
- This contract has 6 state variables
- Understanding [storage layout](https://docs.soliditylang.org/en/v0.8.17/internals/layout_in_storage.html) is important for this challenge
- The bool ``locked`` should be in its own storage slot, the first one, because it precedes a uint256
- This means that ``ID`` will also be in its own storage slot since its a uint256... so this will be the second storage slot
- as each slot stores 32 bytes, then we know that ``flattening``, ``denomination``, and ``awkwardness`` are all packed together in the third storage slot
- Finally, ``data`` is an array of of bytes32 types with a fixed size of 3.
    It is also set to private, but we can still access it through it's storage slot.
    Also, each element should also have its own storage slot

2. Constructor
```js
constructor(bytes32[3] memory _data) {
    data = _data;
}
```
- The constructor functions takes one argument: a fixed, bytes32 array
- The global variable data is set to the contructor argument

3. Functions
```js
function unlock(bytes16 _key) public {
    require(_key == bytes16(data[2]));
    locked = false;
}
```
- There is one function, ``unlock``
- It is set to public and takes one argument, a bytes16 type
- If function requires that the argument is equivalent to element in the second index of the data array
- If the require check is met, then locked is assigned as false

#### Solving
Solving this challenege involves understanding how storage slots work.  We know that the ``_key`` we need is a bytes16 type and that each element in the ``data`` array is a bytes32 type. We also know that the the storage slots for the ``data`` array starts at index 3. This means that ``data[2]`` will be found at index 5 as each element will takes it own storage slot.

If we run the command ``await web3.eth.getStorageAt("CONTRACT ADDRESS",5)``, we should get a return such as: ``'0xf808cc4af6270342cd8aff9ce821d97dc35e3b7ec47c4bdd87a63bc803587ad9'``. The length of this string is 66 including the ``0x`` prefix. However, the entire string is 32bytes, but we only want 16bytes.

If we store the return in a variable ``privateData``, then we can run: ``const slicedPrivate = privateData.slice(0,34)``.

Then we can run: ``await contract.unlock(slicedPrivate)`` and we should be able to complete the challenge.

#### Summary
Nothing in the ethereum blockchain is private. The keyword private is merely an artificial construct of the Solidity language. Web3's ``getStorageAt(...)`` can be used to read anything from storage. It can be tricky to read what you want though, since several optimization rules and techniques are used to compact the storage as much as possible.

It can't get much more complicated than what was exposed in this level. For more, check out this excellent article by "Darius": [How to read Ethereum contract storage](https://medium.com/aigang-network/how-to-read-ethereum-contract-storage-44252c8af925)