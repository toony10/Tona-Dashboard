export type { AuthTokens } from "@/lib/api/types";

/** Body accepted by `POST /api/auth/login`. */
export type LoginBody = {
  email?: string;
  password?: string;
};
