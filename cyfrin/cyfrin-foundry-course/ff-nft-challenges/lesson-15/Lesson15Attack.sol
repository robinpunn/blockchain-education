// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract MyContract {
    uint256 public s_variable = 0;
    uint256 public s_otherVar = 0;
    address private owner;

    constructor() {
        owner = msg.sender;
    }

    function getOwner() external view returns (address) {
        return owner;
    }

    function doSomething() external {
        s_variable += 123;
    }

    function doSomethingAgain() external {
        s_otherVar = 2;
    }
}