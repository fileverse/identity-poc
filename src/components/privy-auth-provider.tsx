"use client";
import { PrivyProvider } from "@privy-io/react-auth";
import { PRIVY_APP_ID } from "@/utils/constants";

export const PrivyAuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <PrivyProvider
      appId={PRIVY_APP_ID}
      config={{
        appearance: {
          showWalletLoginFirst: false,
        },
        loginMethods: [
          "email",
          "wallet",
          "twitter",
          "farcaster",
          "github",
          "discord",
        ],
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          },
          solana: {
            createOnLogin: "off",
          },
          requireUserPasswordOnCreate: false,
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
};
