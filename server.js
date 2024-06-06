const Caver = require("caver-js");
const solc = require("solc");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const express = require("express");

dotenv.config();

const caver = new Caver("https://api.baobab.klaytn.net:8651/");
const contractPath = path.join(__dirname, "./contracts", "MintContract.sol");
const source = fs.readFileSync(contractPath, "utf8");

const input = {
  language: "Solidity",
  sources: {
    "MintContract.sol": {
      content: source,
    },
  },
  settings: {
    outputSelection: {
      "*": {
        "*": ["*", "*"],
      },
    },
  },
};

/**
 * Import packages
 * @param {*} importPath
 * @returns
 */
function findImports(importPath) {
  try {
    const fullPath = path.resolve(__dirname, "node_modules", importPath);
    const content = fs.readFileSync(fullPath, "utf8");
    return { contents: content };
  } catch (error) {
    return { error: `File not found: ${importPath}` };
  }
}

/**
 * Compile with solc
 */
const output = JSON.parse(
  solc.compile(JSON.stringify(input), { import: findImports })
);

const contractFile = output.contracts["MintContract.sol"]["MintContract"];

// Smart Contract ABI
const contractAbi = contractFile.abi;

// Smart Contract ByteCode
const contractBytecode = contractFile.evm.bytecode.object;

const privateKey = process.env.TESTPRIVATEKEY;

if (!privateKey || privateKey.length !== 64) {
  throw new Error("Invalid private key");
}

// Deployer account
const deployer = caver.wallet.keyring.createFromPrivateKey(`0x${privateKey}`);

caver.wallet.add(deployer);
// console.log(caver.wallet.getKeyring(deployer.address));

/**
 * Deploy Smart Contract
 * @returns Smart Contract Address
 */
async function deployContract() {
  const contract = new caver.contract(contractAbi);

  const deployedContract = await contract
    .deploy({
      data: contractBytecode,
    })
    .send({
      from: deployer.address,
      gas: "10000000",
    });

  contractAddress = deployedContract.options.address;

  return contractAddress;
}

const mintAbi = JSON.parse(JSON.stringify(contractAbi));

/**
 * NFT Minting (발행)
 * @param {*} contractAd
 * @param {*} count
 * @returns
 */
async function mintNFT(contractAd, count) {
  let receipt;

  try {
    const contract = new caver.contract(mintAbi, contractAd);

    receipt = await contract.methods.mintNFT(count).send({
      from: deployer.address,
      gas: "10000000",
      value: 0,
    });

    // console.log("NFT Transaction Hash: ", receipt);
  } catch (error) {
    console.error(error);
  }

  return receipt;
}

// make get api

const app = express();

const port = 3000;

app.use(express.json());

app.post("/api/contract/publish", async (req, res) => {
  try {
    const { seat } = req.body;

    if (typeof seat !== "number" || seat <= 0) {
      return res.status(400).send({
        success: false,
        data: null,
        error: "Invalid Parameter",
      });
    }

    const contractAddress = await deployContract();

    const receipt = await mintNFT(contractAddress, seat);

    const tickets = Array.from({ length: seat }, (_, i) => ({
      ticket_number: i + 1,
    }));

    res.send({
      success: true,
      data: {
        event_hash: receipt.blockHash,
        tickets: tickets,
        contract_address: contractAddress,
      },
      error: null,
    });

    console.log("Seeded Response : ", {
      success: true,
      data: {
        event_hash: receipt.blockHash,
        tickets: tickets,
        contract_address: contractAddress,
      },
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      data: null,
      error: error.message,
    });
  }
});

app.post("/api/contract/remain-publish", async (req, res) => {
  try {
    const { contract_address, seat, last_ticket } = req.body;

    if (typeof seat !== "number" || seat <= 0) {
      return res.status(400).send({
        success: false,
        data: null,
        error: "Invalid Parameter",
      });
    }

    const receipt = await mintNFT(contract_address, seat);

    const tickets = Array.from({ length: seat }, (_, i) => ({
      ticket_number: last_ticket + i + 1,
    }));

    res.send({
      success: true,
      data: {
        event_hash: receipt.blockHash,
        tickets: tickets,
        contract_address: contract_address,
      },
      error: null,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      data: null,
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
