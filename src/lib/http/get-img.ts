export function getImg(src: string): string {
  if (src.startsWith("http")) {
    return src;
  }

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, "");
  const path = src.startsWith("/") ? src : `/${src}`;

  return `${base}/files${path}`;
}
