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
import { HiOutlineDocumentChartBar, HiOutlineShare } from "react-icons/hi2";

function renderMarkdown(text: string) {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  return escaped
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre class="bg-slate-900 text-slate-300 rounded-xl p-4 my-3 overflow-x-auto text-xs leading-relaxed"><code>$2</code></pre>')
    .replace(/`([^`]+)`/g, '<code class="bg-cream-dark dark:bg-[#334155] text-primary dark:text-primary-light px-1.5 py-0.5 rounded text-xs">$1</code>')
    .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-foreground dark:text-white mt-5 mb-2">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-foreground dark:text-white mt-6 mb-3">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-foreground dark:text-white mt-6 mb-3">$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground dark:text-white">$1</strong>')
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

  useEffect(() => {
    const savedReport = localStorage.getItem("analysisReport");
    const savedBusiness = localStorage.getItem("analysisBusinessName");
    if (savedReport) setReport(savedReport);
    if (savedBusiness) setBusinessName(savedBusiness);
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

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-3 sm:gap-4 animate-fade-in-up">
          <div>
            <p className="text-xs font-bold text-primary dark:text-primary-light uppercase tracking-widest mb-2">Intelligence Hub</p>
            <h1 className="text-3xl font-extrabold text-foreground dark:text-white">Generated Reports</h1>
            <p className="text-sm text-muted dark:text-slate-400 mt-2">AI-powered business intelligence and analysis reports</p>
          </div>
          {report && (
            <div className="flex items-center gap-2">
              <button
                onClick={copyResult}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#1E293B] border border-[#334155] text-xs sm:text-sm font-medium text-slate-300 hover:border-primary transition-all"
              >
                <HiOutlineClipboardCopy className="text-sm" />
                <span className="hidden sm:inline">Copy</span>
              </button>
              <button
                onClick={downloadResult}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
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

        {report ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Report - spans 2 cols */}
            <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-6 animate-fade-in-up">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-sm">
                    <HiOutlineDocumentChartBar className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-foreground dark:text-white">{businessName || "Business"} Report</h2>
                    <p className="text-xs text-muted dark:text-slate-400">AI-Generated Analysis</p>
                  </div>
                </div>
                <button
                  onClick={clearReport}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10 text-muted dark:text-slate-400 hover:text-red-500 transition-all"
                  title="Clear Report"
                >
                  <HiOutlineRefresh className="text-lg" />
                </button>
              </div>

              <div
                className="text-sm text-foreground dark:text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(report) }}
              />
            </div>

            {/* Right Sidebar Cards */}
            <div className="space-y-4">
              {/* AI Insight Card */}
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center">
                    <HiOutlineLightningBolt className="text-amber-500 text-lg" />
                  </div>
                  <span className="text-xs font-bold text-muted dark:text-slate-400 uppercase tracking-wider">AI Insights</span>
                </div>
                <p className="text-xs text-muted dark:text-slate-400 leading-relaxed mb-4">
                  Key patterns and anomalies detected from your business data have been highlighted in the report.
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-edge dark:border-[#334155]">
                  <span className="text-xs text-muted dark:text-slate-400">Confidence</span>
                  <span className="text-sm font-bold text-green-400">High</span>
                </div>
                <div className="mt-2 h-2 bg-slate-100 dark:bg-[#334155] rounded-full overflow-hidden">
                  <div className="h-full w-[92%] bg-gradient-to-r from-primary to-primary-light rounded-full"></div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-5">
                <h3 className="text-sm font-bold text-foreground dark:text-white mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/upload" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-all group">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <HiOutlineUpload className="text-primary text-sm" />
                    </div>
                    <span className="text-xs font-medium text-muted dark:text-slate-400 group-hover:text-foreground dark:group-hover:text-white">New Analysis</span>
                  </Link>
                  <button onClick={downloadResult} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-all group w-full text-left">
                    <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                      <HiOutlineDownload className="text-green-500 text-sm" />
                    </div>
                    <span className="text-xs font-medium text-muted dark:text-slate-400 group-hover:text-foreground dark:group-hover:text-white">Download Report</span>
                  </button>
                  <button onClick={copyResult} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-all group w-full text-left">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <HiOutlineClipboardCopy className="text-amber-500 text-sm" />
                    </div>
                    <span className="text-xs font-medium text-muted dark:text-slate-400 group-hover:text-foreground dark:group-hover:text-white">Copy to Clipboard</span>
                  </button>
                </div>
              </div>

              {/* Report Stats */}
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-5">
                <h3 className="text-sm font-bold text-foreground dark:text-white mb-3">Report Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted dark:text-slate-400">Business</span>
                    <span className="text-xs font-semibold text-foreground dark:text-white">{businessName || "N/A"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted dark:text-slate-400">Generated</span>
                    <span className="text-xs font-semibold text-foreground dark:text-white">Today</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted dark:text-slate-400">AI Model</span>
                    <span className="text-xs font-semibold text-foreground dark:text-white">Gemini 2.5</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Main Empty State */}
            <div className="md:col-span-2 bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-12 text-center">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <HiOutlineChartBar className="text-primary/40 text-4xl" />
              </div>
              <h3 className="text-xl font-bold text-foreground dark:text-white mb-2">No Reports Yet</h3>
              <p className="text-sm text-muted dark:text-slate-400 max-w-md mx-auto mb-6">
                Upload your business details or a PDF document to get a comprehensive AI-powered analysis report.
              </p>
              <Link
                href="/upload"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all"
              >
                <HiOutlineUpload className="text-lg" />
                Go to Upload & Analyze
              </Link>
            </div>

            {/* Side Cards */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <HiOutlineDocumentText className="text-primary text-lg" />
                </div>
                <h3 className="text-sm font-bold text-foreground dark:text-white mb-1">PDF Upload</h3>
                <p className="text-xs text-muted dark:text-slate-400 leading-relaxed">Upload financial reports, sales data, or any business document for analysis.</p>
              </div>
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                  <HiOutlineLightningBolt className="text-amber-500 text-lg" />
                </div>
                <h3 className="text-sm font-bold text-foreground dark:text-white mb-1">AI Analysis</h3>
                <p className="text-xs text-muted dark:text-slate-400 leading-relaxed">Get insights including health score, profit/loss, and growth strategies.</p>
              </div>
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-5">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-3">
                  <HiOutlineTrendingUp className="text-green-500 text-lg" />
                </div>
                <h3 className="text-sm font-bold text-foreground dark:text-white mb-1">Actionable Insights</h3>
                <p className="text-xs text-muted dark:text-slate-400 leading-relaxed">Get tailored recommendations to grow your business effectively.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
