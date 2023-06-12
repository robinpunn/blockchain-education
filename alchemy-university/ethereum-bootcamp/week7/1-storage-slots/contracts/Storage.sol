// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.17;

// Uncomment this line to use console.log
import "../node_modules/hardhat/console.sol";

import "./StorageSlot.sol";

contract Storage {
    constructor() {
        StorageSlot.getUint256Slot(keccak256("robinpunn")).value = 256;
    }

    function check() external view {
        console.log(StorageSlot.getUint256Slot(keccak256("robinpunn")).value);
    }
}

/*
contract Storage {
    uint x = 97; // 0x0
    uint y = 56; // 0x1

    // keccak256(key + base)
    mapping(uint => uint) z; //0x2
    mapping(uint => uint) z2; //0x3
    // eth_getStorageAt ... look up storage location

    constructor(){
        // keccak256(0x1 + 0x3)
        z2[1] = 21;
        // keccak256(0x1 + 0x2)
        z[1] = 33;
        // keccak256(0x2 + 0x2)
        z[2] = 17;
        // keccak256(0x3 + 0x2)
        z[3] = 777;
        // keccak256(0x4 + 0x2)
        z[4] = 13;
        // keccak256(0x5 + 0x2)
        z[5] = 8;
    }
}
*/