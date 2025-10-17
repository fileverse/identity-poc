"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {  useWallets } from "@privy-io/react-auth";
import { Identity } from "@/utils/identity";
import { Hex } from "viem";

import { iDb } from "@/utils/dixie";
import usePrivyWrapped from "@/hooks/usePrivyWrapped";

export default function Info() {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { ready, authenticated, user, logout, getAccessToken } = usePrivyWrapped();
  const { wallets, ready: walletsReady } = useWallets();
  const [identity, setIdentity] = useState<Identity | null>(null);
  const [loading, setLoading] = useState(true);

  // Purposefully invalidate the JWT token in storage
  useEffect(() => {
    if (!authenticated || !user || loading) return

    if (timeoutRef.current) return

    console.log('Debug: Setting up token invalidation interval')
    timeoutRef.current = setTimeout(async () => {
      const existingJwt = localStorage.getItem("privy:token");
      
      if (!existingJwt) {
        timeoutRef.current = null;
        return
      }
      
      localStorage.setItem("privy:token", existingJwt.slice(-1) + 'X');
      // Let privy know we modified the token
      getAccessToken().catch(() => {
        // expected error
      }).finally(() => {
        console.log('Debug: Token invalidated');
        timeoutRef.current = null;
      })
    }, 10 * 1000); // every 10sec

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }

  }, [authenticated, user, loading, getAccessToken])


  useEffect(() => {
    const setupIdentity = async () => {
      if (!ready || !walletsReady) return;
      const wallet = wallets.find((w) => w.address === user?.wallet?.address);

      if (!wallet) router.push("/");
      const identityDetails = await iDb.getIdentity(wallet?.address as Hex);
      if (!identityDetails) {
        router.push("/");
        return;
      }

      const { identityAddress, password } = identityDetails;

      const identityInstance = await Identity.setupExistingIdentity(
        wallet?.address as Hex,
        identityAddress,
        password
      );
      setIdentity(identityInstance);
      setLoading(false);
    };
    setupIdentity();
  }, [ready, walletsReady, user, wallets, router]);

  const handleDisconnect = async () => {
    await logout();
    router.push("/");
  };

  const formatAddress = (address: string) => {
    if (!address) return "";
    return `${address.substring(0, 6)}...${address.substring(
      address.length - 4
    )}`;
  };

  if (!ready || !authenticated || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Identity Details
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Your decentralized identity information
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Identity Address
              </label>
              <p className="text-lg font-mono font-semibold text-slate-900 dark:text-white break-all mb-3">
                {identity?.identityAddress}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Short: {formatAddress(identity?.identityAddress || "")}
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Agent Address
              </label>
              <p className="text-lg font-mono font-semibold text-slate-900 dark:text-white break-all mb-3">
                {identity?.agentAddress}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Short: {formatAddress(identity?.agentAddress || "")}
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Signing DID
              </label>
              <p className="text-sm font-mono text-slate-900 dark:text-white break-all">
                {identity?.signingDid}
              </p>
            </div>

            <div className="p-6 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200 dark:border-slate-600">
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
                Wallet Address
              </label>
              <p className="text-lg font-mono font-semibold text-slate-900 dark:text-white break-all mb-3">
                {user?.wallet?.address}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Short: {formatAddress(user?.wallet?.address || "")}
              </p>
            </div>

            <button
              onClick={handleDisconnect}
              className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
