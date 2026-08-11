/**
 * API configuration. `API_URL` must be set in `.env.local` (server-side only,
 * never exposed to the browser).
 */
export function getApiBaseUrl(): string {
  const baseUrl = process.env.API_URL;

  if (!baseUrl) {
    throw new Error(
      "Missing API_URL environment variable. Add it to .env.local (see .env.example).",
    );
  }

  return baseUrl.replace(/\/+$/, "");
}
