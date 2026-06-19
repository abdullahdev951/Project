"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell from "@/components/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // No reset backend yet — route to the OTP step with the email in the query.
    setTimeout(() => {
      router.push(`/otp?email=${encodeURIComponent(email)}`);
    }, 700);
  };

  return (
    <AuthShell
      title="Forgot Password"
      subtitle="No worries, we will send you reset instructions."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="w-full px-4 py-3 rounded-xl bg-[#0b0e13] border border-[#232b36] text-sm text-slate-200 outline-none focus:border-primary transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3.5 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Sending...
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
