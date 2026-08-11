/** Tokens returned by the backend auth endpoints (login / refresh). */
export type AuthTokens = {
  accessToken: string;
  refreshToken: string;
  /** Access-token lifetime in seconds (optional; JWT `exp` used as fallback). */
  expiresIn?: number;
  /** Refresh-token lifetime in seconds (optional; JWT `exp` used as fallback). */
  refreshExpiresIn?: number;
};

/** Body accepted by `POST /api/auth/login`. */
export type LoginBody = {
  email?: string;
  password?: string;
};
