import { insertEnv } from "./helper";

async function main() {
  const wallet = hre.ethers.Wallet.createRandom();
  const pk = wallet.privateKey;

  console.log("Created private key.");
  insertEnv("PRIVATE_KEY", pk);
  insertEnv("INITIAL_OWNER_ADDRESS", wallet.address);
  console.log("Please go to faucet and top up this address:", wallet.address);
  console.log("Faucet: https://baobab.wallet.klaytn.foundation/faucet");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
