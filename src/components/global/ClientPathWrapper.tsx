"use client";
import { usePathname } from "next/navigation";
import SiteHeader from "./SiteHeader";
import LenisProvider from "@/app/providers/LenisProvider";

export default function ClientPathWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboardOrAuth = pathname.startsWith("/dashboard") || pathname.startsWith("/login") || pathname.startsWith("/set-password");

  if (isDashboardOrAuth) {
    return <>{children}</>;
  }

  return (
    <LenisProvider>
      <SiteHeader />
      {children}
    </LenisProvider>
  );
}
