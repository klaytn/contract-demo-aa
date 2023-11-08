import { getGoogleAccountAPI } from "./helper";

async function main() {
  if (!process.env.PRIVATE_KEY) {
    console.error("JWT does not exist in `.env` file. Please run `npx hardhat 01_createOwner.ts`");

    process.exit(1);
  }

  const [owner] = await hre.ethers.getSigners();
  const walletAPI = await getGoogleAccountAPI();
  const counterfactualAddress = await walletAPI.getAccountAddress();
  const tx = await owner.sendTransaction({
    to: counterfactualAddress,
    value: hre.ethers.utils.parseEther("1"),
  });
  await tx.wait();
  const bal = await hre.ethers.provider.getBalance(counterfactualAddress);
  console.log(`Balance of ${counterfactualAddress}: ${hre.ethers.utils.formatEther(bal)} KLAY`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
