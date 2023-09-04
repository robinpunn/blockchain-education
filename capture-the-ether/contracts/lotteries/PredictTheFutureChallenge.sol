// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.21;

contract PredictTheFutureChallenge {
    address guesser;
    uint guess;
    uint256 settlementBlockNumber;

    constructor () payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function lockInGuess(uint8 n) public payable {
        require(guesser == address(0));
        require(msg.value == 1 ether);

        guesser = msg.sender;
        guess = n;
        settlementBlockNumber = block.number + 1;
    }

    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        bytes32 hash = keccak256(abi.encodePacked(blockhash(block.number - 1), block.timestamp));
        uint256 number = uint256(hash);
        uint8 answer = uint8(number % 10);

        guesser = address(0);
        if (guess == answer) {
            payable(msg.sender).transfer(2 ether);
        }
    }
}