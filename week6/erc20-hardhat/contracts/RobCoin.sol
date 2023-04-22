//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract RobCoin is ERC20 {
    uint constant _initial_supply = 100 * (10**18);
    constructor() ERC20("RobCoin", "RC") {
        _mint(msg.sender, _initial_supply);
    }
}

/*
Compiled 5 Solidity files successfully
Deploying contracts with the account: 0x0DD58dAdD6fe624962e8107B8B26d7cC0747BC11
Account balance: 0.25
Token address: 0xC70013950d23ce6976bB148789CC72d9bb11e191
*/