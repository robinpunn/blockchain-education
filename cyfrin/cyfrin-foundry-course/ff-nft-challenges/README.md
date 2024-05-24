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
This challenge was very confusing. I wouldn't have figured this out if I hadn't check discord.
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

### [Challenge 9](https://sepolia.etherscan.io/address/0x33e1fD270599188BB1489a169dF1f0be08b83509#code)
For this challenge, I think you can call the solve function and calculate what the answer will be, if you time it correctly. 
- `block.prevrandao` is found in the previous block, it's not a random number. 
- So we should be able to do this calculation: `uint256(keccak256(abi.encodePacked(msg.sender, block.prevrandao, block.timestamp))) % 100000` based on a future timestamp and try to time it correctly???

Instead, I just used an [attack contract](https://github.com/robinpunn/blockchain-education/tree/main/cyfrin/cyfrin-foundry-course/ff-nft-challenges/lesson-09/Lesson9Attack.sol).
- The contract needs to be able to receive nfts, we can use OpenZeppelin and use the IERC721Receiver library: [oz](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC721/IERC721Receiver.sol)
- We need to use `address(this)` in the exploit contract guess calculation as the `msg.sender` when calling the solve function will be the exploit contract
- Create a withdraw function so you can grab your nft
- We'll also need the address of the challenge 9 contract and the address of the foundry nft contract
```solidity
address targetContract = 0x33e1fD270599188BB1489a169dF1f0be08b83509;
address nftContract = 0x76B50696B8EFFCA6Ee6Da7F6471110F334536321;
```

### [Challenge 10](https://sepolia.etherscan.io/address/0xE0aE410a16776BCcb04A8d4B0151Bb3F25035994#code)
```solidity
function solveChallenge(string memory yourTwitterHandle) external {
	bool success = i_erc20.transferFrom(msg.sender, address(this), COST_TO_SOLVE);
	if (!success) {
		revert LessonTen__FailedToSolve();
	}
	_updateAndRewardSolver(yourTwitterHandle);
}
```
- In order to solve this, we need a `COST_TO_SOLVE` amount of the erc20.
- We can mint what we need from [here](https://sepolia.etherscan.io/address/0xC5D0ab0E66fA10040D0f3A65c593612351bB4957#code)
- Then we need to call the approve function so the transfer is successful when called from `solveChallenge`

### [Challenge 11](https://sepolia.etherscan.io/address/0x93c7A945af9c453a8c932bf47683B5eB8C2F8792#code)
```solidity
  /*
     * CALL THIS FUNCTION!
     * 
     * @param the function selector of the first one you need to call
     * @param the abi encoded data... hint! Use chisel to figure out what to use here...
     * @param yourTwitterHandle - Your twitter handle. Can be a blank string.
     */
    function solveChallenge(bytes4 selectorOne, bytes memory inputData, string memory yourTwitterHandle) external {
        (bool successOne, bytes memory responseDataOne) = i_helperContract.call(abi.encodeWithSelector(selectorOne));
        if (!successOne || uint256(bytes32((responseDataOne))) != 1) {
            revert LessonEleven__WrongSelector();
        }

        (bool successTwo, bytes memory responseDataTwo) = i_helperContract.call(inputData);
        if (!successTwo || uint256(bytes32((responseDataTwo))) != 1) {
            revert LessonEleven__WrongData();
        }
        _updateAndRewardSolver(yourTwitterHandle);
    }
```
- This contract uses a [helper contract](https://sepolia.etherscan.io/address/0x28B4144Fe74b486a87e68074189Aa60f59577602#code) 
- We need to get the function selector of "the first one you need to call" which seems to be `returnTrue()`
- The challenge hints ate using chisel, but we can just use `cast sig "returnTrue()"` which will give us `0xf613a687`
- The function doesn't take any arguments, so we use the same selector for both parameters of the challenge function
- If instead we were working with the second function:
```solidity
function returnTrueWithGoodValues(uint256 nine, address contractAddress) public view returns (bool) {
        if (nine == 9 && contractAddress == address(this)) {
            return true;
        }
        return false;
    }
```
- Then we would use `cast sig "returnTrueWithGoodValues(uint256, address)"` for the first parameter and `cast abi-encode "returnTrueWithGoodValues(uint256, address)" 9 0x28B4144Fe74b486a87e68074189Aa60f59577602` for the second parameter
