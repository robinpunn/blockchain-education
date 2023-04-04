/*
Your Goal: Tick, Tick, Tick
Add an external function to the contract called tick.
After calling tick 10 times, it should selfdestruct the contract.
*/

//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
contract Contract {
    uint _countdown = 10;
    function tick() external {
        _countdown --;
        if (_countdown == 0) {
            selfdestruct(payable(msg.sender));
        }
    }

}