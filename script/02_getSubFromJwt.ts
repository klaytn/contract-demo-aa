import { insertEnv, getJwt, parseJwt } from "./helper";

async function main() {
  const jwt = await getJwt("0");
  const { sub } = parseJwt(jwt);
  console.log("Fetched `sub` field from JWT. Saving in `.env` file");
  insertEnv("SUB", sub);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
