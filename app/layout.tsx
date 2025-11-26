import "./globals.css";
import React from "react";
import LayoutShell from "./LayoutShell";

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
      <body className="bg-slate-900 text-slate-200">
        <LayoutShell>{children}</LayoutShell>
      </body>
    </html>
  );
}
