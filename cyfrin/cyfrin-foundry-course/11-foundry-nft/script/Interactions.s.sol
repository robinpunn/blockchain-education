// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.4;

import {Script} from "forge-std/Script.sol";
import {DevOpsTools} from "lib/foundry-devops/src/DevOpsTools.sol";
import {BasicNFT} from "../src/BasicNft.sol";

contract MintBasicNFT is Script {
    string public constant MAYHEM =
        "https://ipfs.io/ipfs/QmYucP65bEBgqcf5g68RmVem4mG5cDwdNLoAth6A52AABs?filename=metadata.json";

    // string public constant PUG_URI =
    //     "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json";

    function run() external {
        address mostRecentlyDeployed = 0x5Cb8c564689002c032bD110C981c761A86022Fb1;
        // address mostRecentlyDeployed = DevOpsTools.get_most_recent_deployment(
        //     "BasicNFT",
        //     block.chainid
        // );
        mintNftOnContract(mostRecentlyDeployed);
    }

    function mintNftOnContract(address contractAddress) public {
        vm.startBroadcast();
        BasicNFT(contractAddress).mintNft(MAYHEM);
        vm.stopBroadcast();
    }
}

// contract: 0x241389602D99c79bf740698dEa2F30a492A7C733
