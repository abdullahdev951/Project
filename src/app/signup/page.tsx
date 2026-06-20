"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import Toast from "@/components/Toast";
import {
  HiOutlineExclamationCircle,
  HiOutlineEye,
  HiOutlineEyeOff,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa6";

function AuthLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="AI Assist Pro" className="w-9 h-9 rounded-xl object-contain" />
      <span className="text-2xl font-bold text-white tracking-tight">
        AI Assist <span className="text-primary-light">Pro</span>
      </span>
    </Link>
  );
}

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await register(name, email, password);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setShowToast(true);
      setTimeout(() => router.push("/dashboard"), 1200);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#0b0e13] bg-grid relative">
      <div className="absolute inset-0 bg-glow pointer-events-none" />
      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <Toast message="Account created! Redirecting..." type="success" isOpen={showToast} onClose={() => setShowToast(false)} />

      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <AuthLogo />
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">Create Account</h1>
        <p className="text-sm text-slate-400 text-center mb-8">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-light font-semibold hover:underline">
            Sign in here
          </Link>
        </p>

        <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-6 sm:p-8 shadow-xl">
          {error && (
            <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-900/10 border border-red-800/30 text-red-400 text-sm animate-slide-down">
              <HiOutlineExclamationCircle className="text-lg flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-[#232b36] text-sm text-slate-200 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-[#232b36] text-sm text-slate-200 outline-none focus:border-primary transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password (min 6 chars)"
                  required
                  minLength={6}
                  className="w-full px-4 pr-11 py-3 rounded-xl bg-[#0b0e13] border border-[#232b36] text-sm text-slate-200 outline-none focus:border-primary transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <HiOutlineEyeOff className="text-lg" /> : <HiOutlineEye className="text-lg" />}
                </button>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" required className="w-4 h-4 mt-0.5 rounded border-[#232b36] accent-primary" />
              <span className="text-sm text-slate-400">
                I agree to the{" "}
                <span className="text-primary-light">Terms of Service</span> and{" "}
                <span className="text-primary-light">Privacy Policy</span>
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <p className="text-sm text-slate-500 mt-6 mb-3">Or sign up with your social network.</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1b222c] border border-[#232b36] hover:border-primary/40 transition-all text-sm font-medium text-slate-200">
              <FcGoogle className="text-lg" /> Google
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1b222c] border border-[#232b36] hover:border-primary/40 transition-all text-sm font-medium text-slate-200">
              <FaFacebook className="text-lg text-[#1877F2]" /> Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
