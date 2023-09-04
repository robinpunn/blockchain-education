// SPDX-License-Identifier: UNLICENSED
pragma solidity >= 0.4.21;

contract GuessTheRandomNumberChallenge {
    uint8 answer;

    constructor() payable {
        require(msg.value == 1 ether);
        bytes32 hash = keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp));
        uint256 number = uint256(hash);
        answer = uint8(number);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);

        if (n == answer) {
            payable(msg.sender).transfer(2 ether);
        }
    }
}