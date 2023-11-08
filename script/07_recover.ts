import { getGoogleAccountAPI, parseJwt } from "./helper";

async function main() {
  const jwt = process.env.JWT;
  if (!jwt) {
    console.error("JWT does not exist in `.env` file. Please run `npx hardhat 06_getJwt.ts`");
    process.exit(1);
  }

  const [newOwner] = await hre.ethers.getSigners();
  const walletAPI = await getGoogleAccountAPI();
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
