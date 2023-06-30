// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    // Initialize contract with 1 million tokens minted to the creator of the contract
    constructor() ERC20("Token", "TKN") {
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }
}

/*
Token deployed to: 0xcf511C3E5Ca0c5212342203c85B56E78FA6C5467

The contract 0xcf511C3E5Ca0c5212342203c85B56E78FA6C5467 has already been verified.
https://sepolia.etherscan.io/address/0xcf511C3E5Ca0c5212342203c85B56E78FA6C5467#code

*/
