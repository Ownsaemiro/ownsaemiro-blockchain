const Caver = require('caver-js');
const solc = require('solc');
const fs = require('fs');
const path = require('path');
require('dotenv').config();
const readline = require('readline');

const caver = new Caver('https://api.baobab.klaytn.net:8651/'); // Klaytn 네트워크 설정 (Baobab 테스트넷 사용)

/* Solidity 코드 읽기 */
const contractPath = path.join(__dirname, "./contracts", 'MintContract.sol');
const source = fs.readFileSync(contractPath, 'utf8');

/* Solidity 컴파일 입력 설정 */
const input = {
  language: 'Solidity',
  sources: {
      'MintContract.sol': {
          content: source,
      },
  },
  settings: {
      outputSelection: {
          '*': {
              // '*': ['contractAbi', 'evm.bytecode'],
              '*': ['*', '*'],
          },
      },
  },
};

/* import한 pacakage 불러오기 */
function findImports(importPath) {
  try {
      const fullPath = path.resolve(__dirname, "node_modules", importPath);
      const content = fs.readFileSync(fullPath, 'utf8');
      return { contents: content };
  } catch (error) {
      return { error: `File not found: ${importPath}` };
  }
}


/* solc를 이용한 컴파일 */
const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));
// if (output.errors) { // Compile 에러 출력
//   output.errors.forEach(err => {
//       console.error(err.formattedMessage);
//   });
// }
const contractFile = output.contracts['MintContract.sol']['MintContract'];
// console.log(contractFile)
const contractAbi = contractFile.abi; // 스마트 컨트랙트 ABI
// console.log(contractAbi)
const contractBytecode = contractFile.evm.bytecode.object; // 스마트 컨트랙트 ByteCode
// console.log(contractBytecode)

// fs.writeFileSync('MintContract.abi', JSON.stringify(contractAbi)); // ABI를 파일 생성


/* 배포를 위한 계정 설정 (private key 사용) */
const privateKey = process.env.TESTPRIVATEKEY;

if (!privateKey || privateKey.length !== 64) {
    throw new Error('Invalid private key');
}

const deployer = caver.wallet.keyring.createFromPrivateKey(`0x${privateKey}`); // Keyring 생성
caver.wallet.add(deployer); // Caver Wallet에 Keyring 추가
console.log(caver.wallet.getKeyring(deployer.address), "\n");

let contractAddress = ""; // 스마트 컨트랙트 Address 저장

/* 스마트 컨트랙트 배포 */
async function deployContract() {
    const contract = new caver.contract(contractAbi);

    const deployedContract = await contract
        .deploy({ data: contractBytecode })
        .send({
            from: deployer.address,
            gas: '10000000',
        });
    
    contractAddress = deployedContract.options.address;
    console.log('스마트 컨트랙트 Address:', contractAddress, "\n");
    
    // return contractAddress;
}
// contractDeploy().catch(console.error);

const mintAbi = JSON.parse(JSON.stringify(contractAbi));
// console.log(abi)

/* NFT 발행 함수 */
async function mintNFT(contractAd, count) {
    try {
        const contract = new caver.contract(mintAbi, contractAd); // 스마트 컨트랙트 인스턴스 생성

        // mintNFT 함수 호출
        const receipt = await contract.methods.mintNFT(count).send({
            from: deployer.address, // 발행자의 지갑 주소
            gas: '10000000', // Gas Limit
            value: 0
        });

        console.log('NFT Tranaction 영수증 : ', receipt, "\n");
        console.log('NFT 발행 성공');
    } catch (error) {
        console.error('NFT 발행 에러 발생:', error);
    }
}
// await mintNFT(contractAddress)

// let inputCount = 0;
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

/* NFT 발행 */
async function NFTResult() {
    const inputCount = await askQuestion('NFT 발행 개수 : ');
    console.log(`NFT를 ${inputCount}개 발행하겠습니다.`, '\n');
    rl.close();

    await deployContract(); // 스마트 컨트랙트 배포 함수

    await mintNFT(contractAddress, inputCount); // NFT 발행 함수
}

NFTResult().catch(console.error);