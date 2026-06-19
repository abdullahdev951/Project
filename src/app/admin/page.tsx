"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import {
  HiOutlineShieldCheck,
  HiOutlineLogout,
  HiOutlineUsers,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  plan: "free" | "pro" | "business";
  requestsToday: number;
  createdAt: string;
}

export default function AdminDashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  // Auth + role guard
  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/admin/login");
    } else if (user.role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const loadUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load users");
      } else {
        setUsers(data.users);
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") loadUsers();
  }, [user, loadUsers]);

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  if (loading || !user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b0e13]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-[#232b36] border-t-[#00a76f] rounded-full animate-spin" />
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div className="min-h-screen bg-[#0b0e13]">
      {/* Header */}
      <header className="sticky top-0 z-30 h-16 bg-[#0b0e13]/80 backdrop-blur-xl border-b border-[#232b36] flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg">
            <HiOutlineShieldCheck className="text-white text-lg" />
          </div>
          <span className="text-lg font-bold text-white">Admin Panel</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-slate-400 hidden sm:block">{user.email}</span>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-red-900/20 text-slate-400 hover:text-red-400 transition-all flex items-center gap-1.5 text-sm"
          >
            <HiOutlineLogout className="text-lg" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-[#141a22] rounded-2xl border border-[#232b36] p-5">
            <p className="text-xs text-slate-400 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-white">{users.length}</p>
          </div>
          <div className="bg-[#141a22] rounded-2xl border border-[#232b36] p-5">
            <p className="text-xs text-slate-400 mb-1">Admins</p>
            <p className="text-2xl font-bold text-white">{adminCount}</p>
          </div>
          <div className="bg-[#141a22] rounded-2xl border border-[#232b36] p-5">
            <p className="text-xs text-slate-400 mb-1">Paid Plans</p>
            <p className="text-2xl font-bold text-white">
              {users.filter((u) => u.plan !== "free").length}
            </p>
          </div>
        </div>

        {/* Users table */}
        <div className="bg-[#141a22] rounded-2xl border border-[#232b36] overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-[#232b36]">
            <HiOutlineUsers className="text-primary-light text-lg" />
            <h2 className="text-white font-semibold">Users</h2>
          </div>

          {error && (
            <div className="m-5 flex items-center gap-2 p-3 rounded-xl bg-red-900/10 border border-red-800/30 text-red-400 text-sm">
              <HiOutlineExclamationCircle className="text-lg flex-shrink-0" />
              {error}
            </div>
          )}

          {fetching ? (
            <div className="p-8 text-center text-slate-400 text-sm">Loading users...</div>
          ) : users.length === 0 && !error ? (
            <div className="p-8 text-center text-slate-400 text-sm">No users found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400 border-b border-[#232b36]">
                    <th className="px-5 py-3 font-medium">Name</th>
                    <th className="px-5 py-3 font-medium">Email</th>
                    <th className="px-5 py-3 font-medium">Role</th>
                    <th className="px-5 py-3 font-medium">Plan</th>
                    <th className="px-5 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-[#232b36]/50 hover:bg-[#0b0e13]/40 transition-colors"
                    >
                      <td className="px-5 py-3 text-slate-200">{u.name}</td>
                      <td className="px-5 py-3 text-slate-400">{u.email}</td>
                      <td className="px-5 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            u.role === "admin"
                              ? "bg-primary/20 text-primary-light"
                              : "bg-slate-700/50 text-slate-300"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-slate-400 capitalize">{u.plan}</td>
                      <td className="px-5 py-3 text-slate-400">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
