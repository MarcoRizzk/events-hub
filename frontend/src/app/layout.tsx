import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { AuthProvider } from "@app/lib/auth-context";
import TopBarWrapper from "@app/components/top-bar-wrapper";
import AppToaster from "@app/components/toastr";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Events Hub",
  description: "Simplified event management system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppToaster />

        <AuthProvider>
          <TopBarWrapper />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
