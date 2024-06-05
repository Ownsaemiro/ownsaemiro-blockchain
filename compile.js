const readline = require('readline');
const input = readFileSync("dev/stdin").toString();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
  const name = await askQuestion('이름이 무엇인가요? ');
  const age = await askQuestion('나이가 어떻게 되나요? ');
  console.log(`안녕하세요, ${name}님! 당신의 나이는 ${age}살 입니다.`);
  rl.close();
}

main();
