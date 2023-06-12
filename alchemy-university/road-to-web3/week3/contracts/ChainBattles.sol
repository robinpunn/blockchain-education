// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

// Smart contract deployed to 0x5f25955f0F7e60e84056be31E4dA0eeF3BEAB071
contract ChainBattles is ERC721URIStorage  {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Define a character struct
    struct Character {
        uint256 level;
        uint256 health;
        uint256 power;
        uint256 defense;
    }
    
    // Map tokenIdToLevels to Character struct
    mapping(uint256 => Character) public tokenIdToLevels;

    // Declare constructor function for smart contract
    constructor() ERC721 ("Chain Battles", "CBTLS"){
    }

    // Generate NFT Image on chain
    function generateCharacter(uint256 tokenId) public view returns(string memory){

        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<defs>',
                '<linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">',
                    '<stop offset="0%" style="stop-color:rgb(255,255,0);stop-opacity:1" />',
                    '<stop offset="100%" style="stop-color:rgb(0,225,0);stop-opacity:1" />',
                '</linearGradient>',
                '<linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">',
                    '<stop offset="0%" style="stop-color:rgb(0,25,255);stop-opacity:1" />',
                    '<stop offset="100%" style="stop-color:rgb(175,0,255);stop-opacity:1" />',
                '</linearGradient>',
            '</defs>',
            '<style>.base { font-family: serif; font-weight: bold }</style>',
            '<rect width="100%" height="100%" fill="url(#grad1)" />',
            '<text x="50%" y="30%" class="base" dominant-baseline="middle" text-anchor="middle" fill="url(#grad2)" font-size="20px">',"Warrior",'</text>',
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle" fill="url(#grad2)" font-size="12px">', "Level: ",getLevel(tokenId),'</text>',
            '<text x="50%" y="60%" class="base" dominant-baseline="middle" text-anchor="middle" fill="url(#grad2)" font-size="12px">', "Health: ",getHealth(tokenId),'</text>',
            '<text x="50%" y="70%" class="base" dominant-baseline="middle" text-anchor="middle" fill="url(#grad2)" font-size="12px">', "Power: ",getPower(tokenId),'</text>',
            '<text x="50%" y="80%" class="base" dominant-baseline="middle" text-anchor="middle" fill="url(#grad2)" font-size="12px">', "Defense: ",getDefense(tokenId),'</text>',
            '</svg>'
        );
        return string(
            abi.encodePacked(
                "data:image/svg+xml;base64,",
                Base64.encode(svg)
            )    
        );
    }

    // Get level of NFT
    function getLevel(uint256 tokenId) public view returns (string memory) {
        uint256 _level = tokenIdToLevels[tokenId].level;
        return _level.toString();
    }

    // Get health of NFT
    function getHealth(uint256 tokenId) public view returns (string memory) {
        uint256 _health = tokenIdToLevels[tokenId].health;
        return _health.toString();
    }

    // Get power of NFT
    function getPower(uint256 tokenId) public view returns (string memory) {
        uint256 _power = tokenIdToLevels[tokenId].power;
        return _power.toString();
    }

    // Get defense of NFT
    function getDefense(uint256 tokenId) public view returns (string memory) {
        uint256 _defense = tokenIdToLevels[tokenId].defense;
        return _defense.toString();
    }


    // Generate and retrieve NFT TokenURI
    function getTokenURI(uint256 tokenId) public view returns (string memory){
    bytes memory dataURI = abi.encodePacked(
            '{',
                '"name": "Chain Battles #', tokenId.toString(), '",',
                '"description": "Battles on chain",',
                '"image": "', generateCharacter(tokenId), '"',
            '}'
        );
        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(dataURI)
            )
        );
    }

    // Create new NFT, initialize level value, set token URI
    function mint() public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        tokenIdToLevels[newItemId].level = 1;
        tokenIdToLevels[newItemId].health = random(10);
        tokenIdToLevels[newItemId].power = random(5);
        tokenIdToLevels[newItemId].defense = random(5);
        _setTokenURI(newItemId, getTokenURI(newItemId));
    }

    // Train function to raise NFT level
    // Make sure nft exists and verify ownership, increment NFT level by 1, update token URI
    function train(uint256 tokenId) public {
        require(_exists(tokenId), "Please use an existing token");
        require(ownerOf(tokenId) == msg.sender, "You must own this token to train it");
        uint256 currentLevel = tokenIdToLevels[tokenId].level;
        uint256 currentHealth = tokenIdToLevels[tokenId].health;
        uint256 currentPower = tokenIdToLevels[tokenId].power;
        uint256 currentDefense = tokenIdToLevels[tokenId].defense;
        tokenIdToLevels[tokenId].level = currentLevel + 1;
        tokenIdToLevels[tokenId].health = currentHealth + random(10);
        tokenIdToLevels[tokenId].power = currentPower + random(5);
        tokenIdToLevels[tokenId].defense = currentDefense + random(5);
        _setTokenURI(tokenId, getTokenURI(tokenId));
    }

    // Create a random number
    function random(uint256 number) public view returns(uint256){
        return uint256(keccak256(abi.encodePacked(block.timestamp,block.difficulty, msg.sender))) % number;
    }

}

