### Overview
- These challenges are for the Sepolia test net. 
	- There are also challenges on arbitrum, but they're not linked here.
- Solve these challenges using the block explorer. 
- Go to the `Contract` tab to read the contract in order to figure out what you need to do.
- You need to connect your wallet to solve the challenges.

### [Challenge 1](https://sepolia.etherscan.io/address/0x25056312685339b49e1d1C5a0b72Ff9eff13AF77#code)
```solidity
function solveChallenge(string memory yourTwitterHandle) external {
	_updateAndRewardSolver(yourTwitterHandle);
}
```
- Just call this function

### [Challenge 2](https://sepolia.etherscan.io/address/0x5c1ddb86F11BB46D3067C702AC554aEaED9ff8f0#code)
```solidity
function solveChallenge(uint256 number, string memory yourTwitterHandle) external {
	if (number == someNumber) {
		_updateAndRewardSolver(yourTwitterHandle);
	} else {
		revert LessonTwo__WrongNumberGuessed();
	}
}
```
- The number is stored as variable

### [Challenge 4](https://sepolia.etherscan.io/address/0x1b30DA2a868704483143A4D46865Ac9585629fd0#code)
```solidity
function solveChallenge(uint256 priceGuess, string memory yourTwitterHandle) external {
	uint256 actualPrice = getPrice();
	if (getDecimals() == 8) {
		actualPrice = actualPrice * 10e10;
	}
	if (actualPrice + 3e18 > priceGuess && actualPrice - 3e18 < priceGuess) {
		_updateAndRewardSolver(yourTwitterHandle);
	} else {
		revert LessonFour__WrongPrice();
	}
}
```
- Go to the [price feed contract](https://sepolia.etherscan.io/address/0x694AA1769357215DE4FAC081bf1f309aDC325306)  
	- call `latestAnswer` or `latestRoundData` from the `Read` functions
	- add 10 zeros to that number

### [Challenge 5](https://sepolia.etherscan.io/address/0x4b3a7F293091708dDD6B8748179aeAF80E9c1bA2#code)
```solidity
function solveChallenge(string memory password, string memory yourTwitterHandle) external {
	if (keccak256(abi.encodePacked(password)) == EXPECTED_BYTES) {
		_updateAndRewardSolver(yourTwitterHandle);
	} else {
		revert LessonFive__WrongPassword();
	}
}
```
- The hint gives away the answer:
```
Hint: It's a very common...
```
- To verify, we can use cast:
```
cast keccak "password"
0xb68fe43f0d1a0d7aef123722670be50268e15365401c442f8806ef83b612976b
```

### [Challenge 6](https://sepolia.etherscan.io/address/0x6c4791c3a9E9Bc5449045872Bd1b602d6385E3E1#code)
```solidity
function solveChallenge(string memory yourFavoriteIceCream, string memory yourTwitterHandle) external {
	_updateAndRewardSolver(yourTwitterHandle);
	s_addressToIceCreamOrFood[msg.sender] = yourFavoriteIceCream;
}
```
- We can just call this function using whatever string
- But if you want to use cast:
```
cast send 0x6c4791c3a9E9Bc5449045872Bd1b602d6385E3E1 "solveChallenge(string,string)" "flavor" "@yourhandle" --rpc-url <YOUR_RPC_URL> --private-key <YOUR_PRIVATE_KEY>
```

### [Challenge 7](https://sepolia.etherscan.io/address/0xD7D127991c6A89Df752FC3daeC17540aE8B86101#code)
```solidity
function solveChallenge(uint256 valueAtStorageLocationSevenSevenSeven, string memory yourTwitterHandle) external {
	uint256 value;
	assembly {
		value := sload(STORAGE_LOCATION)
	}
	if (value != valueAtStorageLocationSevenSevenSeven) {
		revert LessonSeven__WrongValue();
	}
	uint256 newValue = uint256(keccak256(abi.encodePacked(msg.sender, block.prevrandao, block.timestamp))) % 1000000;
	assembly {
		sstore(STORAGE_LOCATION, newValue)
	}
	_updateAndRewardSolver(yourTwitterHandle);
}
```
- Use cast to solve this challenge:
```
cast storage 0xD7D127991c6A89Df752FC3daeC17540aE8B86101 777 --rpc-url <RPC_URL>
cast to-dec <result from previous command> 
```

### [Challenge 8](https://sepolia.etherscan.io/address/0xf215a0b6DD88d6029b5385D6fab51968337E963D)
This challenge was very confusing. I would not have figured this out if I didn't check discord.
- The challenge starts with an IPFS link.
	- If we use dev tools with our browser (press f12), we can go to the sources
	- We can also look at the console to see what's going on when we try to interact with the send button
```
Error: cannot estimate gas; transaction may fail or may require manual gas limit (error={"code":-32000,"message":"execution reverted"}, method="estimateGas", transaction={"from":"0x433C914F6a6301F9c6adbe55BE4FD5Cf77DD87A3","to":"0x76B50696B8EFFCA6Ee6Da7F6471110F334536321","data":"0x29a30a7000000000000000000000000000000000000000000000000000000000075bcd15000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000000103132333435363738392c20727970746300000000000000000000000000000000","accessList":null}, code=UNPREDICTABLE_GAS_LIMIT, version=providers/5.1.2)
    at Logger.makeError (ethers-5.6.esm.min.js:1:70446)
    at Logger.throwError (ethers-5.6.esm.min.js:1:70644)
    at checkError (ethers-5.6.esm.min.js:1:575413)
    at Web3Provider.<anonymous> (ethers-5.6.esm.min.js:1:585219)
    at Generator.throw (<anonymous>)
    at rejected (ethers-5.6.esm.min.js:1:573507)
```
- We can see that the frontend is trying to call contract: `0x76B50696B8EFFCA6Ee6Da7F6471110F334536321`
- If we go to `constants.js`, we get this information:
```
export const arbitrumAddress = "0x39338138414Df90EC67dC2EE046ab78BcD4F56D9"
export const sepoliaAddress = "0x76B50696B8EFFCA6Ee6Da7F6471110F334536321"
export const secretValue = "123456789"
```
- And if we actually go the [contract](https://sepolia.etherscan.io/txs?a=0x76B50696B8EFFCA6Ee6Da7F6471110F334536321&p=3) linked by the HTML frontend, we see that this seems to be the main contract that deployed all the challenges.
- If we go to the [transaction](https://sepolia.etherscan.io/tx/0xc123cfd40d1e08a355ec605e199b38f3d00a3198386d86c77b87df07f881d39e) that looks like it deployed the 8th challenge, we get this [contract address](https://sepolia.etherscan.io/address/0xf215a0b6DD88d6029b5385D6fab51968337E963D) 
- From the initial front end, in `index.js` from the `Sources` tab in our developer tools, we see this call:
```js
const transactionResponse = await contract.solveChallenge(secretValue, twitterHandle)
```
- We know that `solveChallenge()` needs two arguments, and we're assuming the first argument is a uint256
	- We should be able to call this function using `cast`:
```
cast send 0xf215a0b6DD88d6029b5385D6fab51968337E963D "solveChallenge(uint256,string)" "123456789" "@yourhandle" --rpc-url <YOUR_RPC_URL> --private-key <YOUR_PRIVATE_KEY>
```
