import { appendEnv } from "./helper";

async function main() {
  if (process.env.NEW_PRIVATE_KEY) {
    console.error("NEW_PRIVATE_KEY already exists in `.env` file");
    process.exit(1);
  }

  const wallet = hre.ethers.Wallet.createRandom();
  const pk = wallet.privateKey;

  console.log("Created private key. Saving in `.env` file");
  appendEnv("NEW_PRIVATE_KEY", pk);
  console.log("Please go to faucet and top up this address:", wallet.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
