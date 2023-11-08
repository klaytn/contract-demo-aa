import { getGoogleAccountAPI, getJwt, parseJwt } from "./helper";

async function main() {
  const sub = process.env.SUB;
  if (!sub) {
    console.error("SUB is not set. Please run `npx hardhat 01_createOwner.ts`");
    process.exit(1);
  }

  const [, newOwner] = await hre.ethers.getSigners();

  const walletAPI = await getGoogleAccountAPI();
  const nonce = await walletAPI.getRecoveryNonce();

  const jwt = await getJwt(nonce);
  const { header, idToken, sig } = parseJwt(jwt);
  await walletAPI.recover(newOwner.address, header, idToken, sig);

  console.log("New owner:", await walletAPI.getOwner());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
