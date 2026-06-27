"use client";

import { useState, useRef, useEffect } from "react";
import { HiOutlineX, HiOutlineSparkles, HiOutlineExclamationCircle } from "react-icons/hi";
import { HiPaperAirplane } from "react-icons/hi2";
import Markdown from "@/components/Markdown";
import { getBusinessContext } from "@/lib/aiContext";

interface Msg {
  role: "user" | "ai";
  content: string;
}

export default function AskAiPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setError("");
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const context = await getBusinessContext();
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tool: "AI Assistant",
          module: "AI Assistant",
          input: text,
          extraFields: context ? { "Business Context": context } : {},
        }),
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Something went wrong");
      else setMessages((m) => [...m, { role: "ai", content: data.output }]);
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute top-0 right-0 h-full w-full max-w-md bg-[#0b0e13] border-l border-[#1b222c] shadow-2xl flex flex-col animate-slide-down">
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 sm:px-5 border-b border-[#1b222c] flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
              <HiOutlineSparkles className="text-white" />
            </div>
            <h3 className="text-white font-semibold">AI Assistant</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMessages([]);
                setError("");
              }}
              className="text-xs px-2.5 py-1.5 rounded-lg border border-[#232b36] text-slate-400 hover:text-white hover:border-primary transition-all"
            >
              New chat
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#161b22] text-slate-400 hover:text-white transition-all">
              <HiOutlineX className="text-lg" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && !loading && (
            <div className="flex flex-col items-center text-center text-slate-500 text-sm mt-10 px-4">
              <div className="w-14 h-14 rounded-2xl bg-[#141a22] border border-[#1b222c] flex items-center justify-center mb-3">
                <HiOutlineSparkles className="text-primary-light text-2xl" />
              </div>
              <p className="text-white font-semibold mb-1">How can I help?</p>
              Ask me anything about your business, marketing, content or any topic.
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-white whitespace-pre-wrap"
                    : "bg-[#141a22] border border-[#1b222c] text-slate-200"
                }`}
              >
                {m.role === "user" ? m.content : <Markdown content={m.content} />}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-[#141a22] border border-[#1b222c] rounded-2xl px-4 py-3 flex items-center gap-1.5">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/10 border border-red-800/30 text-red-400 text-sm">
              <HiOutlineExclamationCircle className="text-lg flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-3 border-t border-[#1b222c] flex-shrink-0">
          <div className="flex items-end gap-2 rounded-xl bg-[#141a22] border border-[#232b36] p-2 focus-within:border-primary transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Ask the assistant..."
              className="flex-1 bg-transparent text-sm text-slate-200 outline-none resize-none px-2 py-1.5 max-h-32 placeholder-slate-500"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim()}
              className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-all disabled:opacity-50 flex-shrink-0"
            >
              <HiPaperAirplane className="text-base" />
            </button>
          </div>
          <p className="text-[10px] text-slate-600 text-center mt-2">Press Enter to send, Shift+Enter for new line</p>
        </div>
      </div>
    </div>
  );
}
