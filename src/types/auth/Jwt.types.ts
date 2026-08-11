/** Decoded JWT payload (unverified). Only claims we read are typed. */
export type JwtPayload = {
  exp?: number;
  [key: string]: unknown;
};
