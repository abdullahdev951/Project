"use client";

import { useEffect } from "react";
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineX } from "react-icons/hi";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  isOpen: boolean;
  onClose: () => void;
}

export default function Toast({ message, type = "success", isOpen, onClose }: ToastProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-4 right-4 z-[200] animate-slide-down">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-sm ${
          type === "success"
            ? "bg-green-900/90 border-green-700/50 text-green-300"
            : "bg-red-900/90 border-red-700/50 text-red-300"
        }`}
      >
        {type === "success" ? (
          <HiOutlineCheckCircle className="text-lg flex-shrink-0" />
        ) : (
          <HiOutlineExclamationCircle className="text-lg flex-shrink-0" />
        )}
        <span className="text-sm font-medium">{message}</span>
        <button onClick={onClose} className="p-1 hover:opacity-70 transition-opacity flex-shrink-0">
          <HiOutlineX className="text-sm" />
        </button>
      </div>
    </div>
  );
}
