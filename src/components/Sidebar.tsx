"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineInformationCircle,
  HiOutlineLogout,
  HiOutlineX,
  HiOutlineCreditCard,
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
];

const generalItems = [
  { name: "Pricing", href: "/pricing", icon: HiOutlineCreditCard },
  { name: "Help Center", href: "/help", icon: HiOutlineQuestionMarkCircle },
  { name: "About", href: "/about", icon: HiOutlineInformationCircle },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogoutClick: () => void;
}

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/25">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="13" width="4" height="8" rx="1.5" fill="white" opacity="0.55" />
          <rect x="10" y="8" width="4" height="13" rx="1.5" fill="white" opacity="0.8" />
          <rect x="17" y="3" width="4" height="18" rx="1.5" fill="white" />
        </svg>
      </div>
      <span className="text-lg font-bold text-white tracking-tight">
        AI Assist <span className="text-primary-light">Pro</span>
      </span>
    </div>
  );
}

export default function Sidebar({ isOpen, onClose, onLogoutClick }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();

  const planLabel =
    user?.plan === "business"
      ? "Business Plan"
      : user?.plan === "pro"
      ? "Pro Plan"
      : "Free Version";

  const linkClass = (active: boolean) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
      active
        ? "bg-primary/15 text-primary-light shadow-sm ring-1 ring-primary/20"
        : "text-slate-400 hover:bg-[#161b22] hover:text-slate-100"
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-60 bg-[#0b0e13] border-r border-[#1b222c] flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-[72px] px-5 flex-shrink-0 border-b border-[#1b222c]">
          <Link href="/dashboard" onClick={onClose}>
            <Logo />
          </Link>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[#161b22] text-slate-400 hover:text-white transition-all"
          >
            <HiOutlineX className="text-lg" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-semibold tracking-[0.15em] text-slate-600 uppercase">
            Menu
          </p>
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={linkClass(pathname === item.href)}
              >
                <item.icon className="text-[18px] flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            ))}
          </div>

          <p className="px-3 mt-6 mb-2 text-[10px] font-semibold tracking-[0.15em] text-slate-600 uppercase">
            General
          </p>
          <div className="space-y-1">
            {generalItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={linkClass(pathname === item.href)}
              >
                <item.icon className="text-[18px] flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            ))}
            <Link
              href="/settings"
              onClick={onClose}
              className={linkClass(pathname === "/settings")}
            >
              <HiOutlineCog className="text-[18px] flex-shrink-0" />
              <span>Settings</span>
            </Link>
          </div>
        </nav>

        {/* User card / logout */}
        <div className="px-3 pb-4 flex-shrink-0 space-y-2">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#141a22] border border-[#1b222c]">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-semibold text-white truncate">
                {user?.name || "Guest"}
              </p>
              <p className="text-[11px] text-slate-500 truncate">{planLabel}</p>
            </div>
          </div>
          <button
            onClick={onLogoutClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-slate-400 hover:bg-red-900/20 hover:text-red-400 transition-all"
          >
            <HiOutlineLogout className="text-[18px] flex-shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
