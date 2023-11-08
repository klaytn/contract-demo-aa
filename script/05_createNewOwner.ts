import { insertEnv } from "./helper";

async function main() {
  if (process.env.PRIVATE_KEY) {
    console.error("PRIVATE_KEY already exists in `.env` file. Please comment out the previous PRIVATE_KEY");
    process.exit(1);
  }

  const wallet = hre.ethers.Wallet.createRandom();
  const pk = wallet.privateKey;

  console.log("Created private key. Saving in `.env` file");
  insertEnv("PRIVATE_KEY", pk);
  console.log("Please go to faucet and top up this address:", wallet.address);
  console.log("Faucet: https://baobab.wallet.klaytn.foundation/faucet");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
