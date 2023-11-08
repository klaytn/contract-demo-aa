import { getCounterfactualAddress, getEnv } from "./helper";

async function main() {
  const { owner, sub } = await getEnv();
  const counterfactualAddress = await getCounterfactualAddress(owner.address, sub);
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
