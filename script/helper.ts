import { BaseAccountAPI, BaseApiParams } from "@account-abstraction/sdk/dist/src/BaseAccountAPI";
import { ethers } from "ethers";
import { arrayify, hexConcat } from "ethers/lib/utils";
import * as fs from "fs";

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
  const [owner] = await hre.ethers.getSigners();
  if (!owner) {
    console.error("PRIVATE_KEY is not set. Please run `npx hardhat 01_createOwner.ts`");
    process.exit(1);
  }

  const sub = process.env.SUB;
  if (!sub) {
    console.error("SUB is not set. Please run `npx hardhat 02_getJwt.ts`");
    process.exit(1);
  }
  return { owner, sub };
}

export async function getCounterfactualAddress(ownerAddr: string, sub: string) {
  const factory = await hre.ethers.getContractAt("IGoogleAccountFactory", GoogleAccountFactoryAddress);
  return await factory.getAddress(ownerAddr, 0, sub);
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

  async signUserOpHash(userOpHash: string): Promise<string> {
    return await this.owner.signMessage(arrayify(userOpHash));
  }
}
