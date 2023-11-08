import { getCounterfactualAddress, getEnv } from "./helper";

async function main() {
  const { owner, sub } = await getEnv();
  const counterfactualAddress = await getCounterfactualAddress(owner.address, sub);
  console.log("Counterfactual address", counterfactualAddress);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
