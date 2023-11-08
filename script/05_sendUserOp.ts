import { HttpRpcClient } from "@account-abstraction/sdk";
import { BoardAddress, EntryPointAddress, getGoogleAccountAPI } from "./helper";

async function createUserOp(content: string) {
  const walletAPI = await getGoogleAccountAPI();
  const board = await hre.ethers.getContractAt("Board", BoardAddress);

  return await walletAPI.createSignedUserOp({
    target: BoardAddress,
    data: board.interface.encodeFunctionData("write(string)", [content]),
  });
}

async function waitUserOpReceipt(userOpHash: string) {
  const bundlerProvider = new hre.ethers.providers.JsonRpcProvider(hre.network.config.bundler);
  for (;;) {
    let rc;
    try {
      rc = await bundlerProvider.send("eth_getUserOperationReceipt", [userOpHash]);
      if (rc != null) {
        console.log("txHash", rc.receipt.transactionHash);
        break;
      }
    } catch {
      // eslint no-empty: ["error", { allowEmptyCatch: true }]
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    process.stdout.write(".");
  }
}

async function main() {
  let content = process.env.CONTENT;
  if (!content) {
    console.error("env variable CONTENT empty. Using 'Hello world 안녕하세요' as default");
    content = "Hello world 안녕하세요";
  }

  const userOp = await createUserOp(content);

  const rpcClient = new HttpRpcClient(hre.network.config.bundler, EntryPointAddress, hre.network.config.chainId ?? 0);
  const userOpHash = await rpcClient.sendUserOpToBundler(userOp);

  await waitUserOpReceipt(userOpHash);
  console.log("Done");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
