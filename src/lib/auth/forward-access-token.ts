import { NextRequest } from "next/server";

import { ACCESS_TOKEN_HEADER } from "./constants";

/**
 * Drop a client-supplied `x-access-token` so `getAuthToken` only trusts a
 * value the proxy set after a server-side refresh.
 *
 * Clones the request only when the header is present, so Server Action bodies
 * are not rewritten on the common path.
 */
export function withoutClientAccessTokenHeader(request: NextRequest): NextRequest {
  if (!request.headers.has(ACCESS_TOKEN_HEADER)) {
    return request;
  }

  const headers = new Headers(request.headers);
  headers.delete(ACCESS_TOKEN_HEADER);
  return new NextRequest(request, { headers });
}

/** Attach the post-refresh access token for this request (Set-Cookie is next-request only). */
export function withAccessTokenHeader(request: NextRequest, accessToken: string): NextRequest {
  const headers = new Headers(request.headers);
  headers.delete(ACCESS_TOKEN_HEADER);
  headers.set(ACCESS_TOKEN_HEADER, accessToken);
  return new NextRequest(request, { headers });
}
