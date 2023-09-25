// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import {Script} from "forge-std/Script.sol";
import {SimpleStorage} from "../src/SimpleStorage.sol";

contract SimpleStorageScript is Script {
    function run() external returns (SimpleStorage) {
        vm.startBroadcast();
        SimpleStorage simpleStorage = new SimpleStorage();
        vm.stopBroadcast();
        return simpleStorage;
    }
}

// pragma solidity ^0.8.13;

// import {Script, console2} from "forge-std/Script.sol";

// contract CounterScript is Script {
//     function setUp() public {}

//     function run() public {
//         vm.broadcast();
//     }
// }
