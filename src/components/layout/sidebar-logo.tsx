import { Logo } from "@/components/shared/logo/Logo";

/**
 * Full-width logo that shrinks to the mark when the sidebar collapses. Collapsed, the lockup is
 * 7.5rem wide so its mark is 2rem, the size of the icon buttons; the wordmark fades and is clipped.
 */
export function SidebarLogo() {
  return (
    <Logo
      fill
      className="transition-[width] duration-200 ease-linear group-data-[collapsible=icon]:w-[7.5rem] motion-reduce:transition-none"
      wordmarkClassName="sidebar-label"
    />
  );
}
