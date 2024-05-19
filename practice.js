// import Caver from "caver-js";
const Caver = require("caver-js");
// import CaverExtKAS from "caver-js-ext-kas";
const CaverExtKAS = require("caver-js-ext-kas");

// import "dotenv";
const env = require('dotenv').config();

const chainId = 1001 // 8217(메인넷), 1001(테스트넷)
const accessKeyId = process.env.ACCESSKEYID;
const secretAccessKey = process.env.SECRETACCESSKEY;

// caver.initTokenHistoryAPI(chainId, accessKeyId, secretAccessKey) // TokenHistory API 초기화
const caver = new CaverExtKAS(chainId, accessKeyId, secretAccessKey);

// 최근 Block 번호 구하기
async function findBlockNumber(){
  const blockNumber = await caver.rpc.klay.getBlockNumber();
  console.log(blockNumber);
}
// findBlockNumber();

// Wallet API 생성 방법
async function createWallet(){
  const account = await caver.kas.wallet.createAccount();
  
  console.log(account);
}
// createWallet();

// Token History API로 NFT 컨트랙트 리스트 조회 방법
async function findHistory() {
  const query = { size: 100 };
  const result = await caver.kas.tokenHistory.getNFTList(
    process.env.TOKENADDRESS,
    query
  );

  console.log(result);
}
findHistory();
// for(let i=0;i<1000;i++){
//   findHistory();
// }


// NFT 세부사항 조회
async function findNFTDetail(){
  const result = await caver.kas.tokenHistory.getNFTContract(
    process.env.TOKENADDRESS
  );

  console.log(result);
}
// findNFTDetail();

async function findAllNFT(){
  const contractAddress = process.env.TOKENADDRESS; // NFT 주소
  // const ownerAddress = ""; // Wallet 주소
  const query = {
    size: 1,
  };
  const result = await caver.kas.tokenHistory.getNFTListByOwner(
    contractAddress,
    ownerAddress,
    query
  );

  console.log(result);
}
// findAllNFT();

// NFT 소유권 변동 조회
async function searchChangeOwner(){
  const result = await caver.kas.tokenHistory.getNFTOwnershipHistory(
    process.env.TOKENADDRESS,
    "0x1"
  );

  console.log(result);
}
// searchChangeOwner();