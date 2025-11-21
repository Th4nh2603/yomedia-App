"use client";

import React from "react";
import Icon from "../icons/Icons";
import { NAV_ITEMS } from "../../constants";
import { NavItem } from "../../types";
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const renderNavItems = (section: NavItem["section"]) => {
    return (
      <div className="mb-4">
        <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
          {section}
        </h3>
        <ul>
          {NAV_ITEMS.filter((item) => item.section === section).map((item) => {
            const href = item.href || "/";

            // 🔥 xác định item đang active theo URL
            const isActive =
              pathname === href || (href !== "/" && pathname.startsWith(href));

            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => router.push(href)}
                  className={`w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? "bg-slate-700 text-teal-400"
                      : "text-slate-400 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  <Icon name={item.icon} className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    );
  };

  return (
    <aside
      className={`bg-slate-800 text-white flex-shrink-0 flex flex-col transition-all duration-300 ${
        isOpen ? "w-64" : "w-0 overflow-hidden"
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-700 flex-shrink-0">
        <span className="text-xl font-bold">ADMINIS</span>
        <button className="text-slate-400 hover:text-white">
          <Icon name="menu" className="w-6 h-6" />
        </button>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-slate-700 flex items-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600">
          {session?.user?.name?.charAt(0).toUpperCase() || "?"}
        </div>
        <div className="ml-3">
          <p className="font-semibold text-white text-sm">
            {session?.user?.name || "Chưa đăng nhập"}
          </p>
          <p className="text-xs text-slate-400">{session ? "Developer" : ""}</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {renderNavItems("MAIN")}
        {renderNavItems("DATA")}
        {renderNavItems("PAGES")}
        {renderNavItems("DESIGN")}
        {renderNavItems("CHARTS")}
      </nav>

      <div className="p-4 border-t border-slate-700 flex-shrink-0">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 text-left hover:bg-slate-700"
        >
          <Icon name="logout" className="w-5 h-5 mr-3" />
          <span>Log out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
