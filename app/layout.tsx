import "./globals.css";
import React from "react";
import LayoutShell from "./LayoutShell";
import { SftpModeProvider } from "./contextAPI/contextmode";

export const metadata = {
  title: "My App",
  description: "Ad demo builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <SftpModeProvider>
        <body className="bg-slate-900 text-slate-200">
          <LayoutShell>{children}</LayoutShell>
        </body>
      </SftpModeProvider>
    </html>
  );
}
