import type { AuthUser } from "@/types/auth";

export const AUTH_USER_STORAGE_KEY = "auth-user";
export const AUTH_USER_UPDATED_EVENT = "auth-user-updated";

export function setAuthUser(user: AuthUser) {
  localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_USER_UPDATED_EVENT));
}

export function patchAuthUser(
  patch: Partial<Pick<AuthUser, "fullName" | "avatar">>,
) {
  const current = getAuthUser();
  if (!current) return;

  setAuthUser({ ...current, ...patch });
}

export function getAuthUser(): AuthUser | null {
  const stored = localStorage.getItem(AUTH_USER_STORAGE_KEY);
  if (!stored) return null;

  try {
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuthUser() {
  localStorage.removeItem(AUTH_USER_STORAGE_KEY);
}
