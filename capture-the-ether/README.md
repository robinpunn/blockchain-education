# [Capture The Ether](https://capturetheether.com/challenges/)

---

### Capture the Ether using Hardat
These challenges were originally deployed to the Ropsten testnet which is now deprecated
However, the challenges can be completed using something like the Remix IDE
Or we can use devlopment environments like Hardhat or Foundry
This repo uses Hardhat v2.17.2.
It has the contracts, deploy scripts, and tests needed to complete the challenges
In order to compile the contracts with older pragma versions, I had to use the following syntax:
```
pragma solidity >= 0.4.21;
```

#### Local Hardhat node
The challenges were completed using a local node
```
npx hardhat node
```
tests and scripts were run with the command:
```
npx hardhat test <test file>
```
```
npx hardhat run <script file>
```

#### Warmup
##### [Deploy A Contract](https://capturetheether.com/challenges/warmup/deploy/)
Deploy the contract and call the ``isComplete()`` function
[Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/warmup/deployChallenge.ts)

##### [Call Me](https://capturetheether.com/challenges/warmup/call-me/)
Deploy the contract and call the ``callMe()`` function
[Script]

##### [Choose a nickname](https://capturetheether.com/challenges/warmup/nickname/)
I had to make a few changes to this contract
Older version of Solidity did not have the constructor keyword, so this function:
```js
// Your address gets passed in as a constructor parameter.
function NicknameChallenge(address _player) public {
    player = _player;
}
```
was changed to:
```js
// Your address gets passed in as a constructor parameter.
constructor (address _cte, address _player) {
    cte = CaptureTheEther(_cte);
    player = _player;
}
```
Additionally, this state variable was changed:
```js
CaptureTheEther cte = CaptureTheEther(msg.sender);
```
to:
```js
CaptureTheEther cte;
```
This was done so the constructor could take in the contract address of the first contract as an argument.
To pass the tests, we need to take the ``bytes32`` version of our string:
```js
let name = ethers.encodeBytes32String("Robin");
```
and use that as an argument for the ``setNickname`` function
Then the second contract can be deplyed with two arguments, the address for the first contract and the player address
Calling ``isComplete()`` should return true
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/warmup/captureTheEther.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/warmup/captureTheEther.ts)


#### Lotteries
##### [Guess the Number](https://capturetheether.com/challenges/lotteries/guess-the-number/)
The number is stored as a variable so we can use it as an argument in the ``guess()`` function
The constructor function needs to be updated from
```js
function GuessTheNumberChallenge() public payable {
    require(msg.value == 1 ether);
}
```
to
```js
constructor() payable {
    require(msg.value == 1 ether);
}
```
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/lotteries/guessTheNumber.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/lotteries/guessTheNumberChallenge.ts)

##### [Guess the Secret Number](https://capturetheether.com/challenges/lotteries/guess-the-secret-number/)
To solve this challenge, we use the ``uint8`` parameter of ``guess()`` as a hint. ``uint8`` is an unsigned integer with 8 bits. It can hold a maximum value of 255, so we know the answer is between 0 and 255.
The constructor function needs to changed from
```js
function GuessTheSecretNumberChallenge() public payable {
    require(msg.value == 1 ether);
}
```
to
```js
constructor () payable {
    require(msg.value == 1 ether);
}
```
The ``keccak256`` function has been updated from
```js
if (keccak256(n) == answerHash) {
    msg.sender.transfer(2 ether);
}
```
to
```js
if (keccak256(abi.encodePacked(n)) == answerHash) {
    payable(msg.sender).transfer(2 ether);
}
```
We can use a forloop to find the answer
```js
const answerHash =
    "0xdb81b4d58595fbbbb592d3661a34cdca14d7ab379441400cbfa1b78bc447c365";
let secretNumber;
for (let i = 0; i <= 255; i++) {
    const numberBytes = ethers.toBeHex(i);
    const hash = ethers.keccak256(numberBytes);
    if (answerHash === hash) {
    secretNumber = i;
    console.log(`The secret number is ${secretNumber}`);
    break;
    }
}
```
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/lotteries/guessTheSecretNumber.ts) &nbsp;
[Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/lotteries/guessTheSecretNumber.ts)

##### [Guess the Random Number](https://capturetheether.com/challenges/lotteries/guess-the-random-number/)
In this challenge, the constructor calculates the answer using the blocknumber and timestamp. But the answer is stored as a state variable. We can [access storage variables starting from position 0](https://docs.soliditylang.org/en/v0.6.6/miscellaneous.html#layout-of-state-variables-in-storage)
```js
const answer = await ethers.provider.getStorage(contract.target, 0);
```
- Start by updating the constructor changing it from:
```js
function GuessTheRandomNumberChallenge() public payable {
    require(msg.value == 1 ether);
    answer = uint8(keccak256(block.blockhash(block.number - 1), now));
}
```
to
```js
constructor() payable {
    require(msg.value == 1 ether);
    bytes32 hash = keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp));
    uint256 number = uint256(hash);
    answer = uint8(number);
}
```
Older Solidity compilers were able to directly convert ``bytes32`` to ``uint8``, but with newer versions we have to take the extra steps shown above.
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/lotteries/guessTheRandomNumber.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/lotteries/guessTheRandomNumber.ts)

##### [Guess the New Number](https://capturetheether.com/challenges/lotteries/guess-the-new-number/)
To solve this challenge, a second contract can be created that interfaces with the first contract
```js
interface IGuessTheNewNumberChallenge {
    function guess(uint8) external payable;

    function isComplete() external view returns (bool);
}
```
But first, the constuctor function needs to be changed from
```js
function GuessTheNewNumberChallenge() public payable {
    require(msg.value == 1 ether);
}
```
to
```js
constructor() payable {
    require(msg.value == 1 ether);
}
```
The newer compiler versions don't have the ability to directly convert from ``bytes32`` to ``uint8``
```js
function guess(uint8 n) public payable {
    require(msg.value == 1 ether);
    uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

    if (n == answer) {
        msg.sender.transfer(2 ether);
    }
}
```
Change ``guess`` to
```js
function guess(uint8 n) public payable {
    require(msg.value == 1 ether);
    bytes32 hash = keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp));
    uint256 number = uint256(hash);
    uint8 answer = uint8(number);

    if (n == answer) {
        payable(msg.sender).transfer(2 ether);
    }
}
```
The second contract will contain a function that replicated the original ``guess`` function
```js
function solve() external payable {
    require(address(this).balance >= 1 ether, "");

    bytes32 hash = keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp));
    uint256 number = uint256(hash);
    uint8 answer = uint8(number);

    challengeContract.guess{value:1 ether}(answer);

    require(challengeContract.isComplete(), "");

    payable(msg.sender).transfer(address(this).balance);
}
```
This allows the second contract to create a "random" number using the same blocknumber and timestamp that will be used in the original contract when the second contract makes a call to the first
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/lotteries/guessTheSecretNumber.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/lotteries/guessTheSecretNumber.ts)

##### [Predict the Future](https://capturetheether.com/challenges/lotteries/predict-the-future/)
As with the last challenge, this challenge will use a second contract that interfaces with the first contract. However, in this challenge, a guess has to be locked in before the contract logic creates a "random" number. The guess will be between 0 and 9
```js
bytes32 hash = keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp));
uint256 number = uint256(hash);
uint8 answer = uint8(number % 10);
```
Change the constructor function from
```js
function PredictTheFutureChallenge() public payable {
    require(msg.value == 1 ether);
}
```
to
```js
constructor () payable {
    require(msg.value == 1 ether);
}
```
The second contract will call the ``lockInguess`` function from the first contract with ``0`` as the guess. The logic from the second contract will require that the answer is ``0`` before the ``settle`` function from the first contract is called
```js
function solve() external payable {
    bytes32 hash = keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp));
    uint256 number = uint256(hash);
    uint8 answer = uint8(number % 10);

    require(answer == 0);

    challengeContract.settle();
    payable(msg.sender).transfer(address(this).balance);
}
```
Only one ether will be used. A while loop can be used to keep calling the ``solve`` function from the second contract until the answer is ``0``
```js
while (!(await contract.isComplete())) {
    try {
    const solve = await contract2.solve({ gasLimit: 1000000 });
    await solve.wait();
    } catch (err) {
    console.log(`attack failed`);
    }
    const blockNumber = await ethers.provider.getBlockNumber();
    console.log(`block number: ${blockNumber}`);
}
```
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/lotteries/predictTheFuture.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/lotteries/predeictTheFutureChallenge.ts)

##### [Predict the Blockhash]
This challenge uses the blocknumber to create a hash that is used as a comparison to the hash that is guessed. [blocknumber](https://docs.soliditylang.org/en/v0.8.21/units-and-global-variables.html#block-and-transaction-properties) only includes the 256 most recent blocks. Anything outside of this range returns 0.
Change the contructor from
```js
function PredictTheBlockHashChallenge() public payable {
    require(msg.value == 1 ether);
}
```
to
```js
constructor() payable {
    require(msg.value == 1 ether);
}
```
We can use a forloop to mine blocks after we input our guess of "0x0000000000000000000000000000000000000000000000000000000000000000"
```js
for (let i = 0; i < 257; i++) {
      await ethers.provider.send("evm_mine");
      console.log("block mined");
    }
```
At this point, the ``settle`` function is called, but the block for our guess is from 256 blocks ago. This ensures that the hash is going to match our guess.
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/lotteries/predictTheBlockHash.ts) &nsbp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/lotteries/predictTheBlockHashChallenge.ts)