export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID as string;
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL as string;
const PIMLICO_API_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY as string;

export const BUNDLER_URL = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${PIMLICO_API_KEY}`;

export const BEACON_FACTORY_ADDRESS =
  "0x29Cefb7074E26Ca5766060fBb56f86DFdBfa40D6";

export const FORWARDER_ADDRESS = "0x2aA0f271f40ce811fcB2feA1b7186F36b70EF4ad";
