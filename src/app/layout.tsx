import type { Metadata } from "next";

import "@/app/globals.css";

import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: "GearUp",
  description: "Full-stack tech ordering app built with Next.js, MongoDB, and shadcn/ui."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
