import { encodeFunctionData, Hex, parseEventLogs, toBytes, toHex } from "viem";
import { BEACON_FACTORY_ADDRESS, FORWARDER_ADDRESS } from "./constants";
import { BEACON_FACTORY_ABI } from "@/data/beacon-factory-abi";
import { deriveKey, publicClient } from "./common";
import { IDENTITY_MODULE_ABI } from "@/data/identity-module-abi";
import { GetIdentityDetailResponse } from "./types";
import { getArgon2idHash } from "@fileverse/crypto/argon";

import { generateKeyPairFromSeed } from "@stablelib/ed25519";
import * as ucans from "@ucans/ucans";
import { fromUint8Array } from "js-base64";
import {
  aesDecrypt,
  aesEncrypt,
  generateRSAKeyPair,
  toAESKey,
} from "@fileverse/crypto/webcrypto";
import { AgentClient } from "./agent";
import { generateRandomBytes } from "@fileverse/crypto/utils";

interface IdentityConstructorParams {
  accountPublicKey: Uint8Array;
  accountPrivateKey: Uint8Array;
  agentAddress: Hex;
  salt: Uint8Array;
  signingDid: string;
  agentClient: AgentClient;
  identityAddress: Hex;
}

export class Identity {
  accountPublicKey: Uint8Array;
  accountPrivateKey: Uint8Array;
  agentAddress: Hex;
  salt: Uint8Array;
  signingDid: string;
  agentClient: AgentClient;
  identityAddress: Hex;

  constructor(params: IdentityConstructorParams) {
    this.accountPublicKey = params.accountPublicKey;
    this.accountPrivateKey = params.accountPrivateKey;
    this.agentAddress = params.agentAddress;
    this.salt = params.salt;
    this.signingDid = params.signingDid;
    this.agentClient = params.agentClient;
    this.identityAddress = params.identityAddress;
  }
  static async getIdentityAddress(walletAddress: Hex) {
    const response = await publicClient.readContract({
      address: BEACON_FACTORY_ADDRESS,
      abi: BEACON_FACTORY_ABI,
      functionName: "identityModuleAddress",
      args: [walletAddress],
    });
    return response as Hex;
  }

  static async createNewIdentity(walletAddress: Hex, password: Hex) {
    const salt = generateRandomBytes(24);
    const ag2Hash = await getArgon2idHash(password, salt, "base64");

    const masterKey = deriveKey(ag2Hash, salt, "MASTER_KEY");
    const signingSeed = deriveKey(ag2Hash, salt, "SIGNING_KEY");
    const agentKey = deriveKey(ag2Hash, salt, "AGENT_KEY");

    const { publicKey, privateKey } = await generateRSAKeyPair(4096, "bytes");

    //Master key never leaves the device, used to encrypt the private key
    const masterAesKey = await toAESKey(masterKey);

    const encryptedPrivateKey = await aesEncrypt(masterAesKey, privateKey);

    const { secretKey: ucanSecret } = generateKeyPairFromSeed(signingSeed);
    const signingKey = ucans.EdKeypair.fromSecretKey(
      fromUint8Array(ucanSecret),
      {
        exportable: true,
      }
    );

    const agentClient = new AgentClient();
    await agentClient.initializeAgentClient(agentKey);

    const encodedCallData = encodeFunctionData({
      abi: BEACON_FACTORY_ABI,
      functionName: "createNewIdentityModule",
      args: [
        walletAddress,
        FORWARDER_ADDRESS,
        [
          toHex(salt),
          signingKey.did(),
          toHex(publicKey),
          toHex(encryptedPrivateKey),
          agentClient.getAgentAddress(),
        ],
      ],
    });

    const trxRecipt = await agentClient.executeUserOperationRequest(
      {
        contractAddress: BEACON_FACTORY_ADDRESS,
        data: encodedCallData,
      },
      120000 // timeout for recipt
    );

    if (!trxRecipt.success) throw new Error("Failed to create identity");

    const parsedLogs = parseEventLogs({
      abi: BEACON_FACTORY_ABI,
      eventName: "NewIdentityModule",
      logs: trxRecipt.logs,
    });

    if (parsedLogs.length === 0) throw new Error("Failed to create identity");
    // @ts-ignore
    const identityModuleAddress = parsedLogs[0].args.identityModule;

    return new Identity({
      accountPublicKey: publicKey,
      accountPrivateKey: privateKey,
      agentAddress: agentClient.getAgentAddress(),
      salt: toBytes(toHex(salt)),
      signingDid: signingKey.did(),
      agentClient: agentClient,
      identityAddress: identityModuleAddress,
    });
  }

  static async setupExistingIdentity(
    walletAddress: Hex,
    identityModuleAddress: Hex,
    password: Hex
  ) {
    const {
      accountPrivateKey,
      accountPublicKey,
      agentAddress,
      salt,
      signingDid,
    } = (await publicClient.readContract({
      address: identityModuleAddress,
      abi: IDENTITY_MODULE_ABI,
      functionName: "getIdentityModuleDetail",
      account: walletAddress,
    })) as GetIdentityDetailResponse;

    const saltBytes = toBytes(toHex(salt));
    const ag2Hash = await getArgon2idHash(password, saltBytes, "base64");

    const masterKey = deriveKey(ag2Hash, saltBytes, "MASTER_KEY");
    const signingSeed = deriveKey(ag2Hash, saltBytes, "SIGNING_KEY");
    const agentKey = deriveKey(ag2Hash, saltBytes, "AGENT_KEY");

    const { secretKey: ucanSecret } = generateKeyPairFromSeed(signingSeed);
    const signingKey = ucans.EdKeypair.fromSecretKey(
      fromUint8Array(ucanSecret),
      {
        exportable: true,
      }
    );

    if (signingKey.did() !== signingDid)
      throw new Error("Failed to setup existing identity, wrong password");

    const masterAesKey = await toAESKey(masterKey);

    const decryptedPrivateKey = await aesDecrypt(
      masterAesKey,
      toBytes(accountPrivateKey)
    );

    const agentClient = new AgentClient();
    await agentClient.initializeAgentClient(agentKey);

    return new Identity({
      accountPublicKey: toBytes(accountPublicKey),
      accountPrivateKey: decryptedPrivateKey,
      agentAddress: agentAddress,
      salt: saltBytes,
      signingDid: signingDid,
      agentClient: agentClient,
      identityAddress: identityModuleAddress,
    });
  }
}
