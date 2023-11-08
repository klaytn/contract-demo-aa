import * as fs from "fs";

export const GoogleAccountFactory = "0x59dBa8ea57D435b00BF74B7CE306215E5f810523";
export const envPath = __dirname + "/../.env";
export function appendEnv(key: string, val: string) {
  fs.appendFileSync(envPath, `${key}=${val}\n`);
}

export function generateSub(): string {
  const chars = "0123456789";
  const sublen = 10;
  let sub = "";
  for (let i = 0; i < sublen; i++) {
    const rand = Math.floor(Math.random() * chars.length);
    sub += chars[rand];
  }
  return sub;
}

export function getAddress(pk: string): string {
  return new hre.ethers.Wallet(pk).address;
}
