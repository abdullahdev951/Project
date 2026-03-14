"use client";

import { HiOutlineExclamationCircle } from "react-icons/hi";

interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function LogoutModal({ isOpen, onClose, onConfirm }: LogoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative bg-[#1E293B] rounded-2xl border border-[#334155] p-6 w-full max-w-sm shadow-2xl animate-scale-in">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
            <HiOutlineExclamationCircle className="text-red-400 text-3xl" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Sign Out</h3>
          <p className="text-sm text-slate-400 mb-6">
            Are you sure you want to sign out? You&apos;ll need to log in again to access your dashboard.
          </p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-[#334155] text-sm font-medium text-slate-300 hover:bg-[#334155] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition-all"
            >
              Yes, Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
