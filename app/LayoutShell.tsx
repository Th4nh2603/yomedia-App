"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";

import Providers from "./providers";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";

type LayoutShellProps = {
  children: React.ReactNode;
};

export default function LayoutShell({ children }: LayoutShellProps) {
  const pathname = usePathname();

  const isLoginPage = pathname === "/login";
  const isPreviewPage = pathname.startsWith("/preview");

  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // 👉 Các page KHÔNG có sidebar / header: login, preview
  if (isLoginPage || isPreviewPage) {
    return (
      <SessionProvider>
        <Providers>{children}</Providers>
      </SessionProvider>
    );
  }

  // 👉 Các page còn lại: có sidebar + header
  return (
    <SessionProvider>
      <Providers>
        <div className="flex h-screen overflow-hidden">
          <Sidebar isOpen={isSidebarOpen} />
          <div className="flex flex-col flex-1">
            {/* NHỚ truyền toggleSidebar cho Header vì HeaderProps đang cần */}
            <Header toggleSidebar={toggleSidebar} />
            <main className="flex-1 overflow-auto p-6 bg-slate-900">
              {children}
            </main>
          </div>
        </div>
      </Providers>
    </SessionProvider>
  );
}
