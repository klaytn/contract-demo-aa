import { BaseAccountAPI, BaseApiParams } from "@account-abstraction/sdk/dist/src/BaseAccountAPI";
import { ethers } from "ethers";
import { arrayify, hexConcat } from "ethers/lib/utils";
import * as fs from "fs";
import * as jose from "jose";

export const BoardAddress = "0x6EBc87749C2d618F3eE13F8A5d6293986794326a";
export const EntryPointAddress = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
export const GoogleAccountFactoryAddress = "0x59dBa8ea57D435b00BF74B7CE306215E5f810523";
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

export async function getEnv() {
  const sub = process.env.SUB;
  if (!sub) {
    console.error("SUB is not set. Please run `npx hardhat 02_getJwt.ts`");
    process.exit(1);
  }
  return { sub };
}

export async function getJwt(nonce: string) {
  let sub = process.env.SUB;
  if (!sub) {
    sub = generateSub();
    appendEnv("SUB", sub);
  }
  const now = Math.floor(new Date().getTime() / 1000);
  const idToken = {
    iss: "http://server.example.com",
    aud: "klaytn-contract-demo-aa",
    sub: sub,
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

export interface GoogleAccountApiParams extends BaseApiParams {
  owner: ethers.Signer;
  sub: string;
  factoryAddress?: string;
  index?: ethers.BigNumberish;
}

export class GoogleAccountAPI extends BaseAccountAPI {
  factoryAddress?: string;
  owner: ethers.Signer;
  index: ethers.BigNumberish;
  sub: string;

  accountContract?: ethers.Contract;
  factory?: ethers.Contract;

  constructor(params: GoogleAccountApiParams) {
    super(params);
    this.factoryAddress = params.factoryAddress;
    this.owner = params.owner;
    this.index = ethers.BigNumber.from(params.index ?? 0);
    this.sub = params.sub;
  }

  async _getAccountContract(): Promise<ethers.Contract> {
    if (this.accountContract == null) {
      this.accountContract = await hre.ethers.getContractAt("IGoogleAccount", await this.getAccountAddress());
    }
    return this.accountContract;
  }

  async getAccountInitCode(): Promise<string> {
    if (this.factory == null) {
      if (this.factoryAddress != null && this.factoryAddress !== "") {
        this.factory = await hre.ethers.getContractAt("IGoogleAccountFactory", this.factoryAddress);
      } else {
        throw new Error("no factory to get initCode");
      }
    }
    return hexConcat([
      this.factory.address,
      this.factory.interface.encodeFunctionData("createAccount", [await this.owner.getAddress(), this.index, this.sub]),
    ]);
  }

  async getNonce(): Promise<ethers.BigNumber> {
    if (await this.checkAccountPhantom()) {
      return ethers.BigNumber.from(0);
    }
    const accountContract = await this._getAccountContract();
    return await accountContract.getNonce();
  }

  async encodeExecute(target: string, value: ethers.BigNumberish, data: string): Promise<string> {
    const accountContract = await this._getAccountContract();
    return accountContract.interface.encodeFunctionData("execute", [target, value, data]);
  }

  async getRecoveryNonce() {
    const accountContract = await this._getAccountContract();
    return await accountContract.recoveryNonce();
  }

  async getOwner() {
    const accountContract = await this._getAccountContract();
    return await accountContract.owner();
  }

  async recover(newOwner: string, header: string, idToken: string, sig: string) {
    const accountContract = await this._getAccountContract();
    const tx = await accountContract.updateOwnerByGoogleOIDC(newOwner, header, idToken, sig);
    await tx.wait();
    return tx;
  }

  async signUserOpHash(userOpHash: string): Promise<string> {
    return await this.owner.signMessage(arrayify(userOpHash));
  }
}

export function parseJwt(jwtToken: string) {
  const [header, payload, signature] = jwtToken.split(".");
  const idToken = atob(payload);
  const sig = "0x" + Buffer.from(signature, "base64").toString("hex");
  const sub = JSON.parse(idToken).sub;
  const nonce = JSON.parse(idToken).nonce;
  return { header, payload, idToken, sig, sub, nonce };
}

export async function getGoogleAccountAPI() {
  const { sub } = await getEnv();
  const [owner] = await hre.ethers.getSigners();
  const walletAPI = new GoogleAccountAPI({
    provider: hre.ethers.provider,
    owner,
    sub: sub,

    // constants
    entryPointAddress: EntryPointAddress,
    factoryAddress: GoogleAccountFactoryAddress,
    overheads: { fixed: 50000 },
  });
  return walletAPI;
}
