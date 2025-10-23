import { privyWalletToClient } from "@/utils/common";
import { PrivyInterface, usePrivy, User, useWallets } from "@privy-io/react-auth";
import { useEffect, useRef, useState } from "react";

const PRIVY_MODAL_STYLE_ID = "headlessui-portal-root-style";

export interface ExtendedPrivyInterface extends PrivyInterface {
  isErc8019Enabled: boolean;
}

/**
 * A custom hook that wraps the usePrivy hook and adds ERC-8019 auto-login support.
 * It stores the previous user temporarily to handle brief unauthenticated states during token refresh.
 */
const usePrivyWrapped = (options?: {
  hideModalOnAutoLogin?: boolean;
}): ExtendedPrivyInterface => {
  const { hideModalOnAutoLogin = true } = options || {};
  const previousUser = useRef<User | null>(null);
  const userResetTimeout = useRef<NodeJS.Timeout | null>(null);
  const [hasLoggedOutManually, setHasLoggedOutManually] = useState(() => {
    if (typeof window === 'undefined') return false;

    return localStorage.getItem('hasLoggedOutManually') === 'true';
  })
  const [isErc8019Enabled, setIsErc8019Enabled] = useState(false);
  const privyResponse = usePrivy()
  const { wallets, ready: walletsReady } = useWallets();
  const { ready, authenticated, user } = privyResponse;

  const updateHasLoggedOutManually = (value: boolean) => {
    setHasLoggedOutManually(value);
    if (typeof window !== 'undefined') {
      localStorage.setItem('hasLoggedOutManually', value ? 'true' : 'false');
    }
  }

  const checkIsErc8019Enabled = async () => {
    if (!wallets.length) return false;

    try {
      const wallet = wallets[0];

      const walletClient = await privyWalletToClient(wallet);

      const response: any = await walletClient.request({
        // @ts-ignore
        method: 'wallet_getCurrentAutoLoginPolicy',
        params: [],
      });

      return !!response?.activePolicy;
    } catch (err) {
      console.error('Error during ERC-8019 support check', err);
      return false;
    }
  }

  const logoutWrapped = async () => {
    // Clean up any modal hiding styles
    const existingStyle = document.getElementById(PRIVY_MODAL_STYLE_ID);
    if (existingStyle) {
      document.head.removeChild(existingStyle);
    }

    previousUser.current = null;
    updateHasLoggedOutManually(true);
    if (userResetTimeout.current) {
      clearTimeout(userResetTimeout.current);
      userResetTimeout.current = null;
    }

    return privyResponse.logout();
  }

  // Check for ERC-8019 support and auto-login if enabled.
  useEffect(() => {
    if (ready && walletsReady && wallets.length && !authenticated && !hasLoggedOutManually) {
      checkIsErc8019Enabled().then(async (enabled) => {
        setIsErc8019Enabled(enabled);
        console.log('Debug: ERC-8019 support check result', { enabled, firstWallet: wallets[0] });
        if (!enabled) {
          return
        }

        if (hideModalOnAutoLogin) {
          // Hide Privy's modal for a seamless experience
          const style = document.createElement('style');
          style.id = PRIVY_MODAL_STYLE_ID;
          style.textContent = '#headlessui-portal-root { display: none !important; }';
          document.head.appendChild(style);
        }

        await wallets[0].loginOrLink()
      }).catch((err) => {
        console.error('Error checking ERC-8019 support', err);
      })
    }
  }, [wallets.length, walletsReady, authenticated, hasLoggedOutManually, ready])

  // Store the previous user to handle brief unauthenticated states during token refresh.
  useEffect(() => {
    if (user) {
      console.log('Debug: User authenticated');
      previousUser.current = user;
      updateHasLoggedOutManually(false);
    }
  }, [user])

  // Handle grace period for reauthentication
  // Reset the previous user after the grace period if not reauthenticated
  useEffect(() => {
    if (user || !previousUser.current || userResetTimeout.current) {
      if (userResetTimeout.current) {
        clearTimeout(userResetTimeout.current);
        userResetTimeout.current = null;
      }
      return
    }

    console.log('Debug: User unathenticated, allowing grace period for reauthentication');
    // Allow the wallet to reauthenticate within a short grace period
    userResetTimeout.current = setTimeout(() => {
      console.log('Debug: Grace period ended, user cleared');
      previousUser.current = null;
      userResetTimeout.current = null;
    }, 10 * 1000); // 10 seconds
  }, [user])

  return {
    ...privyResponse,
    isErc8019Enabled,
    logout: logoutWrapped,
    user: user || previousUser.current,
    authenticated: !!(authenticated || previousUser.current),
  };
}

export default usePrivyWrapped;