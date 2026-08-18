export function getJwtMaxAgeSeconds(token: string | undefined) {
  if (!token) return undefined;

  const segments = token.split(".");
  if (segments.length < 2) return undefined;

  try {
    const normalized = segments[1]!.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(
      normalized.length + ((4 - (normalized.length % 4)) % 4),
      "=",
    );
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf-8")) as {
      exp?: unknown;
    };

    if (typeof payload.exp !== "number") return undefined;

    const secondsUntilExpiry = Math.floor(payload.exp - Date.now() / 1000);
    if (secondsUntilExpiry <= 0) return undefined;

    return secondsUntilExpiry;
  } catch {
    return undefined;
  }
}
