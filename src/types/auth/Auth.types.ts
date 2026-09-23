import type { AuthTokens } from "@/lib/api/types";

export type { AuthTokens };

export type LoginBody = {
  email: string;
  password: string;
};

export type ForgotPasswordBody = {
  email: string;
};

export type ResetPasswordBody = {
  email: string;
  code: string;
  password: string;
};

export type ChangePasswordBody = {
  currentPassword: string;
  newPassword: string;
};

export type AuthUser = {
  id: string;
  email: string;
  role?: string;
  fullName?: string | null;
  avatar?: string | null;
};

export type LoginData = AuthTokens & Partial<AuthUser>;
