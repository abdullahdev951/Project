"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineInformationCircle,
  HiOutlineLogout,
  HiOutlineX,
} from "react-icons/hi";
import {
  HiOutlineSquares2X2,
  HiOutlineDocumentArrowUp,
  HiOutlineChatBubbleLeftRight,
  HiOutlineChartBarSquare,
} from "react-icons/hi2";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: HiOutlineSquares2X2 },
  { name: "Upload & Analyze", href: "/upload", icon: HiOutlineDocumentArrowUp },
  { name: "AI Assistant", href: "/ai-assistant", icon: HiOutlineChatBubbleLeftRight },
  { name: "Reports", href: "/reports", icon: HiOutlineChartBarSquare },
  { name: "Help", href: "/help", icon: HiOutlineQuestionMarkCircle },
  { name: "About", href: "/about", icon: HiOutlineInformationCircle },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
}

export default function Sidebar({ isOpen, onClose, onLogoutClick }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile/Tablet overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-60 bg-[#0F172A] border-r border-[#1E293B]/50 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between h-[72px] px-5 flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3" onClick={onClose}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6366F1] to-[#818CF8] flex items-center justify-center shadow-lg shadow-[#6366F1]/25">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="13" width="4" height="8" rx="1.5" fill="white" opacity="0.6"/>
                <rect x="10" y="8" width="4" height="13" rx="1.5" fill="white" opacity="0.8"/>
                <rect x="17" y="3" width="4" height="18" rx="1.5" fill="white"/>
              </svg>
            </div>
            <div>
              <span className="text-[13px] font-bold text-white block leading-tight">
                Business Analytics
              </span>
              <span className="text-[10px] text-[#7072AC] font-medium">
                Enterprise Edition
              </span>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#1E293B] text-[#7072AC] hover:text-white transition-all"
          >
            <HiOutlineX className="text-lg" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#6366F1]/20 text-[#818CF8] shadow-sm"
                    : "text-[#7072AC] hover:bg-[#1E293B] hover:text-[#A5B4FC]"
                }`}
              >
                <item.icon className={`text-[18px] flex-shrink-0 ${isActive ? "text-[#818CF8]" : ""}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="px-3 pb-4 flex-shrink-0 space-y-1">
          <Link
            href="/settings"
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
              pathname === "/settings"
                ? "bg-[#6366F1]/20 text-[#818CF8] shadow-sm"
                : "text-[#7072AC] hover:bg-[#1E293B] hover:text-[#A5B4FC]"
            }`}
          >
            <HiOutlineCog className="text-[18px] flex-shrink-0" />
            <span>Settings</span>
          </Link>
          <button
            onClick={onLogoutClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-[#7072AC] hover:bg-red-900/20 hover:text-red-400 transition-all"
          >
            <HiOutlineLogout className="text-[18px] flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
