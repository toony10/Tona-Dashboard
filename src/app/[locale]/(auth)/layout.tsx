import { AuroraBackground } from "./_components/AuroraBackground";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-svh flex-1 overflow-hidden">
      <AuroraBackground />
      <div className="relative z-10">{ children }</div>
    </div>
  );
}
