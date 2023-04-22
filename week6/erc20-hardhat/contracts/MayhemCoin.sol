//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MayhemCoin is ERC20 {
    uint constant _initial_supply = 100 * (10**18);
    constructor() ERC20("MayhemCoin", "MYC") {
        _mint(msg.sender, _initial_supply);
    }
}

/*GOERLI
Compiled 2 Solidity files successfully
Deploying contracts with the account: 0x0DD58dAdD6fe624962e8107B8B26d7cC0747BC11
Account balance: 1.222576201532352639
Token address: 0x42CBab5E2F66FA5f5BC93BD38cb65353DED3882B
*/