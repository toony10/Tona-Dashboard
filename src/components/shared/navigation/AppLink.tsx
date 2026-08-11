import type { ComponentProps } from "react";
import { Link } from "@/i18n/navigation";

type AppLinkProps = ComponentProps<typeof Link>;

/**
 * Locale-aware Link wrapper with prefetch disabled by default.
 * Prefer this over raw `next/link` so routes stay under `/[locale]/…`.
 */
export function AppLink({
  prefetch = false,
  className,
  ...props
}: AppLinkProps) {
  return <Link prefetch={prefetch} className={className} {...props} />;
}
