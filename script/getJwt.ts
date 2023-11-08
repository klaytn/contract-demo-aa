import * as fs from "fs";
import * as jose from "jose";
import { appendEnv, generateSub } from "./helper";

async function get_jwt(nonce: string) {
  let sub = process.env.SUB;
  if (!sub) {
    sub = generateSub();
    appendEnv("SUB", sub);
  }

  const now = Math.floor(new Date().getTime() / 1000);
  const idToken = {
    iss: "http://server.example.com",
    aud: "klaytn-contract-demo-aa",
    iat: now,
    exp: now + 3600,
    nonce: nonce,
    email: "janedoe@example.com",
  };

  const pk = fs.readFileSync(__dirname + "/../key.pem");
  const privKey = await jose.importPKCS8(pk.toString(), "RSA");

  const jwt = await new jose.CompactSign(new TextEncoder().encode(JSON.stringify(idToken)))
    .setProtectedHeader({ alg: "RS256", typ: "JWT" })
    .sign(privKey);
  return jwt;
}

async function main() {
  let nonce = process.env.NONCE;
  if (!nonce) {
    nonce = "0";
  }
  const jwt = await get_jwt(nonce);
  console.log(jwt);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
