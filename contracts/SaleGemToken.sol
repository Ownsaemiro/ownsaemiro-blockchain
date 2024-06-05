// 라이센스
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "./MintGemToken.sol";
contract SaleGemToken{
  MintGemToken public mintGemToken;

  constructor(address _mintGemToken){
    mintGemToken = MintGemToken(_mintGemToken);
  }

  struct GemTokenData {
    uint tokenId;
    uint gemTokenRank;
    uint gemTokenType;
    uint tokenPrice;
  }

  mapping(uint => uint) public tokenPrices;

  uint[] public onSaleTokens; // 판매중인 Token

  function setForSaleGemToken(uint _tokenId, uint _price) public {
    address tokenOwner = mintGemToken.ownerOf(_tokenId);

    require(tokenOwner == msg.sender, "Caller is not Gem token owner.");
    require(_price > 0, "Price is zero or lower");
    require(tokenPrices[_tokenId] == 0, "This Gem token is already on sale.");
    require(mintGemToken.isApprovedForAll(msg.sender, address(this)), "Gem token owner did not approve token"); 
    // address(this) : 판매 컨트랙트 (msg.sender가 address(this)에게 판매 권한을 부여했는지)
  
    tokenPrices[_tokenId] = _price;

    onSaleTokens.push(_tokenId);
  }

  function purchaseGemToken(uint _tokenId) public payable {
    address tokenOwner = mintGemToken.ownerOf(_tokenId);

    require(tokenOwner != msg.sender, "Caller is Gem token owner.");
    require(tokenPrices[_tokenId] > 0, "This Gem token not sale.");
    require(tokenPrices[_tokenId] <= msg.value, "Caller sent lower than price.");

    payable(tokenOwner).transfer(msg.value); // Owner에게 값 전송

    mintGemToken.safeTransferFrom(tokenOwner, msg.sender, _tokenId); // Owner가 구매자에게 해당 Token 전송

    tokenPrices[_tokenId] = 0;

    popOnSaleToken(_tokenId);
  }

  function popOnSaleToken(uint _tokenId) private {
    for(uint i = 0; i < onSaleTokens.length; i++) {
      if(onSaleTokens[i] == _tokenId) {
        onSaleTokens[i] = onSaleTokens[onSaleTokens.length - 1];
        onSaleTokens.pop();
      }
    }
  }

  function getGemTokens(address _tokenOwner) public view returns(GemTokenData[] memory) {
    uint balanceLength = mintGemToken.balanceOf(_tokenOwner);

    require(balanceLength > 0, "Token owner did not have token.");

    GemTokenData[] memory gemTokens = new GemTokenData[](balanceLength);

    for(uint i = 0; i < balanceLength; i++) {
      uint tokenId = mintGemToken.tokenOfOwnerByIndex(_tokenOwner, i);
            
      (uint gemTokenRank, uint gemTokenType, uint tokenPrice) = getGemTokenInfo(tokenId);

      gemTokens[i] = GemTokenData(tokenId, gemTokenRank, gemTokenType, tokenPrice);
    }

    return gemTokens;
  }

  function getSaleGemTokens() public view returns(GemTokenData[] memory) {
    require(onSaleTokens.length > 0, "Not exist on sale token.");

    GemTokenData[] memory gemTokens = new GemTokenData[](onSaleTokens.length);

    for(uint i = 0; i < onSaleTokens.length; i++) {
      uint tokenId = onSaleTokens[i];

      (uint gemTokenRank, uint gemTokenType, uint tokenPrice) = getGemTokenInfo(tokenId);

      gemTokens[i] = GemTokenData(tokenId, gemTokenRank, gemTokenType, tokenPrice);
    }

    return gemTokens;
  }

  function getLatestMintedGemToken(address _tokenOwner) public view returns(GemTokenData memory) {
    uint balanceLength = mintGemToken.balanceOf(_tokenOwner);

    uint tokenId = mintGemToken.tokenOfOwnerByIndex(_tokenOwner, balanceLength - 1); // 가장 최근값 가져오기

    (uint gemTokenRank, uint gemTokenType, uint tokenPrice) = getGemTokenInfo(tokenId);

    return GemTokenData(tokenId, gemTokenRank, gemTokenType, tokenPrice);
  }

  function getGemTokenInfo(uint _tokenId) public view returns(uint, uint, uint) {
    uint gemTokenRank = mintGemToken.getGemTokenRank(_tokenId);
    uint gemTokenType = mintGemToken.getGemTokenType(_tokenId);
    uint tokenPrice = tokenPrices[_tokenId];

    return (gemTokenRank, gemTokenType, tokenPrice);
  } 
}