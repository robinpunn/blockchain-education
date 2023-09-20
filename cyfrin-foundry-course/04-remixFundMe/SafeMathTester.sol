// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SafeMathTester {
    uint8 public bigNumber = 255;

    function add() public {
        unchecked {bigNumber += 3;}
    }
}