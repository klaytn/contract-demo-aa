import { appendEnv, getJwt, parseJwt } from "./helper";

async function main() {
  if (!process.env.SUB) {
    console.error("SUB already exists. Exiting...");
    process.exit(1);
  }

  const jwt = await getJwt("0");
  console.log("Fetched `sub` field from JWT. Saving in `.env` file");
  const { sub } = parseJwt(jwt);
  appendEnv("SUB", sub);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
