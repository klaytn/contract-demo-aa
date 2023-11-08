import { insertEnv, getGoogleAccountAPI, getJwt } from "./helper";

async function main() {
  const addr = process.env.INITIAL_OWNER_ADDRESS;
  if (!addr) {
    console.error("INITIAL_OWNER_ADDRESS does not exist in `.env` file. Please go back to step 1");
    process.exit(1);
  }

  const walletAPI = await getGoogleAccountAPI();
  const nonce = await walletAPI.getRecoveryNonce();
  const jwt = await getJwt(nonce.toString());
  console.log("JWT fetched. Saving in `.env` file");
  insertEnv("JWT", jwt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
