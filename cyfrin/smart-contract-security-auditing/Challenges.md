# Lesson Challenges

### Challenge 1
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