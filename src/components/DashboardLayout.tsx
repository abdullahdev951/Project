"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import SmallFooter from "./SmallFooter";
import LogoutModal from "./LogoutModal";
import { useAuth } from "@/lib/AuthContext";
import {
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineSearch,
  HiOutlineMenuAlt2,
} from "react-icons/hi";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Auth protection - redirect to login if not signed in
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = () => {
    setLogoutModalOpen(false);
    logout();
    router.push("/login");
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F172A]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#334155] border-t-[#6366F1] rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#0F172A]">
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogoutClick={() => {
          setSidebarOpen(false);
          setLogoutModalOpen(true);
        }}
      />

      {/* Main content area - responsive margin */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-60">
        {/* Header */}
        <header className="sticky top-0 z-30 h-14 sm:h-16 bg-[#0F172A]/80 backdrop-blur-xl border-b border-[#334155] flex items-center justify-between px-3 sm:px-4 gap-2 sm:gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-[#1E293B] text-slate-400 hover:text-white transition-all flex-shrink-0"
          >
            <HiOutlineMenuAlt2 className="text-xl" />
          </button>

          {/* Search */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-sm text-slate-300 outline-none focus:border-primary placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <button
              className="p-2 rounded-lg hover:bg-[#334155] text-slate-400 transition-all relative"
              title="Notifications"
            >
              <HiOutlineBell className="text-lg" />
            </button>

            <Link
              href="/settings"
              className="p-2 rounded-lg hover:bg-[#334155] text-slate-400 transition-all hidden sm:flex"
              title="Settings"
            >
              <HiOutlineCog className="text-lg" />
            </Link>

            <Link
              href="/pricing"
              className="hidden md:flex items-center px-4 py-1.5 rounded-lg border border-primary text-primary-light text-xs font-semibold hover:bg-primary hover:text-white transition-all"
            >
              Upgrade
            </Link>

            <div className="flex items-center gap-1 sm:gap-1.5">
              <Link
                href="/settings"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-orange-400/20 hover:ring-orange-400/40 transition-all cursor-pointer"
                title={user.name || "Profile"}
              >
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </Link>
              <button
                onClick={() => setLogoutModalOpen(true)}
                className="p-2 rounded-lg hover:bg-red-900/20 text-slate-400 hover:text-red-400 transition-all hidden sm:flex"
                title="Sign Out"
              >
                <HiOutlineLogout className="text-lg" />
              </button>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-auto">
          {children}
        </main>

        <SmallFooter />
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
