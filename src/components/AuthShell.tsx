"use client";

import Link from "next/link";

/**
 * Shared wrapper for the standalone auth screens (forgot password, OTP,
 * reset password). Provides the branded logo, animated background and a
 * centered card with a title + subtitle.
 */
export default function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#0b0e13] bg-grid relative">
      <div className="absolute inset-0 bg-glow pointer-events-none" />
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-in-up">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 justify-center">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/25">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="13" width="4" height="8" rx="1.5" fill="white" opacity="0.55" />
                <rect x="10" y="8" width="4" height="13" rx="1.5" fill="white" opacity="0.8" />
                <rect x="17" y="3" width="4" height="18" rx="1.5" fill="white" />
              </svg>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              AI Assist <span className="text-primary-light">Pro</span>
            </span>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-white text-center mb-2">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 text-center mb-8">{subtitle}</p>}

        <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-6 sm:p-8 shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
