"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePrivy, useWallets } from "@privy-io/react-auth";
import { Button } from "@/components/button";
import { privyWalletToClient } from "@/utils/common";
import { Identity } from "@/utils/identity";
import { Hex, zeroAddress } from "viem";
import { toast } from "react-toastify";

type AuthMode = "connect-wallet" | "sign-message";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<AuthMode>("connect-wallet");

  const { ready, authenticated, user, login } = usePrivy();
  const { wallets } = useWallets();

  useEffect(() => {
    if (!ready) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }, [ready, authenticated, user, router]);

  const handleLogin = () => {
    try {
      login();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (authenticated && user) {
      setMode("sign-message");
    }
  }, [authenticated, user]);

  const handleSignMessage = async () => {
    try {
      const wallet = wallets.find((w) => w.address === user?.wallet?.address);
      if (!wallet) throw new Error("Wallet not found");
      setLoading(true);
      const walletClient = await privyWalletToClient(wallet);
      const signature = await walletClient.signMessage({
        message: "Sign in to Fileverse",
      });

      const identityAddress = await Identity.getIdentityAddress(
        user?.wallet?.address as Hex
      );

      let identityInstance: Identity;

      if (identityAddress === zeroAddress) {
        toast.info("Creating new identity", {
          autoClose: false,
        });
        identityInstance = await Identity.createNewIdentity(
          user?.wallet?.address as Hex,
          signature
        );
      } else {
        toast.info("Setting up existing identity", {
          autoClose: false,
        });
        identityInstance = await Identity.setupExistingIdentity(
          user?.wallet?.address as Hex,
          identityAddress,
          signature
        );
      }
      toast.dismiss();
      if (!identityInstance) throw new Error("Failed to get identity");

      localStorage.setItem(
        "identity-details",
        JSON.stringify({
          identityAddress: identityInstance.identityAddress,
          password: signature,
        })
      );

      router.push("/info");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in or create an account to continue
            </p>
          </div>

          <Button
            onClick={
              mode === "connect-wallet" ? handleLogin : handleSignMessage
            }
            loading={loading}
          >
            {mode === "connect-wallet" ? "Connect Wallet" : "Sign Message"}
          </Button>
        </div>
      </div>
    </div>
  );
}
