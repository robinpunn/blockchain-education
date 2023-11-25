// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import {Script} from "lib/forge-std/src/Script.sol";
import {BasicNFT} from "../src/BasicNft.sol";

contract DeployBasicNft is Script {
    function run() external returns (BasicNFT) {
        vm.startBroadcast();
        BasicNFT basicNft = new BasicNFT();
        vm.stopBroadcast();
        return basicNft;
    }
}

// mayhem: 0x5Cb8c564689002c032bD110C981c761A86022Fb1
// pug:
