"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import {
  HiOutlineChartBar,
  HiOutlineUpload,
  HiOutlineClipboardCopy,
  HiOutlineDownload,
  HiOutlineRefresh,
  HiOutlineTrash,
  HiOutlineLightningBolt,
  HiOutlineTrendingUp,
  HiOutlineDocumentText,
} from "react-icons/hi";
import { HiOutlineDocumentChartBar } from "react-icons/hi2";

function renderMarkdown(text: string) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

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

export default function ReportsPage() {
  const [report, setReport] = useState<string>("");
  const [businessName, setBusinessName] = useState<string>("");
  const [pdfName, setPdfName] = useState<string | null>(null);
  const [analyzedAt, setAnalyzedAt] = useState<string>("");

  useEffect(() => {
    const savedReport = localStorage.getItem("analysisReport");
    const savedBusiness = localStorage.getItem("analysisBusinessName");
    if (savedReport) setReport(savedReport);
    if (savedBusiness) setBusinessName(savedBusiness);
    try {
      const raw = localStorage.getItem("analysisData");
      if (raw) {
        const d = JSON.parse(raw);
        setPdfName(d.pdfName || null);
        if (d.analyzedAt) {
          setAnalyzedAt(new Date(d.analyzedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const copyResult = () => {
    navigator.clipboard.writeText(report);
  };

  const downloadResult = () => {
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${businessName || "business"}-analysis.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearReport = () => {
    setReport("");
    setBusinessName("");
    localStorage.removeItem("analysisReport");
    localStorage.removeItem("analysisBusinessName");
    localStorage.removeItem("analysisData");
  };

  // Lightweight presentational stats derived from the report text (no logic change).
  const wordCount = report ? report.trim().split(/\s+/).length : 0;
  const summaryStats = [
    { label: "Words Analyzed", value: report ? wordCount.toLocaleString() : "—", icon: HiOutlineDocumentText, tint: "from-primary/20 text-primary-light" },
    { label: "Confidence", value: report ? "High" : "—", icon: HiOutlineLightningBolt, tint: "from-amber-500/20 text-amber-400" },
    { label: "Status", value: report ? "Ready" : "Pending", icon: HiOutlineTrendingUp, tint: "from-sky-500/20 text-sky-400" },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-5">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4 animate-fade-in-up">
          <div>
            <p className="text-xs font-bold text-primary-light uppercase tracking-widest mb-2">Intelligence Hub</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Generated Reports</h1>
            <p className="text-sm text-slate-400 mt-2">AI-powered business intelligence and analysis reports</p>
          </div>
          {report && (
            <div className="flex items-center gap-2">
              <button
                onClick={copyResult}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#141a22] border border-[#232b36] text-xs sm:text-sm font-medium text-slate-300 hover:border-primary hover:text-primary-light transition-all"
              >
                <HiOutlineClipboardCopy className="text-sm" />
                <span className="hidden sm:inline">Copy</span>
              </button>
              <button
                onClick={downloadResult}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-xs sm:text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                <HiOutlineDownload className="text-sm" />
                <span className="hidden sm:inline">Download</span>
              </button>
              <button
                onClick={clearReport}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-900/20 border border-red-800/30 text-xs sm:text-sm font-medium text-red-400 hover:bg-red-900/30 transition-all"
              >
                <HiOutlineTrash className="text-sm" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          )}
        </div>

        {/* Uploaded PDF card */}
        {report && pdfName && (
          <div className="relative overflow-hidden rounded-2xl border border-[#1b222c] bg-gradient-to-br from-primary/10 via-[#141a22] to-[#141a22] p-5 animate-fade-in-up">
            <div className="absolute -right-10 -top-10 w-36 h-36 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                <HiOutlineDocumentText className="text-white text-2xl" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-primary/15 text-primary-light">UPLOADED FILE</span>
                  {analyzedAt && <span className="text-[11px] text-slate-500">Analyzed {analyzedAt}</span>}
                </div>
                <p className="text-base sm:text-lg font-bold text-white truncate" title={pdfName}>{pdfName}</p>
                <p className="text-xs text-slate-400 mt-0.5">This report was generated from your uploaded document.</p>
              </div>
              <button
                onClick={downloadResult}
                className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f141b] border border-[#232b36] text-sm font-medium text-slate-300 hover:border-primary hover:text-primary-light transition-all flex-shrink-0"
              >
                <HiOutlineDownload className="text-sm" /> Download
              </button>
            </div>
          </div>
        )}

        {/* Summary stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 stagger">
          {summaryStats.map((s) => (
            <div key={s.label} className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-5 card-hover">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${s.tint} to-transparent flex items-center justify-center`}>
                  <s.icon className="text-xl" />
                </div>
                <span className="text-slate-300 font-medium text-sm">{s.label}</span>
              </div>
              <span className="text-2xl font-bold text-white">{s.value}</span>
            </div>
          ))}
        </div>

        {report ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
            {/* Main Report - spans 2 cols */}
            <div className="lg:col-span-2 rounded-2xl bg-[#141a22] border border-[#1b222c] p-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                    <HiOutlineDocumentChartBar className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">{businessName || "Business"} Report</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-primary/15 text-primary-light">AI-Generated</span>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-sky-500/15 text-sky-400">Today</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={clearReport}
                  className="p-2 rounded-lg hover:bg-red-900/10 text-slate-400 hover:text-red-400 transition-all"
                  title="Clear Report"
                >
                  <HiOutlineRefresh className="text-lg" />
                </button>
              </div>

              <div
                className="text-sm text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(report) }}
              />
            </div>

            {/* Right Sidebar Cards */}
            <div className="space-y-4 sm:space-y-5">
              {/* AI Insight Card */}
              <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <HiOutlineLightningBolt className="text-amber-400 text-lg" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Insights</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Key patterns and anomalies detected from your business data have been highlighted in the report.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-[#1b222c]">
                  <span className="text-xs text-slate-400">Confidence</span>
                  <span className="text-sm font-bold text-primary-light">High</span>
                </div>
                <div className="mt-2 h-2 bg-[#1b222c] rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-primary to-primary-light rounded-full"></div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-5">
                <h3 className="text-sm font-bold text-white mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/upload" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#0f141b] transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <HiOutlineUpload className="text-primary-light text-sm" />
                    </div>
                    <span className="text-xs font-medium text-slate-400 group-hover:text-white">New Analysis</span>
                  </Link>
                  <button onClick={downloadResult} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#0f141b] transition-all group w-full text-left">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <HiOutlineDownload className="text-primary-light text-sm" />
                    </div>
                    <span className="text-xs font-medium text-slate-400 group-hover:text-white">Download Report</span>
                  </button>
                  <button onClick={copyResult} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#0f141b] transition-all group w-full text-left">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <HiOutlineClipboardCopy className="text-amber-400 text-sm" />
                    </div>
                    <span className="text-xs font-medium text-slate-400 group-hover:text-white">Copy to Clipboard</span>
                  </button>
                </div>
              </div>

              {/* Report Stats */}
              <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-5">
                <h3 className="text-sm font-bold text-white mb-3">Report Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Business</span>
                    <span className="text-xs font-semibold text-white">{businessName || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Generated</span>
                    <span className="text-xs font-semibold text-white">Today</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">AI Model</span>
                    <span className="text-xs font-semibold text-white">Gemini 2.5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            {/* Main Empty State */}
            <div className="sm:col-span-2 rounded-2xl bg-[#141a22] border border-[#1b222c] p-12 text-center animate-fade-in-up">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-float">
                <HiOutlineChartBar className="text-primary-light/60 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No Reports Yet</h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
                Upload your business details or a PDF document to get a comprehensive AI-powered analysis report.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all"
              >
                <HiOutlineUpload className="text-lg" />
                Go to Upload &amp; Analyze
              </Link>
            </div>

            {/* Side Cards */}
            <div className="space-y-4 sm:space-y-5 stagger">
              <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-5 card-hover">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <HiOutlineDocumentText className="text-primary-light text-lg" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">PDF Upload</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Upload financial reports, sales data, or any business document for analysis.</p>
              </div>
              <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-5 card-hover">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                  <HiOutlineLightningBolt className="text-amber-400 text-lg" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">AI Analysis</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Get insights including health score, profit/loss, and growth strategies.</p>
              </div>
              <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-5 card-hover">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <HiOutlineTrendingUp className="text-primary-light text-lg" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">Actionable Insights</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Get tailored recommendations to grow your business effectively.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
