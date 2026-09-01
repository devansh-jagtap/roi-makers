import type { Metadata } from "next";
import { DM_Sans, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import ClientPathWrapper from "@/components/global/ClientPathWrapper";
import { ThemeProvider } from "@/app/providers/ThemeProvider";
import ThemeToggle from "@/components/ui/theme-toggle";
import { ToastProvider } from "@/components/ui/toast";
import { ChatWidget } from '@/components/chat/ChatWidget';

/* Editorial pairing: a high-contrast serif carries the big statements,
   a calm geometric sans carries everything you actually read. Exposed as
   CSS variables so globals.css binds them to the `.boska-font` /
   `.archivo-font` / `.clash-display-font` class names the codebase
   already uses — no component has to change to get the new type. */
const displaySerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-display",
});

const bodySans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

/* Still loaded because TeamShowcase sets IBM Plex Mono inline. */
const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-mono-brand",
});

export const metadata: Metadata = {
  title: "ROI Makers — Performance Marketing Agency in Indore",
  description:
    "ROI first. Always. Performance marketing, SEO, social, websites and marketplace management built for brands that refuse to be average.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${displaySerif.variable} ${bodySans.variable} ${mono.variable}`}>
      <body className="antialiased">
        <ThemeProvider>
          <ToastProvider>
          <ClientPathWrapper>
            {children}
            <ChatWidget />
            <ThemeToggle />
          </ClientPathWrapper>
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
