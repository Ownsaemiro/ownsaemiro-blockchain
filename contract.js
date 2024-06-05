const fs = require('fs-extra');
const path = require('path');
const solc = require('solc');

// Solidity 파일 경로 설정
const contractPath = path.join(__dirname, "./contracts", 'MintContract.sol');
const source = fs.readFileSync(contractPath, 'utf8');

// 컴파일 입력 설정
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
                '*': ['abi', 'evm.bytecode'],
            },
        },
    },
};

// 파일 시스템에서 import를 처리하는 함수
function findImports(importPath) {
    try {
        const fullPath = path.resolve(__dirname, "node_modules", importPath);
        const content = fs.readFileSync(fullPath, 'utf8');
        return { contents: content };
    } catch (error) {
        return { error: `File not found: ${importPath}` };
    }
}

// 컴파일 수행
const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

if (output.errors) {
    output.errors.forEach(err => {
        console.error(err.formattedMessage);
    });
}

console.log(output);
