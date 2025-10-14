import { toHex } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import {
  getSmartAccountClient,
  getNonce,
  waitForUserOpReceipt,
} from "./common";

import { IExecuteUserOperationRequest, TSmartAccountClient } from "./types";

export class AgentClient {
  private smartAccountAgent: TSmartAccountClient | null = null;
  private readonly MAX_CALL_GAS_LIMIT = 5000000;

  async initializeAgentClient(keyMaterial: Uint8Array) {
    const agentAccount = privateKeyToAccount(toHex(keyMaterial));
    const smartAccountClient = await getSmartAccountClient(agentAccount);
    this.smartAccountAgent = smartAccountClient;
  }

  getSmartAccountAgent() {
    if (!this.smartAccountAgent)
      throw new Error("Agent client not initialized");

    return this.smartAccountAgent;
  }

  getAgentAddress() {
    const smartAccountAgent = this.getSmartAccountAgent();
    return smartAccountAgent.account.address;
  }

  getAgentAccount() {
    const smartAccountAgent = this.getSmartAccountAgent();
    return smartAccountAgent.account;
  }

  destroyAgentClient() {
    this.smartAccountAgent = null;
  }

  async getCallData(
    request: IExecuteUserOperationRequest | IExecuteUserOperationRequest[]
  ) {
    const agentAccount = this.getAgentAccount();
    if (Array.isArray(request)) {
      if (request.length === 0 || request.length > 10)
        throw new Error("Request length must be between 1 and 10");

      const encodedCallData = [];
      for (let i = 0; i < request.length; i++) {
        encodedCallData.push({
          to: request[i].contractAddress,
          data: request[i].data,
          value: BigInt(0),
        });
      }

      return await agentAccount.encodeCalls(encodedCallData);
    }

    return await agentAccount.encodeCalls([
      {
        to: request.contractAddress,
        data: request.data,
        value: BigInt(0),
      },
    ]);
  }

  async sendUserOperation(
    request: IExecuteUserOperationRequest | IExecuteUserOperationRequest[],
    customGasLimit?: number
  ) {
    try {
      const smartAccountAgent = this.getSmartAccountAgent();

      const callData = await this.getCallData(request);

      return await smartAccountAgent.sendUserOperation({
        callData,
        callGasLimit: BigInt(customGasLimit || this.MAX_CALL_GAS_LIMIT),
        nonce: getNonce(),
      });
    } catch (error) {
      throw error;
    }
  }

  async executeUserOperationRequest(
    request: IExecuteUserOperationRequest | IExecuteUserOperationRequest[],
    timeout: number,
    customGasLimit?: number
  ) {
    const userOpHash = await this.sendUserOperation(request, customGasLimit);
    return await waitForUserOpReceipt(userOpHash, timeout);
  }

  resetAgentClient() {
    this.smartAccountAgent = null;
  }
}
