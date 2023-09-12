// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface IFuzzyIdentityChallenge {
    function isComplete() external view returns (bool);
    
    function authenticate() external payable;
}

contract FuzzyIdentitySolver {
    IFuzzyIdentityChallenge public challenge;

    constructor(address challengeAddress) {
        challenge = IFuzzyIdentityChallenge(challengeAddress);
    }

    function attack() external {
        challenge.authenticate();
    }

    function name() external pure returns (bytes32) {
        return bytes32("smarx");
    }

    receive() external payable {}
}