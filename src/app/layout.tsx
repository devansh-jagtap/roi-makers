import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/global/SiteHeader";
import LenisProvider from "@/app/providers/LenisProvider";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import ThemeToggle from "@/components/ui/theme-toggle";

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
          <LenisProvider>
            <SiteHeader/>
            {children}
            <ThemeToggle />
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
