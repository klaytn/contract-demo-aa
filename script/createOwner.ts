import { appendEnv } from "./helper";

async function main() {
  if (process.env.PRIVATE_KEY) {
    console.log("Reusing the private key in .env file");
    return;
  }

  const wallet = hre.ethers.Wallet.createRandom();
  const pk = wallet.privateKey;

  console.log("Created private key. Saving in .env file");
  appendEnv("PRIVATE_KEY", pk);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
