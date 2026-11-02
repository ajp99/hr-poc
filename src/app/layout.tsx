import type { Metadata, Viewport } from "next";
import "@fontsource/anton/400.css";
import "@fontsource-variable/inter";
import "./globals.css";
import { AppToaster } from "@/components/app-toaster";
import { StoreHydrator } from "@/components/store-hydrator";

export const metadata: Metadata = {
  title: "Code of Conduct · Truminds",
  description: "Truminds Code of Conduct e-learning module (POC)",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-dvh">
        {children}
        <AppToaster />
        <StoreHydrator />
      </body>
    </html>
  );
}
