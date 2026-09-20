"use client";
import { usePathname } from "next/navigation";
import SiteHeader from "./SiteHeader";
import LenisProvider from "@/app/providers/LenisProvider";
import { ChatLauncher } from "@/components/chat/ChatLauncher";

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
      {/* Public-only: the dashboard has its own, separate assistant.
          The launcher defers the widget's bundle until the visitor opens it. */}
      <ChatLauncher />
    </LenisProvider>
  );
}
