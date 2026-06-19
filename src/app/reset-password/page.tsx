"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";
import Toast from "@/components/Toast";
import { HiOutlineEye, HiOutlineEyeOff, HiOutlineExclamationCircle } from "react-icons/hi";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setToast(true);
      setTimeout(() => router.push("/login"), 1300);
    }, 600);
  };

  const field = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    visible: boolean,
    toggle: () => void,
  ) => (
    <div>
      <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={label}
          required
          className="w-full px-4 pr-11 py-3 rounded-xl bg-[#0b0e13] border border-[#232b36] text-sm text-slate-200 outline-none focus:border-primary transition-colors"
        />
        <button
          type="button"
          onClick={toggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
        >
          {visible ? <HiOutlineEyeOff className="text-lg" /> : <HiOutlineEye className="text-lg" />}
        </button>
      </div>
    </div>
  );

  return (
    <AuthShell title="Set New Password" subtitle="Choose a strong new password for your account.">
      <Toast message="Password reset! Redirecting to login..." type="success" isOpen={toast} onClose={() => setToast(false)} />
      {error && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-900/10 border border-red-800/30 text-red-400 text-sm animate-slide-down">
          <HiOutlineExclamationCircle className="text-lg flex-shrink-0" />
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        {field("Password", password, setPassword, show, () => setShow(!show))}
        {field("Confirm Password", confirm, setConfirm, showConfirm, () => setShowConfirm(!showConfirm))}
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3.5 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            "Reset Password"
          )}
        </button>
        <p className="text-center text-sm">
          <Link href="/login" className="text-primary-light font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
