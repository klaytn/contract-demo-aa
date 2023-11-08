import { appendEnv, getGoogleAccountAPI, getJwt, parseJwt } from "./helper";

async function main() {
  const sub = process.env.SUB;
  if (!sub) {
    console.error("SUB does not exist in `.env` file. Please run `npx hardhat 06_createOwner.ts`");
    process.exit(1);
  }

  const walletAPI = await getGoogleAccountAPI();
  const nonce = await walletAPI.getRecoveryNonce();
  const jwt = await getJwt(nonce);
  appendEnv("JWT", jwt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
