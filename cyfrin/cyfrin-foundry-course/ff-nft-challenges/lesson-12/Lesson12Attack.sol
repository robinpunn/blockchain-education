// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract ExploitContract {
    uint128 public numberr;
    address public owner;

    constructor(uint128 _numberr) {
        numberr = _numberr;
        owner = msg.sender;
    }

    function getNumberr() public view returns (uint128) {
        return numberr;
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}