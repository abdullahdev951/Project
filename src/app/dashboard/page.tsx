"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
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
  HiOutlineShieldCheck,
  HiOutlineExclamationCircle,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineSparkles,
} from "react-icons/hi";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentChartBar,
  HiOutlineBuildingOffice2,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
} from "react-icons/hi2";

/* ---------- inline chart helpers (no deps) ---------- */

function AreaChart() {
  const pts = [30, 41, 28, 51, 42, 108, 100];
  const max = 120;
  const w = 760;
  const h = 230;
  const stepX = w / (pts.length - 1);
  const coords = pts.map((v, i) => [i * stepX, h - (v / max) * h]);
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c[0]},${c[1]}`).join(" ");
  const area = `${line} L ${w},${h} L 0,${h} Z`;
  const months = ["Jan", "Feb", "March", "April", "May", "Jun", "Jul"];
  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${w} ${h + 28}`} className="w-full h-[200px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00a76f" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#00a76f" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1="0" y1={h * g} x2={w} y2={h * g} stroke="#1b222c" strokeDasharray="4 6" />
        ))}
        <path d={area} fill="url(#areaFill)" />
        <path d={line} fill="none" stroke="#00a76f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-line" />
        {coords.map((c, i) => (
          <circle key={i} cx={c[0]} cy={c[1]} r="5" fill="#0b0e13" stroke="#00a76f" strokeWidth="3" />
        ))}
        {months.map((m, i) => (
          <text key={m} x={i * stepX} y={h + 20} fill="#64748b" fontSize="12" textAnchor={i === 0 ? "start" : i === months.length - 1 ? "end" : "middle"}>
            {m}
          </text>
        ))}
      </svg>
    </div>
  );
}

function Donut({ segments, size = 200, thickness = 26 }: { segments: { value: number; color: string }[]; size?: number; thickness?: number }) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1b222c" strokeWidth={thickness} />
      {segments.map((s, i) => {
        const len = (s.value / total) * c;
        const el = (
          <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={thickness} strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} strokeLinecap="round" />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}

/* ---------- sample showcase data for the rich widgets ---------- */

const productSales = [
  { name: "Smartphones", value: 38.1, amount: "$22,120", color: "#00a76f" },
  { name: "Laptops", value: 28.6, amount: "$4,510", color: "#f5a524" },
  { name: "Headphones", value: 23.8, amount: "$800", color: "#38bdf8" },
  { name: "Cameras", value: 9.5, amount: "$420", color: "#f87171" },
];

const orders = [
  { id: "#DU005", amount: "$150", method: "Standard", date: "Jan 20, 2025", status: "Shipped" },
  { id: "#DU004", amount: "$200", method: "Express", date: "Jan 22, 2025", status: "Pending" },
  { id: "#DU003", amount: "$300", method: "Overnight", date: "Jan 18, 2025", status: "Cancel" },
  { id: "#DU002", amount: "$560", method: "Overnight", date: "Jan 13, 2025", status: "Completed" },
  { id: "#DU001", amount: "$560", method: "Overnight", date: "Jan 11, 2025", status: "Completed" },
];

const statusStyle: Record<string, string> = {
  Shipped: "bg-sky-500/15 text-sky-400",
  Pending: "bg-amber-500/15 text-amber-400",
  Cancel: "bg-red-500/15 text-red-400",
  Completed: "bg-primary/15 text-primary-light",
};

const locations = [
  { country: "United States", amount: "$22,120", pct: 90, color: "#00a76f" },
  { country: "India", amount: "$12,756", pct: 55, color: "#00a76f" },
  { country: "United Kingdom", amount: "$8,864", pct: 38, color: "#38bdf8" },
  { country: "Sweden", amount: "$6,124", pct: 26, color: "#f5a524" },
];

const topProducts = [
  { name: "Transparent Sunglasses", sale: 454, revenue: "$50,000", rating: "5/5", status: "In Stock" },
  { name: "Frames Still Life Glasses", sale: 454, revenue: "$50,000", rating: "5/5", status: "In Stock" },
  { name: "Slightly Rounded Frame", sale: 124, revenue: "$30,000", rating: "4.0/5", status: "Low Stock" },
  { name: "Colored-Transparent Sunglasses", sale: 124, revenue: "$30,000", rating: "4.0/5", status: "Low Stock" },
  { name: "Rounded Frames Glasses", sale: 124, revenue: "$30,000", rating: "4.8/5", status: "Out of Stock" },
];

const stockStyle: Record<string, string> = {
  "In Stock": "bg-sky-500/15 text-sky-400",
  "Low Stock": "bg-amber-500/15 text-amber-400",
  "Out of Stock": "bg-red-500/15 text-red-400",
};

const ideas = [
  { title: "Create a Blog Post for your product", body: "Generate SEO-ready blog content from your business data in seconds with AI." },
  { title: "Summarize your latest report", body: "Turn a 40-page PDF into a one-paragraph executive summary instantly." },
  { title: "Draft a sales email campaign", body: "Personalized outreach emails based on your top customer segments." },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-[#141a22] border border-[#1b222c] ${className}`}>{children}</div>;
}

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
  const { user } = useAuth();
  const [data, setData] = useState<AnalysisData | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [idea, setIdea] = useState(0);
  const firstName = user?.name?.split(" ")[0] || "there";

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
  const healthColor = healthScore >= 75 ? "text-primary-light" : healthScore >= 50 ? "text-amber-400" : healthScore >= 25 ? "text-orange-400" : "text-red-400";

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

          <div className="relative overflow-hidden bg-[#141a22] rounded-2xl border border-[#1b222c] p-8 sm:p-12 text-center mb-4 animate-fade-in-up bg-grid" style={{ animationDelay: "0.1s" }}>
            <div className="absolute inset-0 bg-glow pointer-events-none" />
            <div className="relative">
              <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-float">
                <HiOutlineChartBar className="text-primary-light text-4xl" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-3">No Analysis Yet</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto mb-8">
                Upload your business details or a PDF document to get a comprehensive AI-powered analysis with real insights about your business performance.
              </p>
              <Link href="/upload" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold px-8 py-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all">
                <HiOutlineUpload className="text-lg" />
                Upload &amp; Analyze Your Business
                <HiOutlineArrowRight />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 stagger">
            <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-5 card-hover">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <HiOutlineCurrencyDollar className="text-primary-light text-lg" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Profit &amp; Loss</h3>
              <p className="text-xs text-slate-400 leading-relaxed">See your real profit margins, revenue breakdown and expense analysis.</p>
            </div>
            <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-5 card-hover">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
                <HiOutlineLightningBolt className="text-amber-400 text-lg" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">AI Insights</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Get competition analysis, market value, and growth strategies from AI.</p>
            </div>
            <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-5 card-hover">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center mb-3">
                <HiOutlineChatBubbleLeftRight className="text-sky-400 text-lg" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">AI Suggestions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Ask AI for personalized tips to grow your business and increase profit.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Has analysis data — show real dashboard + rich widgets
  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Greeting banner + Ideas */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <div className="xl:col-span-2 relative overflow-hidden rounded-2xl p-6 sm:p-7 animate-fade-in-up">
            <div className="absolute inset-0 animate-gradient bg-[linear-gradient(110deg,#00855a_0%,#1d6b54_45%,#0b3b2c_100%)]" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                <span className="animate-float inline-block">👋</span> Hello {firstName},
              </h2>
              <p className="text-white/80 text-sm mt-2 max-w-md">
                Here&apos;s your latest business analysis. Monitor your performance, track progress and gain AI-powered insights.
              </p>
              <Link href="/ai-assistant" className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-white text-[#0b0e13] text-sm font-semibold hover:bg-white/90 transition-all">
                <HiOutlineSparkles className="text-lg text-primary" /> Start AI
              </Link>
            </div>
          </div>

          <Card className="p-5 sm:p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Ideas for You</h3>
              <div className="flex gap-2">
                <button onClick={() => setIdea((i) => (i - 1 + ideas.length) % ideas.length)} className="w-8 h-8 rounded-full bg-[#1b222c] hover:bg-primary/20 text-slate-400 hover:text-primary-light flex items-center justify-center transition-all">
                  <HiOutlineChevronLeft />
                </button>
                <button onClick={() => setIdea((i) => (i + 1) % ideas.length)} className="w-8 h-8 rounded-full bg-[#1b222c] hover:bg-primary/20 text-slate-400 hover:text-primary-light flex items-center justify-center transition-all">
                  <HiOutlineChevronRight />
                </button>
              </div>
            </div>
            <div key={idea} className="animate-fade-in">
              <h4 className="text-lg font-bold text-white leading-snug">{ideas[idea].title}</h4>
              <p className="text-sm text-slate-400 mt-2">{ideas[idea].body}</p>
              <Link href="/ai-assistant" className="inline-block mt-4 px-4 py-2 rounded-lg border border-[#232b36] text-sm font-semibold text-white hover:border-primary hover:text-primary-light transition-all">
                Read Now
              </Link>
            </div>
          </Card>
        </div>

        {/* Analysis Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 animate-fade-in-up pt-2">
          <div>
            <p className="text-xs font-bold text-primary-light uppercase tracking-widest mb-2">Business Analytics</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">{data.businessName}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">{data.industry} &bull; Analyzed {analyzedDate}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/upload" className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
              <HiOutlineUpload className="text-sm" />
              <span className="hidden sm:inline">New Analysis</span>
              <span className="sm:hidden">New</span>
            </Link>
            <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-900/20 border border-red-800/30 text-xs sm:text-sm font-medium text-red-400 hover:bg-red-900/30 transition-all">
              <HiOutlineTrash className="text-sm" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger">
          <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-4 sm:p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><HiOutlineCurrencyDollar className="text-primary-light text-lg" /></div>
              <HiOutlineTrendingUp className="text-primary-light text-lg" />
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1">Monthly Revenue</p>
            <p className="text-xl sm:text-2xl font-extrabold text-white">{formatCurrency(data.monthlyRevenue)}</p>
          </div>

          <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-4 sm:p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center"><HiOutlineExclamationCircle className="text-red-400 text-lg" /></div>
              <HiOutlineTrendingDown className="text-red-400 text-lg" />
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1">Monthly Expenses</p>
            <p className="text-xl sm:text-2xl font-extrabold text-white">{formatCurrency(data.monthlyExpenses)}</p>
          </div>

          <div className={`bg-[#141a22] rounded-2xl border ${isProfit ? "border-primary/30" : "border-red-800/30"} p-4 sm:p-5 card-hover`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${isProfit ? "bg-primary/10" : "bg-red-500/10"} flex items-center justify-center`}>
                {isProfit ? <HiOutlineArrowTrendingUp className="text-primary-light text-lg" /> : <HiOutlineArrowTrendingDown className="text-red-400 text-lg" />}
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isProfit ? "bg-primary/15 text-primary-light" : "bg-red-900/30 text-red-400"}`}>{isProfit ? "PROFIT" : "LOSS"}</span>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1">Monthly {isProfit ? "Profit" : "Loss"}</p>
            <p className={`text-xl sm:text-2xl font-extrabold ${isProfit ? "text-primary-light" : "text-red-400"}`}>{isProfit ? "+" : "-"}{formatCurrency(Math.abs(profit))}</p>
            <p className="text-[10px] text-slate-500 mt-1">{profitMargin.toFixed(1)}% margin</p>
          </div>

          <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-4 sm:p-5 card-hover">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center"><HiOutlineUserGroup className="text-sky-400 text-lg" /></div>
            </div>
            <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mb-1">Customers</p>
            <p className="text-xl sm:text-2xl font-extrabold text-white">{data.numberOfCustomers > 0 ? data.numberOfCustomers.toLocaleString() : "N/A"}</p>
            {data.numberOfCustomers > 0 && data.monthlyRevenue > 0 && (
              <p className="text-[10px] text-slate-500 mt-1">{formatCurrency(data.monthlyRevenue / data.numberOfCustomers)}/customer</p>
            )}
          </div>
        </div>

        {/* Revenue vs Expenses Breakdown + Health Score */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in-up">
          <div className="lg:col-span-2 bg-[#141a22] rounded-2xl border border-[#1b222c] p-4 sm:p-6">
            <h3 className="text-sm font-bold text-white mb-5">Revenue vs Expenses Breakdown</h3>
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Revenue</span>
                  <span className="text-sm font-bold text-primary-light">{formatCurrency(data.monthlyRevenue)}</span>
                </div>
                <div className="h-4 bg-[#0b0e13] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-primary-light rounded-full transition-all duration-1000" style={{ width: "100%" }} /></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">Expenses</span>
                  <span className="text-sm font-bold text-red-400">{formatCurrency(data.monthlyExpenses)}</span>
                </div>
                <div className="h-4 bg-[#0b0e13] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-red-500 to-rose-400 rounded-full transition-all duration-1000" style={{ width: data.monthlyRevenue > 0 ? `${(data.monthlyExpenses / data.monthlyRevenue) * 100}%` : "100%" }} /></div>
              </div>
              {data.marketingBudget > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-slate-400">Marketing Budget</span>
                    <span className="text-sm font-bold text-amber-400">{formatCurrency(data.marketingBudget)}</span>
                  </div>
                  <div className="h-4 bg-[#0b0e13] rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-1000" style={{ width: data.monthlyRevenue > 0 ? `${(data.marketingBudget / data.monthlyRevenue) * 100}%` : "50%" }} /></div>
                </div>
              )}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-slate-400">{isProfit ? "Net Profit" : "Net Loss"}</span>
                  <span className={`text-sm font-bold ${isProfit ? "text-primary-light" : "text-red-400"}`}>{isProfit ? "+" : "-"}{formatCurrency(Math.abs(profit))}</span>
                </div>
                <div className="h-4 bg-[#0b0e13] rounded-full overflow-hidden"><div className={`h-full bg-gradient-to-r ${isProfit ? "from-primary to-primary-light" : "from-red-600 to-red-400"} rounded-full transition-all duration-1000`} style={{ width: data.monthlyRevenue > 0 ? `${Math.min(100, (Math.abs(profit) / data.monthlyRevenue) * 100)}%` : "0%" }} /></div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-[#232b36] grid grid-cols-3 gap-4 text-center">
              <div><p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Industry</p><p className="text-xs font-bold text-white">{data.industry}</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Business Age</p><p className="text-xs font-bold text-white">{data.businessAge}</p></div>
              <div><p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Country</p><p className="text-xs font-bold text-white">{data.country}</p></div>
            </div>
          </div>

          <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-4 sm:p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><HiOutlineShieldCheck className="text-primary-light text-lg" /></div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Health Score</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center py-4">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#232b36" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="url(#healthGradient)" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${healthScore * 2.64} 264`} />
                  <defs>
                    <linearGradient id="healthGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={healthScore >= 50 ? "#00a76f" : "#EF4444"} />
                      <stop offset="100%" stopColor={healthScore >= 50 ? "#1fc98a" : "#F87171"} />
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
            <div className="space-y-3 pt-4 border-t border-[#232b36]">
              <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Profit Margin</span><span className={`text-xs font-bold ${isProfit ? "text-primary-light" : "text-red-400"}`}>{profitMargin.toFixed(1)}%</span></div>
              <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Expense Ratio</span><span className="text-xs font-bold text-white">{data.monthlyRevenue > 0 ? ((data.monthlyExpenses / data.monthlyRevenue) * 100).toFixed(1) : 0}%</span></div>
              {data.marketingBudget > 0 && (
                <div className="flex items-center justify-between"><span className="text-xs text-slate-400">Marketing %</span><span className="text-xs font-bold text-amber-400">{data.monthlyRevenue > 0 ? ((data.marketingBudget / data.monthlyRevenue) * 100).toFixed(1) : 0}%</span></div>
              )}
            </div>
          </div>
        </div>

        {/* ===== Rich showcase widgets ===== */}
        <div className="pt-2">
          <h2 className="text-lg font-bold text-white mb-1">Performance Overview</h2>
          <p className="text-xs text-slate-500 mb-4">Sample analytics widgets to visualize sales, orders and trends.</p>
        </div>

        {/* Revenue trend + Product Sales */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-2 p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-5">Revenue Trend</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl bg-[#0f141b] border border-[#1b222c] p-4">
                <div className="flex items-center gap-2 text-sm text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Total Income</div>
                <p className="text-2xl font-bold text-white mt-2">{formatCurrency(data.monthlyRevenue)}</p>
              </div>
              <div className="rounded-xl bg-[#0f141b] border border-[#1b222c] p-4">
                <div className="flex items-center gap-2 text-sm text-slate-400"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Total Expenses</div>
                <p className="text-2xl font-bold text-white mt-2">{formatCurrency(data.monthlyExpenses)}</p>
              </div>
            </div>
            <AreaChart />
          </Card>

          <Card className="p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-2">Product Sales</h3>
            <div className="flex justify-center my-4">
              <Donut segments={productSales.map((p) => ({ value: p.value, color: p.color }))} />
            </div>
            <div className="space-y-3">
              {productSales.map((p) => (
                <div key={p.name} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-300"><span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />{p.name}</span>
                  <span className="text-slate-400"><span className="text-white font-medium">{p.amount}</span> {p.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Orders + Revenue by Location */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-2 p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-[#1b222c]">
                    <th className="py-3 font-medium">Order ID</th>
                    <th className="py-3 font-medium">Amount</th>
                    <th className="py-3 font-medium hidden sm:table-cell">Shipping</th>
                    <th className="py-3 font-medium hidden md:table-cell">Delivery Date</th>
                    <th className="py-3 font-medium">Status</th>
                    <th className="py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o, i) => (
                    <tr key={i} className="border-b border-[#1b222c]/60 hover:bg-[#0f141b] transition-colors">
                      <td className="py-3 text-slate-200">{o.id}</td>
                      <td className="py-3 text-slate-300">{o.amount}</td>
                      <td className="py-3 text-slate-400 hidden sm:table-cell">{o.method}</td>
                      <td className="py-3 text-slate-400 hidden md:table-cell">{o.date}</td>
                      <td className="py-3"><span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusStyle[o.status]}`}>{o.status}</span></td>
                      <td className="py-3 text-right"><button className="px-3 py-1 rounded-md border border-[#232b36] text-xs text-slate-300 hover:border-primary hover:text-primary-light transition-all">View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-4">Revenue by Location</h3>
            <div className="h-32 rounded-xl mb-5 opacity-70" style={{ backgroundImage: "radial-gradient(circle, #2a3a44 1.4px, transparent 1.6px)", backgroundSize: "12px 12px", maskImage: "radial-gradient(120% 90% at 50% 40%, #000 40%, transparent 75%)", WebkitMaskImage: "radial-gradient(120% 90% at 50% 40%, #000 40%, transparent 75%)" }} />
            <div className="space-y-4">
              {locations.map((l) => (
                <div key={l.country}>
                  <div className="flex items-center justify-between text-sm mb-1.5"><span className="text-slate-300">{l.country}</span><span className="text-white font-medium">{l.amount}</span></div>
                  <div className="h-1.5 rounded-full bg-[#1b222c] overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${l.pct}%`, background: l.color }} /></div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sales by Gender + Top Selling Products */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-2">Sales by Gender</h3>
            <div className="flex justify-center my-6">
              <Donut segments={[{ value: 45, color: "#00a76f" }, { value: 35, color: "#f5a524" }, { value: 20, color: "#f87171" }]} size={190} thickness={16} />
            </div>
            <div className="flex items-center justify-center gap-5 text-sm">
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-primary" />Mens</span>
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />Womens</span>
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-red-400" />Kids</span>
            </div>
          </Card>

          <Card className="xl:col-span-2 p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-4">Top Selling Products</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-[#1b222c]">
                    <th className="py-3 font-medium">Product</th>
                    <th className="py-3 font-medium">Sale</th>
                    <th className="py-3 font-medium hidden sm:table-cell">Revenue</th>
                    <th className="py-3 font-medium hidden md:table-cell">Rating</th>
                    <th className="py-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((p, i) => (
                    <tr key={i} className="border-b border-[#1b222c]/60 hover:bg-[#0f141b] transition-colors">
                      <td className="py-3"><div className="flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-[#1b222c]" /><span className="text-slate-200">{p.name}</span></div></td>
                      <td className="py-3 text-slate-300">{p.sale}</td>
                      <td className="py-3 text-slate-400 hidden sm:table-cell">{p.revenue}</td>
                      <td className="py-3 text-amber-400 hidden md:table-cell">★ {p.rating}</td>
                      <td className="py-3"><span className={`px-2.5 py-1 rounded-md text-xs font-medium ${stockStyle[p.status]}`}>{p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 animate-fade-in-up">
          <Link href="/ai-assistant" className="group">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl border border-primary/30 p-5 hover:border-primary transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center mb-3"><HiOutlineLightningBolt className="text-primary-light text-lg" /></div>
              <h3 className="text-sm font-bold text-white mb-1">AI Growth Suggestions</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">Ask AI for personalized strategies to {isProfit ? "increase your profit" : "reduce losses"} and grow your business.</p>
              <span className="text-xs font-semibold text-primary-light flex items-center gap-1 group-hover:gap-2 transition-all">Get Suggestions <HiOutlineArrowRight /></span>
            </div>
          </Link>

          <Link href="/reports" className="group">
            <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-5 hover:border-primary transition-all h-full">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3"><HiOutlineDocumentChartBar className="text-primary-light text-lg" /></div>
              <h3 className="text-sm font-bold text-white mb-1">View Full Report</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-3">Read the complete AI analysis report with competition, market insights and recommendations.</p>
              <span className="text-xs font-semibold text-primary-light flex items-center gap-1 group-hover:gap-2 transition-all">Open Report <HiOutlineArrowRight /></span>
            </div>
          </Link>

          <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3"><HiOutlineBuildingOffice2 className="text-amber-400 text-lg" /></div>
            <h3 className="text-sm font-bold text-white mb-3">Business Details</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500">Industry</span><span className="text-[10px] font-semibold text-slate-300">{data.industry}</span></div>
              <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500">Location</span><span className="text-[10px] font-semibold text-slate-300">{data.country}</span></div>
              <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500">Age</span><span className="text-[10px] font-semibold text-slate-300">{data.businessAge}</span></div>
              <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500">Source</span><span className="text-[10px] font-semibold text-slate-300">{data.hasPdf ? "PDF + Form" : "Manual Entry"}</span></div>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-[#141a22] rounded-2xl border border-[#232b36] p-6 max-w-sm w-full animate-scale-in">
              <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4"><HiOutlineTrash className="text-red-400 text-xl" /></div>
              <h3 className="text-lg font-bold text-white text-center mb-2">Delete Analysis?</h3>
              <p className="text-sm text-slate-400 text-center mb-6">This will remove all your business analysis data and dashboard metrics. You&apos;ll need to upload again to see data.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-[#232b36] text-sm font-medium text-slate-300 hover:bg-[#232b36] transition-all">Cancel</button>
                <button onClick={clearAnalysis} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700 transition-all">Yes, Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
