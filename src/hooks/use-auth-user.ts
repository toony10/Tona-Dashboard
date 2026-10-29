"use client";

import { useEffect, useState } from "react";

import {
  AUTH_USER_UPDATED_EVENT,
  getAuthUser,
} from "@/lib/auth/user-storage";
import type { AuthUser } from "@/types/auth";

/** Signed-in user from local storage; `isReady` is false until the first client read. */
export function useAuthUser() {
  const [authUser, setAuthUserState] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const sync = () => {
      setAuthUserState(getAuthUser());
      setIsReady(true);
    };
    sync();
    window.addEventListener(AUTH_USER_UPDATED_EVENT, sync);
    return () => window.removeEventListener(AUTH_USER_UPDATED_EVENT, sync);
  }, []);

  return { authUser, isReady };
}
