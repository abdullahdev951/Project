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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="AI Assist Pro" className="w-9 h-9 rounded-xl object-contain" />
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
