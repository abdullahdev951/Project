"use client";

import Link from "next/link";
import { Suspense, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthShell from "@/components/AuthShell";

function OtpInner() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "your email";
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (i: number, val: string) => {
    const v = val.replace(/\D/g, "").slice(-1);
    setDigits((d) => {
      const next = [...d];
      next[i] = v;
      return next;
    });
    if (v && i < 3) refs.current[i + 1]?.focus();
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/reset-password"), 700);
  };

  return (
    <AuthShell
      title="OTP Verification"
      subtitle={
        <>
          We sent a code to <span className="text-white font-semibold">{email}</span>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-center gap-3 sm:gap-4">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              inputMode="numeric"
              maxLength={1}
              value={d}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              className="w-14 h-16 sm:w-16 sm:h-16 text-center text-2xl font-bold rounded-xl bg-[#0b0e13] border border-[#232b36] text-white outline-none focus:border-primary transition-colors"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary py-3.5 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Verifying...
            </>
          ) : (
            "Continue"
          )}
        </button>

        <p className="text-center text-sm text-slate-400">
          Didn&apos;t receive the email? Click{" "}
          <button type="button" className="text-primary-light font-semibold hover:underline">
            send it again
          </button>
          .
        </p>
        <p className="text-center text-sm">
          <Link href="/login" className="text-primary-light font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

export default function OtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0e13]" />}>
      <OtpInner />
    </Suspense>
  );
}
