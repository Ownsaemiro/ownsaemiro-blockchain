// 라이센스
// SPDX-License-Identifier: MIT

pragma solidity 0.8.21;

import "@klaytn/contracts/access/Ownable.sol";
import "@klaytn/contracts/utils/Counters.sol";
import "@klaytn/contracts/KIP/token/KIP17/KIP17.sol";
import "@klaytn/contracts/KIP/token/KIP17/extensions/IKIP17Metadata.sol";

contract MintContract is KIP17, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    address private _owner;

    constructor() public KIP17("MintContract", "Park") {
        _owner = msg.sender;
    }

    function mintNFT(uint count) public onlyOwner {
        for(uint i=0;i<count;i++){
            _tokenIds.increment();
            uint256 newItemId = _tokenIds.current();

            _mint(msg.sender, newItemId);
        }
    }
}