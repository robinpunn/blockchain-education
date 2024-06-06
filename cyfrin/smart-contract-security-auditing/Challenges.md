# Lesson Challenges

### [Challenge 0](https://arbiscan.io/address/0xf923431da74ecc873c4d641fbdfa2564baafca9f#code)
```solidity
 /*
     * CALL THIS FUNCTION!
     * 
     * @param yourTwitterHandle - Your twitter handle. Can be a blank string.
     */
    function solveChallenge(string memory twitterHandle) external {
        _updateAndRewardSolver(twitterHandle);
    }
```
- Self explanatory, just enter a string

### [Challenge 1](https://arbiscan.io/address/0x7a0f40757f6ba868b44ce959a1d4b8bc22c21d59)
`S1.sol`
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
            revert S1__WrongSelector();
        }

        (bool successTwo, bytes memory responseDataTwo) = i_helperContract.call(inputData);
        if (!successTwo || uint256(bytes32((responseDataTwo))) != 1) {
            revert S1__WrongData();
        }
        _updateAndRewardSolver(yourTwitterHandle);
    }

    function getHelperContract() external view returns (address) {
        return i_helperContract;
    }
```
- For this challenge we need to call the function selector for "the first one you need to call"
- We see that there is `i_helperContract.call(abi.encodeWithSelector(selectorOne))`, so "the first one you need to call", probably means the first function in the helper contract

`S1Helper.sol`
```solidity
// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract S1Helper {
    function returnTrue() external pure returns (bool) {
        return true;
    }

    function returnTrueWithGoodValues(uint256 nine, address contractAddress) public view returns (bool) {
        if (nine == 9 && contractAddress == address(this)) {
            return true;
        }
        return false;
    }
}
```
- From the helper contract, we see that `returnTrue` is the first function
- We can use cast to get the selector
```
$ cast keccak "returnTrue()"
0xf613a6873d6cfa57a62ebf63d2f80e5e639fa6df74ad2066cb9579549b44912c
```
- The selector will be the first [4 bytes](https://solidity-by-example.org/function-selector/): `0xf613a687`
- `cast sig "returnTrue()"` does all the work for us
- Since the function doesn't require any arguments, we can use the selector for both parameters of the challenge

### [Challenge 2](https://arbiscan.io/address/0xeab9c7ac697408fd1581494577c7c0716c3b75e6#code)
```
/*
     * CALL THIS FUNCTION!
     * 
     * @param weCallItSecurityReview - Set "true" if you'll call it "security review" instead of "security audit".
     * @param yourTwitterHandle - Your twitter handle. Can be a blank string.
     */
    function solveChallenge(bool weCallItSecurityReview, string memory yourTwitterHandle) external {
        if (!weCallItSecurityReview) {
            revert S2__WrongValue();
        }
        _updateAndRewardSolver(yourTwitterHandle);
    }
```
- We want to bypass the if check, so use `true` for the first parameter.

### [Challenge 3](https://arbiscan.io/address/0x89edc4c74810bedbd53d7da677eb420dc0154b0b#code)
```
 function solveChallenge(uint256 valueAtStorageLocationSevenSevenSeven, string memory yourTwitterHandle) external {
        uint256 value;
        assembly {
            value := sload(STORAGE_LOCATION)
        }
        if (value != valueAtStorageLocationSevenSevenSeven) {
            revert S3__WrongValue();
        }
        // slither-disable-next-line weak-prng
        uint256 newValue =
            uint256(keccak256(abi.encodePacked(msg.sender, block.prevrandao, block.timestamp))) % 1_000_000;
        assembly {
            sstore(STORAGE_LOCATION, newValue)
        }
        _updateAndRewardSolver(yourTwitterHandle);
    }
```
- We know that our variable is going to be stored in storage location 777. 
- We can use `cast`:
`cast storage 0x89edc4c74810bedbd53d7dA677eB420DC0154B0b 777 --rpc-url $ARBITRUM_RPC_URL`