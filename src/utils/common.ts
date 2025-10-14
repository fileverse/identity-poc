import {
  createPublicClient,
  createWalletClient,
  custom,
  hexToBigInt,
  http,
  PrivateKeyAccount,
  toHex,
  toBytes,
  Hex,
} from "viem";
import { generatePrivateKey } from "viem/accounts";
import { RPC_URL, BUNDLER_URL } from "./constants";
import { sepolia } from "viem/chains";
import { createPimlicoClient } from "permissionless/clients/pimlico";
import { createSmartAccountClient } from "permissionless";
import { toSafeSmartAccount } from "permissionless/accounts";
import { entryPoint07Address } from "viem/account-abstraction";
import { ConnectedWallet } from "@privy-io/react-auth";
import { TSmartAccountClient } from "./types";
import { deriveHKDFKey } from "@fileverse/crypto/kdf";

export const publicClient = createPublicClient({
  transport: http(RPC_URL),
  chain: sepolia,
});

export const pimlicoClient = createPimlicoClient({
  transport: http(BUNDLER_URL),
  entryPoint: {
    address: entryPoint07Address,
    version: "0.7",
  },
});

export const signerToSmartAccount = async (signer: PrivateKeyAccount) =>
  await toSafeSmartAccount({
    client: publicClient,
    owners: [signer],
    entryPoint: {
      address: entryPoint07Address,
      version: "0.7",
    },
    version: "1.4.1",
  });

export const getSmartAccountClient = async (
  signer: PrivateKeyAccount
): Promise<TSmartAccountClient> => {
  const smartAccount = await signerToSmartAccount(signer);

  return createSmartAccountClient({
    account: smartAccount,
    chain: sepolia,
    paymaster: pimlicoClient,
    bundlerTransport: http(BUNDLER_URL),
    userOperation: {
      estimateFeesPerGas: async () =>
        (await pimlicoClient.getUserOperationGasPrice()).fast,
    },
  });
};

export const privyWalletToClient = async (wallet: ConnectedWallet) => {
  const eip1193Provider = await wallet.getEthereumProvider();
  return createWalletClient({
    account: wallet.address as `0x${string}`,
    chain: sepolia,
    transport: custom(eip1193Provider),
  });
};

export const waitForUserOpReceipt = async (hash: Hex, timeout = 120000) => {
  const receipt = await pimlicoClient.waitForUserOperationReceipt({
    hash,
    timeout,
  });

  if (!receipt.success)
    throw new Error(`Failed to execute user operation: ${receipt.reason}`);
  return receipt;
};

export const getNonce = () =>
  hexToBigInt(
    toHex(toBytes(generatePrivateKey()).slice(0, 24), {
      size: 32,
    })
  );

export const deriveKey = (password: string, salt: Uint8Array, info: string) => {
  return deriveHKDFKey(
    Buffer.from(password),
    Buffer.from(salt),
    Buffer.from(info)
  );
};
