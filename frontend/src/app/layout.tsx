import type { Metadata } from "next";
import { Sora, Manrope } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/providers/query-provider";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "VIT Chennai Event Hub",
  description:
    "Discover, review, and manage every event happening across VIT Chennai with the official Event Hub platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-slate-950">
      <body
        className={`${display.variable} ${body.variable} font-body antialiased text-slate-100`}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950/60 to-slate-900">
          <QueryProvider>{children}</QueryProvider>
        </div>
      </body>
    </html>
  );
}
