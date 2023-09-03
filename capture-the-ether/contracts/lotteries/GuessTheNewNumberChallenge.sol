// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.21;

contract GuessTheNewNumberChallenge {
    constructor() payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(bytes32 n) public payable {
        require(msg.value == 1 ether);
        bytes32 answer = keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp));

        if (n == answer) {
            payable(msg.sender).transfer(2 ether);
        }
    }
}