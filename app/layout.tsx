// "use client";

// import "./globals.css";
// import { SessionProvider } from "next-auth/react";
// import Providers from "./providers"; // nếu bạn có file này, vẫn giữ lại

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <html lang="en">
//       <body>
//         <SessionProvider>
//           {/* Nếu bạn có context riêng, bọc bên trong SessionProvider */}
//           <Providers>{children}</Providers>
//         </SessionProvider>
//       </body>
//     </html>
//   );
// }
// ``;

"use client";
import "./globals.css";
import { usePathname } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import Providers from "./providers";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import React, { useState } from "react";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <html lang="en">
      <body className=" text-slate-200">
        <SessionProvider>
          <Providers>
            {isLoginPage ? (
              children
            ) : (
              <div className="flex h-screen overflow-hidden">
                <Sidebar isOpen={isSidebarOpen} />
                <div className="flex flex-col flex-1">
                  <Header toggleSidebar={toggleSidebar} />
                  <main className="flex-1 overflow-y-auto p-6 bg-slate-900">
                    {children}
                  </main>
                </div>
              </div>
            )}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
