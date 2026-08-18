import { getJwtMaxAgeSeconds } from "./get-jwt-max-age";

export function isValidAccessToken(token: string | undefined) {
  if (!token) return false;

  const maxAge = getJwtMaxAgeSeconds(token);
  return !!maxAge && maxAge > 0;
}
