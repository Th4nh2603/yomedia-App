"use client";

import "./globals.css";
import { SessionProvider } from "next-auth/react";
import Providers from "./providers"; // nếu bạn có file này, vẫn giữ lại

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          {/* Nếu bạn có context riêng, bọc bên trong SessionProvider */}
          <Providers>{children}</Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
``;
