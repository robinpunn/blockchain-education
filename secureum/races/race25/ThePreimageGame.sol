// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract ThePreimageGame {
    mapping(address => int) public magicNumbers;
    mapping(address => uint) public prizes;

    modifier noStealing(address user) {
        uint startPrize = prizes[user];
        uint startBalance = address(this).balance;
        _;
        require(
            address(this).balance >= startBalance - startPrize,
            "you cannot take more than the prize"
        );
    }

    function set(
        address user,
        int number,
        uint8 _v,
        bytes32 _r,
        bytes32 _s
    ) external payable {
        bytes32 messageHash = keccak256(
            abi.encodePacked(number, address(this))
        );
        require(
            ecrecover(messageHash, _v, _r, _s) == user,
            "invalid signature"
        );
        magicNumbers[user] = number;
        prizes[user] += msg.value;
    }

    function solve(address user, int preimage) external noStealing(user) {
        require(
            magicNumbers[user] == _convertPreimageToNumber(preimage),
            "wrong guess"
        );

        _safeETHTransfer(msg.sender, prizes[user]);
        prizes[user] = 0;
    }

    function _convertPreimageToNumber(
        int preimage
    ) internal pure returns (int) {
        unchecked {
            int shuffled = int(_shuffleBits(uint(preimage)));
            return shuffled < 0 ? -shuffled : shuffled;
        }
    }

    function _shuffleBits(uint preimage) internal pure returns (uint result) {
        for (uint i = 0; i < 256; i++) {
            if (preimage & (1 << i) != 0) {
                result |= 1 << (255 - i);
            }
        }
    }

    function _safeETHTransfer(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}("");
        require(success, "transfer failed");
    }
}
