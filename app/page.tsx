"use client";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import DataTable from "./components/DataTable";
import { useSession } from "next-auth/react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: session } = useSession();

  if (!session) return null;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-slate-900 text-slate-200">
      <Sidebar isOpen={isSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-900 p-4 md:p-8">
          <DataTable />
        </main>
      </div>
    </div>
  );
}
