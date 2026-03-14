"use client";

import Link from "next/link";
import { HiOutlineShieldCheck } from "react-icons/hi";

export default function SmallFooter() {
  return (
    <footer className="border-t border-edge dark:border-[#334155] py-3 px-4 mt-auto flex-shrink-0">
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted dark:text-slate-600">
          2024 AI Assist Pro. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="#"
            className="text-[11px] text-muted dark:text-slate-600 hover:text-primary dark:hover:text-primary-light flex items-center gap-1 transition-colors"
          >
            <HiOutlineShieldCheck className="text-xs" /> Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-[11px] text-muted dark:text-slate-600 hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  );
}
