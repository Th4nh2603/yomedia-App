import React from "react";
import Icon from "../icons/Icons";
import { useSession } from "next-auth/react";
interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { data: session } = useSession();

  return (
    <header className="flex-shrink-0 bg-slate-800 border-b border-slate-700">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <button
            onClick={toggleSidebar}
            className="text-slate-400 hover:text-white lg:hidden"
          >
            <Icon name="menu" className="w-6 h-6" />
          </button>
          <div className="relative ml-4 hidden md:block">
            <Icon
              name="search"
              className="absolute top-1/2 left-3 transform -translate-y-1/2 text-slate-500 w-5 h-5"
            />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white">
            <Icon name="moon" className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white">
            <Icon name="bell" className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white">
            <Icon name="settings" className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-full text-slate-400 hover:bg-slate-700 hover:text-white">
            <Icon name="userCircle" className="w-5 h-5" />
          </button>
          {/* Ảnh Google user */}
          {session?.user?.image && (
            <img
              src={session.user.image}
              alt="User Avatar"
              className="w-9 h-9 rounded-full border border-slate-600 hover:scale-105 transition"
            />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
