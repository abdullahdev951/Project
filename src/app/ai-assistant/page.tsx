"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  HiOutlineClipboardCopy,
  HiOutlineDownload,
  HiOutlineExclamationCircle,
  HiOutlineSparkles,
  HiOutlineTrash,
} from "react-icons/hi";
import { HiPaperAirplane, HiOutlineChatBubbleLeftRight, HiOutlineClock } from "react-icons/hi2";

interface ChatMessage {
  role: "user" | "ai";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  timestamp: number;
}

function renderMarkdown(text: string) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-300 rounded-xl p-4 my-3 overflow-x-auto text-xs leading-relaxed"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-[#334155] text-primary-light px-1.5 py-0.5 rounded text-xs">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-white mt-4 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-4 mb-2">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-white mt-4 mb-2">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^\* (.+)$/gm, '<li class="ml-4 list-disc text-sm leading-relaxed">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm leading-relaxed">$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal text-sm leading-relaxed">$1</li>')
    .replace(/\n\n/g, '<div class="h-3"></div>')
    .replace(/\n/g, "<br>");
}

const quickPrompts = [
  "Give me marketing ideas for a small business",
  "How to improve customer retention?",
  "Write a social media post for my product launch",
  "Suggest ways to reduce business expenses",
];

const STORAGE_KEY = "chatSessions";
const ACTIVE_SESSION_KEY = "activeChatSession";

export default function AIAssistantPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load sessions from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: ChatSession[] = JSON.parse(saved);
      setSessions(parsed);
    }
    const activeId = localStorage.getItem(ACTIVE_SESSION_KEY);
    if (activeId && saved) {
      const parsed: ChatSession[] = JSON.parse(saved);
      const active = parsed.find((s) => s.id === activeId);
      if (active) {
        setMessages(active.messages);
        setActiveSessionId(active.id);
      }
    }
  }, []);

  // Save to localStorage whenever messages change
  const saveSession = useCallback(
    (msgs: ChatMessage[]) => {
      if (msgs.length === 0) return;

      const title = msgs[0].content.slice(0, 50) + (msgs[0].content.length > 50 ? "..." : "");

      setSessions((prev) => {
        let updated: ChatSession[];
        if (activeSessionId) {
          updated = prev.map((s) =>
            s.id === activeSessionId ? { ...s, messages: msgs, title, timestamp: Date.now() } : s
          );
        } else {
          const newId = Date.now().toString();
          setActiveSessionId(newId);
          localStorage.setItem(ACTIVE_SESSION_KEY, newId);
          const newSession: ChatSession = { id: newId, title, messages: msgs, timestamp: Date.now() };
          updated = [newSession, ...prev];
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [activeSessionId]
  );

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;

    const newMessages = [...messages, { role: "user" as const, content: msg }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tool: "AI Assistant",
          module: "AI Assistant",
          input: msg,
          extraFields: {},
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        saveSession(newMessages);
        return;
      }
      const finalMessages = [...newMessages, { role: "ai" as const, content: data.output }];
      setMessages(finalMessages);
      saveSession(finalMessages);
    } catch {
      setError("Failed to connect. Please try again.");
      saveSession(newMessages);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setActiveSessionId(null);
    localStorage.removeItem(ACTIVE_SESSION_KEY);
    setShowHistory(false);
  };

  const loadSession = (session: ChatSession) => {
    setMessages(session.messages);
    setActiveSessionId(session.id);
    localStorage.setItem(ACTIVE_SESSION_KEY, session.id);
    setShowHistory(false);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== id);
    setSessions(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    if (activeSessionId === id) {
      setMessages([]);
      setActiveSessionId(null);
      localStorage.removeItem(ACTIVE_SESSION_KEY);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-7rem)] sm:h-[calc(100vh-8rem)] max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-sm">
              <HiOutlineChatBubbleLeftRight className="text-white text-base sm:text-lg" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">
                AI Assistant
              </h1>
              <p className="text-[10px] sm:text-xs text-slate-400 hidden sm:block">
                Ask me anything — business advice, marketing ideas, content writing
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#334155] text-xs font-medium text-slate-400 hover:text-white hover:border-primary transition-all"
            >
              <HiOutlineClock className="text-sm" />
              <span className="hidden sm:inline">History</span>
            </button>
            <button
              onClick={startNewChat}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all"
            >
              + <span className="hidden sm:inline">New Chat</span>
            </button>
          </div>
        </div>

        {/* Chat History Panel */}
        {showHistory && (
          <div className="mb-3 bg-[#1E293B] rounded-2xl border border-[#334155] p-4 max-h-60 overflow-y-auto animate-slide-down">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Chat History</h3>
            {sessions.length > 0 ? (
              <div className="space-y-1.5">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => loadSession(session)}
                    className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                      activeSessionId === session.id
                        ? "bg-primary/10 border border-primary/30"
                        : "hover:bg-[#0F172A] border border-transparent"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-slate-300 truncate">{session.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        {new Date(session.timestamp).toLocaleDateString()} · {session.messages.length} messages
                      </p>
                    </div>
                    <button
                      onClick={(e) => deleteSession(session.id, e)}
                      className="p-1.5 rounded-lg hover:bg-red-900/20 text-slate-500 hover:text-red-400 transition-all flex-shrink-0 ml-2"
                    >
                      <HiOutlineTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No chat history yet</p>
            )}
          </div>
        )}

        {/* Chat Area */}
        <div ref={chatRef} className="flex-1 overflow-y-auto py-4 bg-[#1E293B] rounded-2xl border border-[#334155] px-3 sm:px-4 md:px-6">
          {error && (
            <div className="mb-3 flex items-center gap-2 p-3 rounded-xl bg-red-900/10 border border-red-800/30 text-red-400 text-sm">
              <HiOutlineExclamationCircle className="text-lg flex-shrink-0" />
              {error}
            </div>
          )}

          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((msg, i) =>
                msg.role === "user" ? (
                  <div key={i} className="flex justify-end animate-fade-in-up" style={{ animationDelay: "0.05s" }}>
                    <div className="max-w-[85%] sm:max-w-[80%] bg-primary/10 rounded-2xl rounded-br-sm px-3 sm:px-4 py-3">
                      <p className="text-sm text-slate-300 whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-2 sm:gap-3 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0 mt-0.5">
                      <HiOutlineSparkles className="text-white text-xs" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold text-slate-300">
                          AI Assistant
                        </span>
                        <button
                          onClick={() => navigator.clipboard.writeText(msg.content)}
                          className="p-1 rounded-md hover:bg-[#334155] text-slate-500 hover:text-primary-light transition-all"
                          title="Copy"
                        >
                          <HiOutlineClipboardCopy className="text-sm" />
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([msg.content], { type: "text/plain" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "ai-response.txt";
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="p-1 rounded-md hover:bg-[#334155] text-slate-500 hover:text-primary-light transition-all"
                          title="Download"
                        >
                          <HiOutlineDownload className="text-sm" />
                        </button>
                      </div>
                      <div
                        className="text-sm text-slate-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
                      />
                    </div>
                  </div>
                )
              )}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
                    <HiOutlineSparkles className="text-white text-xs" />
                  </div>
                  <div className="flex items-center gap-1.5 py-2">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>
          ) : loading ? (
            <div className="flex gap-3 pt-4">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
                <HiOutlineSparkles className="text-white text-xs" />
              </div>
              <div className="flex items-center gap-1.5 py-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 sm:gap-6 py-8 sm:py-16">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg opacity-20">
                <HiOutlineChatBubbleLeftRight className="text-white text-2xl sm:text-3xl" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white mb-1">How can I help you?</h3>
                <p className="text-xs sm:text-sm text-slate-400">
                  Ask me anything about business, marketing, or any topic
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 w-full max-w-lg mt-2">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => sendMessage(prompt)}
                    className="text-left bg-[#0F172A] border border-[#334155] rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs text-slate-400 hover:border-primary hover:text-primary-light transition-all group"
                  >
                    <HiOutlineSparkles className="text-primary inline mr-1.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="pt-2 sm:pt-3 flex-shrink-0">
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] flex items-end gap-2 p-2 sm:p-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="flex-1 bg-transparent text-sm text-slate-300 placeholder-slate-600 outline-none resize-none py-1.5 px-2 max-h-[200px]"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="p-2 sm:p-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-light text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-md flex-shrink-0"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <HiPaperAirplane className="text-lg" />
              )}
            </button>
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-600 text-center mt-1">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
