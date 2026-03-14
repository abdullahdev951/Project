"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/lib/AuthContext";
import {
  HiOutlineUser,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineTrash,
} from "react-icons/hi";

export default function SettingsPage() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your account and preferences</p>
        </div>

        <div className="space-y-4">
          {/* Profile Section */}
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-sm">
                <HiOutlineUser className="text-white text-lg" />
              </div>
              <h2 className="text-lg font-bold text-white">Profile</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#334155]">
                <div>
                  <p className="text-sm font-medium text-white">Name</p>
                  <p className="text-xs text-slate-400">{user?.name || "Not logged in"}</p>
                </div>
                <button className="text-xs text-primary-light font-semibold hover:underline">Edit</button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-[#334155]">
                <div>
                  <p className="text-sm font-medium text-white">Email</p>
                  <p className="text-xs text-slate-400">{user?.email || "Not logged in"}</p>
                </div>
                <button className="text-xs text-primary-light font-semibold hover:underline">Edit</button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-white">Password</p>
                  <p className="text-xs text-slate-400">••••••••</p>
                </div>
                <button className="text-xs text-primary-light font-semibold hover:underline">Change</button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-sm">
                <HiOutlineBell className="text-white text-lg" />
              </div>
              <h2 className="text-lg font-bold text-white">Notifications</h2>
            </div>

            <div className="space-y-3">
              {[
                { label: "Email Notifications", desc: "Receive updates via email" },
                { label: "Report Alerts", desc: "Get notified when reports are ready" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-[#334155] last:border-0">
                  <div>
                    <p className="text-sm font-medium text-white">{item.label}</p>
                    <p className="text-xs text-slate-400">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-9 h-5 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center shadow-sm">
                <HiOutlineShieldCheck className="text-white text-lg" />
              </div>
              <h2 className="text-lg font-bold text-white">Privacy & Security</h2>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                <p className="text-xs text-slate-400">Add an extra layer of security</p>
              </div>
              <button className="px-4 py-2 rounded-xl border border-[#334155] hover:bg-[#334155] text-sm font-medium text-slate-300 transition-all">
                Enable
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-[#1E293B] rounded-2xl border border-red-800/30 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-red-400 flex items-center justify-center shadow-sm">
                <HiOutlineTrash className="text-white text-lg" />
              </div>
              <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium text-white">Delete Account</p>
                <p className="text-xs text-slate-400">Permanently delete your account and all data</p>
              </div>
              <button className="px-4 py-2 rounded-xl bg-red-900/10 text-red-400 text-sm font-medium hover:bg-red-900/20 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
