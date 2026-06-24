"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import SmallFooter from "./SmallFooter";
import LogoutModal from "./LogoutModal";
import AskAiPanel from "./AskAiPanel";
import { useAuth } from "@/lib/AuthContext";
import {
  HiOutlineBell,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineSearch,
  HiOutlineMenuAlt2,
  HiOutlineX,
  HiOutlineSparkles,
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [askAiOpen, setAskAiOpen] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-[#0b0e13]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#232b36] border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated
  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#0b0e13]">
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
        <header className="sticky top-0 z-30 h-14 sm:h-16 bg-[#0b0e13]/80 backdrop-blur-xl border-b border-[#1b222c] flex items-center justify-between px-3 sm:px-4 gap-2 sm:gap-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-[#161b22] text-slate-400 hover:text-white transition-all flex-shrink-0"
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
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#161b22] border border-[#232b36] text-sm text-slate-300 outline-none focus:border-primary placeholder-slate-500 transition-colors"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
            <button
              onClick={() => setNotifOpen(true)}
              className="p-2 rounded-lg hover:bg-[#232b36] text-slate-400 hover:text-white transition-all relative"
              title="Notifications"
            >
              <HiOutlineBell className="text-lg" />
            </button>

            <Link
              href="/settings"
              className="p-2 rounded-lg hover:bg-[#232b36] text-slate-400 transition-all hidden sm:flex"
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
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-xs font-bold ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer"
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

      {/* Floating Ask AI button */}
      {!askAiOpen && (
        <button
          onClick={() => setAskAiOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-primary to-primary-light text-white font-semibold shadow-xl shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all animate-pulse-glow"
        >
          <HiOutlineSparkles className="text-lg" />
          Ask AI
        </button>
      )}

      {/* Ask AI slide-over panel */}
      <AskAiPanel open={askAiOpen} onClose={() => setAskAiOpen(false)} />

      {/* Notifications slide-over panel */}
      {notifOpen && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setNotifOpen(false)}
          />
          <div className="absolute top-0 right-0 h-full w-full max-w-sm bg-[#0b0e13] border-l border-[#1b222c] shadow-2xl flex flex-col animate-slide-down">
            <div className="flex items-center justify-between h-16 px-5 border-b border-[#1b222c] flex-shrink-0">
              <div className="flex items-center gap-2">
                <HiOutlineBell className="text-primary-light text-lg" />
                <h3 className="text-white font-semibold">Notifications</h3>
              </div>
              <button
                onClick={() => setNotifOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#161b22] text-slate-400 hover:text-white transition-all"
              >
                <HiOutlineX className="text-lg" />
              </button>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#141a22] border border-[#1b222c] flex items-center justify-center">
                <HiOutlineBell className="text-slate-600 text-3xl" />
              </div>
              <div>
                <p className="text-white font-semibold">No notifications yet</p>
                <p className="text-sm text-slate-500 mt-1">
                  You&apos;re all caught up. New alerts about your reports and analysis will show up here.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Modal */}
      <LogoutModal
        isOpen={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
