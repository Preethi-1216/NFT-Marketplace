// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ERC721, Ownable {
    uint public tokenCounter;
    mapping(uint => uint) public tokenIdToPrice;

    constructor() ERC721("NFTMarketplace", "NFTM") {
        tokenCounter = 0;
    }

    function mint(string memory _tokenURI, uint _price) public onlyOwner {
        uint tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        tokenIdToPrice[tokenId] = _price;
        tokenCounter++;
    }

    function buy(uint _tokenId) public payable {
        uint price = tokenIdToPrice[_tokenId];
        require(msg.value >= price, "Not enough ETH");
        address tokenOwner = ownerOf(_tokenId);
        payable(tokenOwner).transfer(msg.value);
        _safeTransfer(tokenOwner, msg.sender, _tokenId, "");
    }
}
