const CaverExtKAS = require("caver-js-ext-kas");

// import "dotenv";
const env = require('dotenv').config();

const chainId = 1001 // 8217(메인넷), 1001(테스트넷)
const accessKeyId = process.env.ACCESSKEYID; // KAS API ID
const secretAccessKey = process.env.SECRETACCESSKEY; // KAS API Key
const contractAddress = process.env.CONTRACTADDRESS; // 컨트랙트 주소
const contractHash = process.env.TRANACTIONHASH; // 컨트랙트 TransactionHash

// const caver = new CaverExtKAS(chainId, accessKeyId, secretAccessKey);
const caver = new CaverExtKAS();
caver.initKASAPI(chainId, accessKeyId, secretAccessKey);

/* -------------------- 송수신 조회 -------------------- */
// 트랜잭션 해시로 토큰 송수신 기록 조회
async function searchTransferHistoryHash(){
  const result = await caver.kas.tokenHistory.getTransferHistoryByTxHash(
    contractAddress
  );

  console.log(result);
}
searchTransferHistoryHash()
// Transfers {
//   items: [
//       TransferItem {
//           feePayer: '',
//           feeRatio: 0,
//           fee: '0x48ba158a44a00',
//           from: '0x76c6b1f34562ed7a843786e1d7f57d0d7948a6f1',
//           to: '0xbbe63781168c9e67e7a8b112425aa84c479f39aa',
//           transactionHash: '0x063b947b7bc70356ace9644a30188541e345b28e532810d1b80c132882c742ad',
//           transactionIndex: 0,
//           transferType: 'klay',
//           typeInt: 48,
//           value: '0x0'
//       }
//   ]
// }


// 특정 NFT 소유권 변경 기록 조회
async function searchNFTOwnerChange(){
  const result = await caver.kas.tokenHistory.getNFTOwnershipHistory(
    contractAddress,
    "0x1" // Token Number
  );

  console.log(result);
}
searchNFTOwnerChange()
// PageableNftOwnershipChanges {
//   items: [
//       NftOwnershipChange {
//           from: '0x76c6b1f34562ed7a843786e1d7f57d0d7948a6f1',
//           to: '0x88ab3cdbf31f856de69be569564b751a97ddf5d8',
//           timestamp: 1599110780
//       },
//       NftOwnershipChange {
//           from: '0x0000000000000000000000000000000000000000',
//           to: '0x76c6b1f34562ed7a843786e1d7f57d0d7948a6f1',
//           timestamp: 1599110774
//       }
//   ],
//   cursor: ''
// }


/* --------------- NFT, Token 정보 조회 --------------- */
// 특정 NFT 컨트랙트 조회
async function searchNFT(){
  const result = await caver.kas.tokenHistory.getNFTContract(
    contractAddress
  );

  console.log(result);
}
searchNFT();
/* 실행 결과 */
// NftContractDetail {
//   address: '0xbbe63781168c9e67e7a8b112425aa84c479f39aa',
//   name: 'Jasmine',
//   symbol: 'JAS',
//   totalSupply: '0x36',
//   createdAt: 1599101533,
//   updatedAt: 1599101533,
//   deletedAt: 0,
//   type: 'KIP-17',
//   status: 'completed'
// }


// 특정 NFT 컨트랙트의 모든 토큰 조회
async function searchAllToken(){
  const query = { size: 1000 }; // 최대 Size : 1000
  const result = await caver.kas.tokenHistory.getNFTList(
    contractAddress,
    query
  );

  console.log(result);
}
searchAllToken();
/* 실행 결과 */
// PageableNfts {
//   items: [
//       Nft {
//           owner: '0x88ab3cdbf31f856de69be569564b751a97ddf5d8',
//           previousOwner: '0x76c6b1f34562ed7a843786e1d7f57d0d7948a6f1',
//           tokenId: '0x7b',
//           tokenUri: 'https://game.example/item-id-8u5h2m.json',
//           transactionHash: '0x5f38d4bbb9a54550a9d070901ebdc714acdec67db34c658e5eb1ad6647b0f4d2',
//           createdAt: 1599110774,
//           updatedAt: 1599110780
//       }
//   ],
//   cursor: 'PdOALgqNme5a9vJ6KDBAZ4gzwx6alLo1Q5mX7q2Oz2d7e8PrK1Jpwbm9LZ6D0lRxNnvx4BMAVXNE5Qao3kqgWGYOp9rW8Y3GEDM0deNPbKvkJVEz4oXVrY0Wxk1lbp7B'
// }


// 특정 NFT 정보 조회
async function searchNFTInfo(){
  const tokenId = "0x1";
  const result = await caver.kas.tokenHistory.getNFT(contractAddress, tokenId);

  console.log(result);
}
searchNFTInfo()
// Nft {
//   owner: '0x88ab3cdbf31f856de69be569564b751a97ddf5d8',
//   previousOwner: '0x76c6b1f34562ed7a843786e1d7f57d0d7948a6f1',
//   tokenId: '0x7b',
//   tokenUri: 'https://game.example/item-id-8u5h2m.json',
//   transactionHash: '0x5f38d4bbb9a54550a9d070901ebdc714acdec67db34c658e5eb1ad6647b0f4d2',
//   createdAt: 1599110774,
//   updatedAt: 1599110780
// }