import { GoogleAccountFactory, getAddress } from "./helper";

async function main() {
  const factory = await hre.ethers.getContractAt("IGoogleAccountFactory", GoogleAccountFactory);
  const pk = process.env.PRIVATE_KEY;
  if (!pk) {
    console.error("PRIVATE_KEY is not set. Please run createOwner.ts");
    return;
  }

  const sub = process.env.SUB;
  if (!sub) {
    console.error("SUB is not set. Please run getJwt.ts");
    return;
  }

  const ownerAddress = getAddress(pk);
  const counterfactualAddress = await factory.getAddress(ownerAddress, 0, sub);
  console.log("Counterfactual address", counterfactualAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
