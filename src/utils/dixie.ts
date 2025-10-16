import Dexie, { Table } from "dexie";
import { Hex } from "viem";

interface IdentityCache {
  walletAddress: Hex;
  password: Hex;
  identityAddress: Hex;
}
export class DexieDatabase extends Dexie {
  identities!: Table<IdentityCache>;

  constructor() {
    super("identity-poc");
    this.version(1).stores({
      identities: "walletAddress",
    });
  }

  async getIdentity(walletAddress: Hex) {
    return this.identities.get({ walletAddress });
  }

  async saveIdentity(walletAddress: Hex, password: Hex, identityAddress: Hex) {
    const existingIdentity = await this.getIdentity(walletAddress);
    if (existingIdentity) {
      await this.identities.update(
        { walletAddress },
        { password, identityAddress }
      );
    } else {
      await this.identities.add({
        walletAddress,
        password,
        identityAddress,
      });
    }
  }
}

export const iDb = new DexieDatabase();
