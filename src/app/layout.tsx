import type { Metadata } from "next";
import "./globals.css";
import ClientPathWrapper from "@/components/global/ClientPathWrapper";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import ThemeToggle from "@/components/ui/theme-toggle";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "ROI-MAKERS",
  description: "A design agency that helps brands grow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ThemeProvider>
          <ToastProvider>
          <ClientPathWrapper>
            {children}
            <ThemeToggle />
          </ClientPathWrapper>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
