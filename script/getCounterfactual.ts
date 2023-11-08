import { getGoogleAccountAPI } from "./helper";

async function main() {
  const walletAPI = await getGoogleAccountAPI();
  console.log("Counterfactual address:", await walletAPI.getAccountAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
