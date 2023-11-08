import { BoardAddress } from "./helper";

async function main() {
  const board = await hre.ethers.getContractAt("Board", BoardAddress);
  const articles = await board.readAll();
  if (articles.length == 0) {
    console.log("Board is empty");
    return;
  }
  for (let i = 0; i < articles.length; i++) {
    const [writer, content] = articles[i];
    console.log(`Article #${i}`);
    console.log(`* Writer: ${writer}`);
    console.log(`* Content: ${content}\n`);
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
