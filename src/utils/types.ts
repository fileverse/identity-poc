import {
  EncodeDeployDataReturnType,
  Hex,
  Chain,
  RpcSchema,
  Client,
  Transport,
} from "viem";
import type { SmartAccountClient } from "permissionless";
import { SmartAccount } from "viem/account-abstraction";

export interface GetIdentityDetailResponse {
  accountPrivateKey: Hex;
  accountPublicKey: Hex;
  agentAddress: Hex;
  salt: bigint;
  signingDid: string;
}

export interface IExecuteUserOperationRequest {
  contractAddress: Hex;
  data: EncodeDeployDataReturnType;
}

export type TSmartAccountClient = SmartAccountClient<
  Transport,
  Chain,
  SmartAccount,
  Client,
  RpcSchema
>;
