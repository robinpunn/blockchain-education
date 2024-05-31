// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract MyContract {
    int256 private TARGET_NUMBER = -572038313094850821099624258919152072749626291038;
    address private theOwner;

    constructor() {
        theOwner = msg.sender;
    }

    function owner() external view returns (address) {
        return theOwner;
    }
    function getNumber() external view returns (int256) {
        return TARGET_NUMBER;
    }
}