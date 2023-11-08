import { getGoogleAccountAPI } from "./helper";

async function main() {
  const [, newOwner] = await hre.ethers.getSigners();
  if (!process.env.NEW_PRIVATE_KEY) {
    console.error("NEW_PRIVATE_KEY is not set. Please run `npx hardhat 06_createNewOwner.ts`");
    process.exit(1);
  }
  const walletAPI = await getGoogleAccountAPI();
  const scwAddress = await walletAPI.getAccountAddress();

  walletAPI.recover(newOwner.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
