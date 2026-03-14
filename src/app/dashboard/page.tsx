"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import {
  HiOutlineChartBar,
  HiOutlineTrendingUp,
  HiOutlineTrendingDown,
  HiOutlineUpload,
  HiOutlineArrowRight,
  HiOutlineTrash,
  HiOutlineLightningBolt,
  HiOutlineCurrencyDollar,
  HiOutlineUserGroup,
  HiOutlineGlobe,
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentChartBar,
  HiOutlineBuildingOffice2,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
} from "react-icons/hi2";

interface AnalysisData {
  businessName: string;
  industry: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  marketingBudget: number;
  numberOfCustomers: number;
  businessAge: string;
  country: string;
  report: string;
  analyzedAt: string;
  hasPdf: boolean;
  pdfName: string | null;
}

export default function DashboardPage() {
  const [data, setData] = useState<AnalysisData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("analysisData");
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  const clearAnalysis = () => {
    localStorage.removeItem("analysisData");
    localStorage.removeItem("analysisReport");
    localStorage.removeItem("analysisBusinessName");
    setData(null);
    setShowDeleteConfirm(false);
  };

  // Computed metrics
  const profit = data ? data.monthlyRevenue - data.monthlyExpenses : 0;
  const profitMargin = data && data.monthlyRevenue > 0 ? (profit / data.monthlyRevenue) * 100 : 0;
  const isProfit = profit >= 0;
  const healthScore = data ? Math.min(100, Math.max(0, 50 + profitMargin)) : 0;
  const healthLabel = healthScore >= 75 ? "Excellent" : healthScore >= 50 ? "Good" : healthScore >= 25 ? "Needs Work" : "Critical";
  const healthColor = healthScore >= 75 ? "text-green-400" : healthScore >= 50 ? "text-amber-400" : healthScore >= 25 ? "text-orange-400" : "text-red-400";
  const healthBg = healthScore >= 75 ? "from-green-500 to-emerald-400" : healthScore >= 50 ? "from-amber-500 to-yellow-400" : healthScore >= 25 ? "from-orange-500 to-amber-400" : "from-red-500 to-rose-400";

  const formatCurrency = (n: number) => {
    if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
    return `$${n.toLocaleString()}`;
  };

  const analyzedDate = data ? new Date(data.analyzedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  // If no analysis yet — show empty state
  if (!data) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 animate-fade-in-up">
            <p className="text-xs font-bold text-primary-light uppercase tracking-widest mb-2">Dashboard</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">Welcome to AI Assist Pro</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">Upload your business data to unlock AI-powered analytics</p>
          </div>

          {/* Empty State CTA */}
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-8 sm:p-12 text-center mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <HiOutlineChartBar className="text-primary/50 text-4xl" />
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-3">No Analysis Yet</h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto mb-8">
              Upload your business details or a PDF document to get a comprehensive AI-powered analysis with real insights about your business performance.
            </p>
            <Link
              href="/upload"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all"
            >
              <HiOutlineUpload className="text-lg" />
              Upload & Analyze Your Business
              <HiOutlineArrowRight />
            </Link>
          </div>

          {/* Feature Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-3">
                <HiOutlineCurrencyDollar className="text-green-500 text-lg" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Profit & Loss</h3>
              <p className="text-xs text-slate-400 leading-relaxed">See your real profit margins, revenue breakdown and expense analysis.</p>
            </div>
            <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                <HiOutlineLightningBolt className="text-amber-500 text-lg" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">AI Insights</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Get competition analysis, market value, and growth strategies from AI.</p>
            </div>
            <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <HiOutlineChatBubbleLeftRight className="text-primary-light text-lg" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">AI Suggestions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Ask AI for personalized tips to grow your business and increase profit.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Has analysis data — show real dashboard
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-3 animate-fade-in-up">
          <div>
            <p className="text-xs font-bold text-primary-light uppercase tracking-widest mb-2">Business Analytics</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">{data.businessName}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              {data.industry} &bull; Analyzed {analyzedDate}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/upload"
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
            >
              <HiOutlineUpload className="text-sm" />
              <span className="hidden sm:inline">New Analysis</span>
              <span className="sm:hidden">New</span>
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-900/20 border border-red-800/30 text-xs sm:text-sm font-medium text-red-400 hover:bg-red-900/30 transition-all"
            >
              <HiOutlineTrash className="text-sm" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {/* Revenue */}
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <HiOutlineCurrencyDollar className="text-green-500 text-lg" />
              </div>
              <HiOutlineTrendingUp className="text-green-400 text-lg" />
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1">Monthly Revenue</p>
            <p className="text-xl sm:text-2xl font-extrabold text-white">{formatCurrency(data.monthlyRevenue)}</p>
          </div>

          {/* Expenses */}
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                <HiOutlineExclamationCircle className="text-red-400 text-lg" />
              </div>
              <HiOutlineTrendingDown className="text-red-400 text-lg" />
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1">Monthly Expenses</p>
            <p className="text-xl sm:text-2xl font-extrabold text-white">{formatCurrency(data.monthlyExpenses)}</p>
          </div>

          {/* Profit/Loss */}
          <div className={`bg-[#1E293B] rounded-2xl border ${isProfit ? "border-green-800/30" : "border-red-800/30"} p-4 sm:p-5`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${isProfit ? "bg-green-500/10" : "bg-red-500/10"} flex items-center justify-center`}>
                {isProfit ? <HiOutlineArrowTrendingUp className="text-green-400 text-lg" /> : <HiOutlineArrowTrendingDown className="text-red-400 text-lg" />}
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isProfit ? "bg-green-900/30 text-green-400" : "bg-red-900/30 text-red-400"}`}>
                {isProfit ? "PROFIT" : "LOSS"}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1">Monthly {isProfit ? "Profit" : "Loss"}</p>
            <p className={`text-xl sm:text-2xl font-extrabold ${isProfit ? "text-green-400" : "text-red-400"}`}>
              {isProfit ? "+" : "-"}{formatCurrency(Math.abs(profit))}
            </p>
            <p className="text-[10px] text-slate-500 mt-1">{profitMargin.toFixed(1)}% margin</p>
          </div>

          {/* Customers */}
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <HiOutlineUserGroup className="text-primary-light text-lg" />
              </div>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1">Customers</p>
            <p className="text-xl sm:text-2xl font-extrabold text-white">{data.numberOfCustomers > 0 ? data.numberOfCustomers.toLocaleString() : "N/A"}</p>
            {data.numberOfCustomers > 0 && data.monthlyRevenue > 0 && (
              <p className="text-[10px] text-slate-500 mt-1">{formatCurrency(data.monthlyRevenue / data.numberOfCustomers)}/customer</p>
            )}
          </div>
        </div>

        {/* Revenue vs Expenses Chart + Business Health */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          {/* Visual Breakdown */}
          <div className="lg:col-span-2 bg-[#1E293B] rounded-2xl border border-[#334155] p-4 sm:p-6">
            <h3 className="text-sm font-bold text-white mb-5">Revenue vs Expenses Breakdown</h3>

            <div className="space-y-5">
              {/* Revenue Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Revenue</span>
                  <span className="text-sm font-bold text-green-400">{formatCurrency(data.monthlyRevenue)}</span>
                </div>
                <div className="h-4 bg-[#0F172A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: "100%" }} />
                </div>
              </div>

              {/* Expenses Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Expenses</span>
                  <span className="text-sm font-bold text-red-400">{formatCurrency(data.monthlyExpenses)}</span>
                </div>
                <div className="h-4 bg-[#0F172A] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full transition-all duration-1000" style={{ width: data.monthlyRevenue > 0 ? `${(data.monthlyExpenses / data.monthlyRevenue) * 100}%` : "100%" }} />
                </div>
              </div>

              {/* Marketing Bar */}
              {data.marketingBudget > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Marketing Budget</span>
                    <span className="text-sm font-bold text-amber-400">{formatCurrency(data.marketingBudget)}</span>
                  </div>
                  <div className="h-4 bg-[#0F172A] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-1000" style={{ width: data.monthlyRevenue > 0 ? `${(data.marketingBudget / data.monthlyRevenue) * 100}%` : "50%" }} />
                  </div>
                </div>
              )}

              {/* Profit Bar */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{isProfit ? "Net Profit" : "Net Loss"}</span>
                  <span className={`text-sm font-bold ${isProfit ? "text-green-400" : "text-red-400"}`}>{isProfit ? "+" : "-"}{formatCurrency(Math.abs(profit))}</span>
                </div>
                <div className="h-4 bg-[#0F172A] rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${isProfit ? "from-primary to-primary-light" : "from-red-600 to-red-400"} rounded-full transition-all duration-1000`} style={{ width: data.monthlyRevenue > 0 ? `${Math.min(100, (Math.abs(profit) / data.monthlyRevenue) * 100)}%` : "0%" }} />
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="mt-6 pt-4 border-t border-[#334155] grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Industry</p>
                <p className="text-xs font-bold text-white">{data.industry}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Business Age</p>
                <p className="text-xs font-bold text-white">{data.businessAge}</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Country</p>
                <p className="text-xs font-bold text-white">{data.country}</p>
              </div>
            </div>
          </div>

          {/* Business Health Score */}
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-4 sm:p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <HiOutlineShieldCheck className="text-primary-light text-lg" />
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Health Score</span>
            </div>

            {/* Circular Score */}
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#334155" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#healthGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${healthScore * 2.64} 264`} />
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={healthScore >= 50 ? "#6366F1" : "#EF4444"} />
                      <stop offset="100%" stopColor={healthScore >= 50 ? "#818CF8" : "#F87171"} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white">{Math.round(healthScore)}</span>
                  <span className="text-[9px] text-slate-500 uppercase tracking-wider">/ 100</span>
                </div>
              </div>
              <span className={`mt-3 text-sm font-bold ${healthColor}`}>{healthLabel}</span>
              <p className="text-[10px] text-slate-500 text-center mt-1">Based on profit margin</p>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3 pt-4 border-t border-[#334155]">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Profit Margin</span>
                <span className={`text-xs font-bold ${isProfit ? "text-green-400" : "text-red-400"}`}>{profitMargin.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Expense Ratio</span>
                <span className="text-xs font-bold text-white">
                  {data.monthlyRevenue > 0 ? ((data.monthlyExpenses / data.monthlyRevenue) * 100).toFixed(1) : 0}%
                </span>
              </div>
              {data.marketingBudget > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Marketing %</span>
                  <span className="text-xs font-bold text-amber-400">
                    {data.monthlyRevenue > 0 ? ((data.marketingBudget / data.monthlyRevenue) * 100).toFixed(1) : 0}%
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          {/* AI Suggestions */}
          <Link href="/ai-assistant" className="group">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/30 p-5 hover:border-primary transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3">
                <HiOutlineLightningBolt className="text-primary-light text-lg" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">AI Growth Suggestions</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Ask AI for personalized strategies to {isProfit ? "increase your profit" : "reduce losses"} and grow your business.
              </p>
              <span className="text-xs font-semibold text-primary-light flex items-center gap-1 group-hover:gap-2 transition-all">
                Get Suggestions <HiOutlineArrowRight />
              </span>
            </div>
          </Link>

          {/* View Full Report */}
          <Link href="/reports" className="group">
            <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5 hover:border-primary transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center mb-3">
                <HiOutlineDocumentChartBar className="text-green-500 text-lg" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">View Full Report</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">
                Read the complete AI analysis report with competition, market insights and recommendations.
              </p>
              <span className="text-xs font-semibold text-primary-light flex items-center gap-1 group-hover:gap-2 transition-all">
                Open Report <HiOutlineArrowRight />
              </span>
            </div>
          </Link>

          {/* Business Info */}
          <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
              <HiOutlineBuildingOffice2 className="text-amber-500 text-lg" />
            </div>
            <h3 className="text-sm font-bold text-white mb-3">Business Details</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Industry</span>
                <span className="text-[10px] font-semibold text-slate-300">{data.industry}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Location</span>
                <span className="text-[10px] font-semibold text-slate-300">{data.country}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Age</span>
                <span className="text-[10px] font-semibold text-slate-300">{data.businessAge}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500">Source</span>
                <span className="text-[10px] font-semibold text-slate-300">{data.hasPdf ? "PDF + Form" : "Manual Entry"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#1E293B] rounded-2xl border border-[#334155] p-6 max-w-sm w-full animate-scale-in">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineTrash className="text-red-400 text-xl" />
              </div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Delete Analysis?</h3>
              <p className="text-sm text-slate-400 text-center mb-6">
                This will remove all your business analysis data and dashboard metrics. You&apos;ll need to upload again to see data.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#334155] text-sm font-medium text-slate-300 hover:bg-[#334155] transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={clearAnalysis}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
