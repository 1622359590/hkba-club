import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "HKBA — Hong Kong Blockchain Association",
  description: "Hong Kong Blockchain Association — Dedicated to promoting blockchain technology in Hong Kong.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Hant" data-scroll-behavior="smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ background: '#09090b', color: '#fafafa' }}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
