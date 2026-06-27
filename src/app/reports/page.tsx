"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  HiOutlineChartBar,
  HiOutlineUpload,
  HiOutlineTrash,
  HiOutlineDocumentText,
  HiOutlineArrowRight,
  HiOutlineCurrencyDollar,
  HiOutlineExclamationCircle,
} from "react-icons/hi";

interface AnalysisItem {
  _id: string;
  businessName: string;
  pdfName?: string | null;
  hasPdf: boolean;
  industry: string;
  country: string;
  businessAge: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  marketingBudget: number;
  numberOfCustomers: number;
  report: string;
  widgets: Record<string, unknown>;
  createdAt: string;
}

const formatCurrency = (n: number) => {
  if (!n) return "$0";
  if (Math.abs(n) >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n.toLocaleString()}`;
};

export default function ReportsPage() {
  const router = useRouter();
  const [items, setItems] = useState<AnalysisItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  // Load this report's analysis onto the dashboard and go there.
  const openOnDashboard = (it: AnalysisItem) => {
    const analysisData = {
      businessName: it.businessName,
      industry: it.industry,
      monthlyRevenue: it.monthlyRevenue,
      monthlyExpenses: it.monthlyExpenses,
      marketingBudget: it.marketingBudget,
      numberOfCustomers: it.numberOfCustomers,
      businessAge: it.businessAge,
      country: it.country,
      report: it.report,
      analyzedAt: it.createdAt,
      hasPdf: it.hasPdf,
      pdfName: it.pdfName || null,
      widgets: it.widgets || {},
    };
    localStorage.setItem("analysisData", JSON.stringify(analysisData));
    localStorage.setItem("analysisReport", it.report);
    localStorage.setItem("analysisBusinessName", it.businessName);
    localStorage.setItem("activeAnalysisId", it._id);
    router.push("/dashboard");
  };

  const load = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/analyses", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (!res.ok) setError(data.error || "Failed to load reports");
      else setItems(data.analyses || []);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    setDeleting(id);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/analyses/${id}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        setItems((prev) => prev.filter((x) => x._id !== id));
        // If the deleted one is the active dashboard analysis, clear it too.
        if (localStorage.getItem("activeAnalysisId") === id) {
          localStorage.removeItem("activeAnalysisId");
          localStorage.removeItem("analysisData");
          localStorage.removeItem("analysisReport");
          localStorage.removeItem("analysisBusinessName");
        }
      }
    } catch {
      // ignore
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-4 sm:space-y-5">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 animate-fade-in-up">
          <div>
            <p className="text-xs font-bold text-primary-light uppercase tracking-widest mb-2">Intelligence Hub</p>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Saved Reports</h1>
            <p className="text-sm text-slate-400 mt-2">Your analyzed business reports — saved and available anytime.</p>
          </div>
          <Link
            href="/upload"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary/25 transition-all w-max"
          >
            <HiOutlineUpload className="text-sm" /> New Analysis
          </Link>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/10 border border-red-800/30 text-red-400 text-sm">
            <HiOutlineExclamationCircle className="text-lg flex-shrink-0" /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#232b36] border-t-primary rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          /* Empty state */
          <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-12 text-center animate-fade-in-up bg-grid">
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-float">
              <HiOutlineChartBar className="text-primary-light/60 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No Reports Yet</h3>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
              Upload your business details or a PDF document to generate your first AI-powered analysis report.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <HiOutlineUpload className="text-lg" /> Go to Upload &amp; Analyze
            </Link>
          </div>
        ) : (
          /* Cards grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 stagger">
            {items.map((it) => {
              const profit = it.monthlyRevenue - it.monthlyExpenses;
              const isProfit = profit >= 0;
              return (
                <div
                  key={it._id}
                  className="relative overflow-hidden rounded-2xl border border-[#1b222c] bg-gradient-to-br from-primary/5 via-[#141a22] to-[#141a22] p-5 card-hover"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative">
                    <button
                      onClick={() => openOnDashboard(it)}
                      className="flex items-start gap-3 mb-4 w-full text-left group/card"
                      title="Open this analysis on the dashboard"
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary/20">
                        <HiOutlineDocumentText className="text-white text-xl" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-white truncate group-hover/card:text-primary-light transition-colors" title={it.businessName}>{it.businessName}</h3>
                        <p className="text-[11px] text-slate-500 truncate">
                          {it.hasPdf && it.pdfName ? it.pdfName : it.industry || "Manual entry"} · {formatDate(it.createdAt)}
                        </p>
                      </div>
                    </button>

                    <div onClick={() => openOnDashboard(it)} className="grid grid-cols-2 gap-3 mb-4 cursor-pointer">
                      <div className="rounded-xl bg-[#0f141b] border border-[#1b222c] p-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-1"><HiOutlineCurrencyDollar className="text-primary-light" /> Revenue</div>
                        <p className="text-sm font-bold text-white">{formatCurrency(it.monthlyRevenue)}</p>
                      </div>
                      <div className="rounded-xl bg-[#0f141b] border border-[#1b222c] p-3">
                        <div className="text-[11px] text-slate-400 mb-1">{isProfit ? "Profit" : "Loss"}</div>
                        <p className={`text-sm font-bold ${isProfit ? "text-primary-light" : "text-red-400"}`}>{isProfit ? "+" : "-"}{formatCurrency(Math.abs(profit))}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/reports/${it._id}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-all"
                      >
                        View Full Report <HiOutlineArrowRight />
                      </Link>
                      <button
                        onClick={() => remove(it._id)}
                        disabled={deleting === it._id}
                        className="p-2.5 rounded-xl bg-red-900/20 border border-red-800/30 text-red-400 hover:bg-red-900/30 transition-all disabled:opacity-50"
                        title="Delete report"
                      >
                        {deleting === it._id ? (
                          <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                        ) : (
                          <HiOutlineTrash className="text-base" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
