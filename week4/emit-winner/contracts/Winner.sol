//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface ContractWinner {
    function attempt() external;
}

contract WinnerInterface {
    ContractWinner private _contract;

    constructor(address contractAddress) {
        _contract = ContractWinner(contractAddress);
    }

    function attempt() external {
        _contract.attempt();
    }
}