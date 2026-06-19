"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/lib/AuthContext";
import Toast from "@/components/Toast";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineBell,
  HiOutlineShieldCheck,
  HiOutlineLockClosed,
  HiOutlineTrash,
  HiOutlineExclamationCircle,
  HiOutlineBadgeCheck,
  HiOutlineSparkles,
} from "react-icons/hi";

export default function SettingsPage() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState("");

  const [toast, setToast] = useState("");
  const [showDelete, setShowDelete] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const planLabel =
    user?.plan === "business" ? "Business" : user?.plan === "pro" ? "Pro" : "Free";

  const apiUpdate = async (body: Record<string, string>) => {
    const token = localStorage.getItem("token");
    const res = await fetch("/api/auth/update", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return { ok: res.ok, data };
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError("");
    setProfileLoading(true);
    const { ok, data } = await apiUpdate({ name, email });
    if (!ok) {
      setProfileError(data.error || "Failed to update profile");
    } else {
      await refreshUser();
      setToast("Profile updated successfully");
    }
    setProfileLoading(false);
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError("");
    if (newPassword.length < 6) {
      setPwError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwError("New passwords do not match");
      return;
    }
    setPwLoading(true);
    const { ok, data } = await apiUpdate({ currentPassword, newPassword });
    if (!ok) {
      setPwError(data.error || "Failed to change password");
    } else {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setToast("Password changed successfully");
    }
    setPwLoading(false);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-[#232b36] text-sm text-slate-200 outline-none focus:border-primary transition-colors";
  const labelClass = "block text-sm font-medium text-slate-300 mb-2";

  return (
    <DashboardLayout>
      <Toast message={toast} type="success" isOpen={!!toast} onClose={() => setToast("")} />

      <div className="max-w-6xl mx-auto">
        <div className="mb-6 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Settings</h1>
          <p className="text-sm text-slate-400 mt-1">Manage your account, security and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 items-start">
          {/* Left: account summary */}
          <div className="lg:sticky lg:top-20 space-y-4 sm:space-y-5">
            <div className="relative overflow-hidden rounded-2xl border border-[#1b222c] bg-gradient-to-br from-primary/10 via-[#141a22] to-[#141a22] p-6 text-center animate-fade-in-up">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-primary-light flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 ring-4 ring-primary/15">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <h2 className="text-lg font-bold text-white">{user?.name || "Guest"}</h2>
                <p className="text-sm text-slate-400 break-all">{user?.email || "—"}</p>
                <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/15 text-primary-light text-xs font-semibold">
                  <HiOutlineBadgeCheck className="text-sm" /> {planLabel} Plan
                  {user?.role === "admin" && <span className="ml-1 text-amber-400">· Admin</span>}
                </div>
              </div>
            </div>

            <Link
              href="/pricing"
              className="block rounded-2xl border border-[#1b222c] bg-[#141a22] p-5 card-hover group"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center">
                  <HiOutlineSparkles className="text-amber-400 text-lg" />
                </div>
                <span className="text-white font-semibold">Upgrade Plan</span>
              </div>
              <p className="text-xs text-slate-400">Unlock unlimited AI analysis, reports and premium features.</p>
            </Link>
          </div>

          {/* Right: editable sections */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* Profile */}
            <section className="rounded-2xl border border-[#1b222c] bg-[#141a22] p-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <HiOutlineUser className="text-primary-light text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Profile</h2>
                  <p className="text-xs text-slate-400">Update your name and email address</p>
                </div>
              </div>

              {profileError && (
                <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-900/10 border border-red-800/30 text-red-400 text-sm animate-slide-down">
                  <HiOutlineExclamationCircle className="text-lg flex-shrink-0" />
                  {profileError}
                </div>
              )}

              <form onSubmit={saveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Full Name</label>
                    <div className="relative">
                      <HiOutlineUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={`${inputClass} pl-10`} placeholder="Your name" />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Email</label>
                    <div className="relative">
                      <HiOutlineMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={`${inputClass} pl-10`} placeholder="you@example.com" />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={profileLoading} className="btn-primary py-2.5 px-6 text-sm disabled:opacity-50 flex items-center gap-2">
                    {profileLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </section>

            {/* Password */}
            <section className="rounded-2xl border border-[#1b222c] bg-[#141a22] p-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <HiOutlineLockClosed className="text-primary-light text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Change Password</h2>
                  <p className="text-xs text-slate-400">Use a strong password to keep your account secure</p>
                </div>
              </div>

              {pwError && (
                <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-900/10 border border-red-800/30 text-red-400 text-sm animate-slide-down">
                  <HiOutlineExclamationCircle className="text-lg flex-shrink-0" />
                  {pwError}
                </div>
              )}

              <form onSubmit={savePassword} className="space-y-4">
                <div>
                  <label className={labelClass}>Current Password</label>
                  <input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className={inputClass} placeholder="Enter current password" required />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>New Password</label>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className={inputClass} placeholder="Min 6 characters" required />
                  </div>
                  <div>
                    <label className={labelClass}>Confirm New Password</label>
                    <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} placeholder="Re-enter new password" required />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button type="submit" disabled={pwLoading} className="btn-primary py-2.5 px-6 text-sm disabled:opacity-50 flex items-center gap-2">
                    {pwLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                    Update Password
                  </button>
                </div>
              </form>
            </section>

            {/* Notifications */}
            <section className="rounded-2xl border border-[#1b222c] bg-[#141a22] p-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <HiOutlineBell className="text-primary-light text-lg" />
                </div>
                <h2 className="text-lg font-bold text-white">Notifications</h2>
              </div>
              <div className="space-y-1">
                {[
                  { label: "Email Notifications", desc: "Receive updates via email" },
                  { label: "Report Alerts", desc: "Get notified when reports are ready" },
                  { label: "Product Updates", desc: "News about features and improvements" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-[#1b222c] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-white">{item.label}</p>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-10 h-5.5 bg-[#232b36] rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-[18px]" />
                    </label>
                  </div>
                ))}
              </div>
            </section>

            {/* Privacy & Security */}
            <section className="rounded-2xl border border-[#1b222c] bg-[#141a22] p-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                  <HiOutlineShieldCheck className="text-primary-light text-lg" />
                </div>
                <h2 className="text-lg font-bold text-white">Privacy &amp; Security</h2>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                  <p className="text-xs text-slate-400">Add an extra layer of security to your account</p>
                </div>
                <button className="px-4 py-2 rounded-xl border border-[#232b36] hover:border-primary hover:text-primary-light text-sm font-medium text-slate-300 transition-all">
                  Enable
                </button>
              </div>
            </section>

            {/* Danger Zone */}
            <section className="rounded-2xl border border-red-800/30 bg-[#141a22] p-6 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <HiOutlineTrash className="text-red-400 text-lg" />
                </div>
                <h2 className="text-lg font-bold text-red-400">Danger Zone</h2>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-white">Delete Account</p>
                  <p className="text-xs text-slate-400">Permanently delete your account and all data</p>
                </div>
                <button onClick={() => setShowDelete(true)} className="px-4 py-2 rounded-xl bg-red-900/10 text-red-400 text-sm font-medium hover:bg-red-900/20 transition-all">
                  Delete
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Delete confirm (cosmetic) */}
      {showDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-[#141a22] rounded-2xl border border-[#232b36] p-6 max-w-sm w-full animate-scale-in">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <HiOutlineExclamationCircle className="text-red-400 text-xl" />
            </div>
            <h3 className="text-lg font-bold text-white text-center mb-2">Delete your account?</h3>
            <p className="text-sm text-slate-400 text-center mb-6">
              This action is permanent and cannot be undone. Please contact support to permanently delete your account.
            </p>
            <button onClick={() => setShowDelete(false)} className="w-full px-4 py-2.5 rounded-xl border border-[#232b36] text-sm font-medium text-slate-300 hover:bg-[#232b36] transition-all">
              Close
            </button>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
