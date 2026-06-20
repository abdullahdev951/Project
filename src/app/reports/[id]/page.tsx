"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineArrowLeft,
  HiOutlineClipboardCopy,
  HiOutlineDownload,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

interface AnalysisDoc {
  _id: string;
  businessName: string;
  pdfName?: string | null;
  hasPdf: boolean;
  industry: string;
  report: string;
  createdAt: string;
}

function renderMarkdown(text: string) {
  const escaped = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return escaped
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-[#0b0e13] border border-[#1b222c] text-slate-300 rounded-xl p-4 my-3 overflow-x-auto text-xs leading-relaxed"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-[#0f141b] border border-[#1b222c] text-primary-light px-1.5 py-0.5 rounded text-xs">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-white mt-5 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-6 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-white mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^\* (.+)$/gm, '<li class="ml-4 list-disc text-sm leading-relaxed">$1</li>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc text-sm leading-relaxed">$1</li>')
    .replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal text-sm leading-relaxed">$1</li>')
    .replace(/\n\n/g, '<div class="h-3"></div>')
    .replace(/\n/g, "<br>");
}

export default function FullReportPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [doc, setDoc] = useState<AnalysisDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }
      const res = await fetch(`/api/analyses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Report not found");
      else setDoc(data.analysis);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    load();
  }, [load]);

  const copyReport = () => doc && navigator.clipboard.writeText(doc.report);
  const downloadReport = () => {
    if (!doc) return;
    const blob = new Blob([doc.report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.businessName || "business"}-report.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const deleteReport = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch(`/api/analyses/${id}`, {
      method: "DELETE",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) router.push("/reports");
  };

  return (
    <div className="min-h-screen bg-[#0b0e13]">
      {/* Standalone top bar (no sidebar) */}
      <header className="sticky top-0 z-30 h-16 bg-[#0b0e13]/85 backdrop-blur-xl border-b border-[#1b222c] flex items-center justify-between px-4 sm:px-6">
        <Link href="/reports" className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors">
          <HiOutlineArrowLeft className="text-lg" />
          <span className="text-sm font-medium">Back to Reports</span>
        </Link>
        {doc && (
          <div className="flex items-center gap-2">
            <button onClick={copyReport} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#141a22] border border-[#232b36] text-xs sm:text-sm font-medium text-slate-300 hover:border-primary hover:text-primary-light transition-all">
              <HiOutlineClipboardCopy className="text-sm" /> <span className="hidden sm:inline">Copy</span>
            </button>
            <button onClick={downloadReport} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all">
              <HiOutlineDownload className="text-sm" /> <span className="hidden sm:inline">Download</span>
            </button>
            <button onClick={deleteReport} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 text-xs sm:text-sm font-medium hover:bg-red-900/30 transition-all">
              <HiOutlineTrash className="text-sm" /> <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-2 border-[#232b36] border-t-primary rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-24">
            <HiOutlineExclamationCircle className="text-red-400 text-4xl mx-auto mb-4" />
            <p className="text-slate-400">{error}</p>
            <Link href="/reports" className="inline-block mt-6 text-primary-light font-semibold hover:underline">Back to Reports</Link>
          </div>
        ) : doc ? (
          <div className="animate-fade-in-up">
            {/* Report header */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                <HiOutlineDocumentText className="text-white text-2xl" />
              </div>
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white break-words">{doc.businessName} Report</h1>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/15 text-primary-light">AI-Generated</span>
                  {doc.hasPdf && doc.pdfName && (
                    <span className="text-[11px] text-slate-500 truncate max-w-[240px]">{doc.pdfName}</span>
                  )}
                  <span className="text-[11px] text-slate-500">
                    {new Date(doc.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                </div>
              </div>
            </div>

            {/* Report body */}
            <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-6 sm:p-8">
              <div
                className="text-sm text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(doc.report) }}
              />
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}
