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
  HiOutlineExclamationCircle,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineSparkles,
  HiOutlineGlobe,
} from "react-icons/hi";
import {
  HiOutlineChatBubbleLeftRight,
  HiOutlineDocumentChartBar,
  HiOutlineBuildingOffice2,
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
} from "react-icons/hi2";

/* ---------- types ---------- */

interface Widgets {
  monthlyTrend: { label: string; income: number; expenses: number }[];
  productSales: { name: string; amount: number; percent: number }[];
  recentOrders: { id: string; amount: string; method: string; date: string; status: string }[];
  revenueByLocation: { country: string; amount: number }[];
  salesByGender: { mens: number; womens: number; kids: number };
  topProducts: { name: string; sales: number; revenue: string; rating: string; status: string }[];
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
  widgets?: Widgets;
}

const EMPTY_WIDGETS: Widgets = {
  monthlyTrend: [],
  productSales: [],
  recentOrders: [],
  revenueByLocation: [],
  salesByGender: { mens: 0, womens: 0, kids: 0 },
  topProducts: [],
};

const DONUT_COLORS = ["#00a76f", "#f5a524", "#38bdf8", "#f87171", "#a78bfa", "#34d399", "#fb923c", "#22d3ee"];
const orderStatus: Record<string, string> = {
  Shipped: "bg-sky-500/15 text-sky-400",
  Pending: "bg-amber-500/15 text-amber-400",
  Cancel: "bg-red-500/15 text-red-400",
  Completed: "bg-primary/15 text-primary-light",
};
const stockStatus: Record<string, string> = {
  "In Stock": "bg-sky-500/15 text-sky-400",
  "Low Stock": "bg-amber-500/15 text-amber-400",
  "Out of Stock": "bg-red-500/15 text-red-400",
};

/* ---------- inline chart helpers (no deps) ---------- */

function Sparkline({ color, points, className = "" }: { color: string; points: number[]; className?: string }) {
  const w = 120;
  const h = 38;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min || 1;
  const stepX = w / (points.length - 1);
  const coords = points.map((v, i) => [i * stepX, h - ((v - min) / range) * (h - 6) - 3]);
  const line = coords.map((c, i) => `${i === 0 ? "M" : "L"} ${c[0]},${c[1]}`).join(" ");
  const area = `${line} L ${w},${h} L 0,${h} Z`;
  const id = `spark-${color.replace("#", "")}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={`w-full h-9 ${className}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.32" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
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
      {total > 0 &&
        segments.map((s, i) => {
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

/** Multi-line income vs expenses trend (real, moving lines). */
function TrendChart({ data }: { data: { label: string; income: number; expenses: number }[] }) {
  const w = 760;
  const h = 220;
  const max = Math.max(...data.flatMap((d) => [d.income, d.expenses]), 1);
  const stepX = data.length > 1 ? w / (data.length - 1) : w;
  const coordsOf = (key: "income" | "expenses") =>
    data.map((d, i) => [i * stepX, h - (d[key] / max) * (h - 16) - 8]);
  const incomeC = coordsOf("income");
  const expC = coordsOf("expenses");
  const toPath = (c: number[][]) => c.map((p, i) => `${i === 0 ? "M" : "L"} ${p[0]},${p[1]}`).join(" ");
  const incomeArea = `${toPath(incomeC)} L ${w},${h} L 0,${h} Z`;

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-3 text-xs">
        <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-primary" /> Income</span>
        <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Expenses</span>
      </div>
      <svg viewBox={`0 0 ${w} ${h + 26}`} className="w-full h-[230px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00a76f" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#00a76f" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 0.25, 0.5, 0.75, 1].map((g) => (
          <line key={g} x1="0" y1={h * g} x2={w} y2={h * g} stroke="#1b222c" strokeDasharray="4 6" />
        ))}
        <path d={incomeArea} fill="url(#trendFill)" />
        <path d={toPath(incomeC)} fill="none" stroke="#00a76f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="animate-draw-line" />
        <path d={toPath(expC)} fill="none" stroke="#f87171" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {incomeC.map((p, i) => (
          <circle key={`i${i}`} cx={p[0]} cy={p[1]} r="4" fill="#0b0e13" stroke="#00a76f" strokeWidth="2.5" />
        ))}
        {data.map((d, i) => (
          <text key={d.label + i} x={i * stepX} y={h + 18} fill="#64748b" fontSize="12" textAnchor={i === 0 ? "start" : i === data.length - 1 ? "end" : "middle"}>
            {d.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

const ideas = [
  { title: "Create a Blog Post for your product", body: "Generate SEO-ready blog content from your business data in seconds with AI." },
  { title: "Summarize your latest report", body: "Turn a long PDF into a one-paragraph executive summary instantly." },
  { title: "Draft a sales email campaign", body: "Personalized outreach emails based on your business and customers." },
];

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl bg-[#141a22] border border-[#1b222c] ${className}`}>{children}</div>;
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
        return;
      } catch {
        // fall through to DB fetch
      }
    }
    // Fallback: load the latest saved analysis from the backend so the
    // dashboard survives even if local storage was cleared.
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("/api/analyses", { headers: { Authorization: `Bearer ${token}` } });
        const d = await res.json();
        if (res.ok && d.analyses?.length) {
          const a = d.analyses[0];
          setData({
            businessName: a.businessName,
            industry: a.industry,
            monthlyRevenue: a.monthlyRevenue,
            monthlyExpenses: a.monthlyExpenses,
            marketingBudget: a.marketingBudget,
            numberOfCustomers: a.numberOfCustomers,
            businessAge: a.businessAge,
            country: a.country,
            report: a.report,
            analyzedAt: a.createdAt,
            hasPdf: a.hasPdf,
            pdfName: a.pdfName,
            widgets: a.widgets,
          });
          localStorage.setItem("activeAnalysisId", String(a._id));
        }
      } catch {
        // ignore
      }
    })();
  }, []);

  const clearAnalysis = async () => {
    // Also delete the saved analysis from the backend if we know its id.
    const id = localStorage.getItem("activeAnalysisId");
    if (id) {
      try {
        const token = localStorage.getItem("token");
        await fetch(`/api/analyses/${id}`, {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
      } catch {
        // ignore
      }
      localStorage.removeItem("activeAnalysisId");
    }
    localStorage.removeItem("analysisData");
    localStorage.removeItem("analysisReport");
    localStorage.removeItem("analysisBusinessName");
    setData(null);
    setShowDeleteConfirm(false);
  };

  const profit = data ? data.monthlyRevenue - data.monthlyExpenses : 0;
  const profitMargin = data && data.monthlyRevenue > 0 ? (profit / data.monthlyRevenue) * 100 : 0;
  const isProfit = profit >= 0;

  const formatCurrency = (n: number) => {
    if (!n) return "$0";
    if (Math.abs(n) >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
    if (Math.abs(n) >= 1000) return `$${(n / 1000).toFixed(1)}K`;
    return `$${n.toLocaleString()}`;
  };

  const analyzedDate = data ? new Date(data.analyzedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";

  // Empty state
  if (!data) {
    return (
      <DashboardLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 animate-fade-in-up">
            <p className="text-xs font-bold text-primary-light uppercase tracking-widest mb-2">Dashboard</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">Welcome, {firstName}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">Upload your business data to unlock AI-powered analytics</p>
          </div>
          <div className="relative overflow-hidden bg-[#141a22] rounded-2xl border border-[#1b222c] p-8 sm:p-12 text-center mb-4 animate-fade-in-up bg-grid">
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
                <HiOutlineUpload className="text-lg" /> Upload &amp; Analyze Your Business <HiOutlineArrowRight />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 stagger">
            <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-5 card-hover">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3"><HiOutlineCurrencyDollar className="text-primary-light text-lg" /></div>
              <h3 className="text-sm font-bold text-white mb-1">Profit &amp; Loss</h3>
              <p className="text-xs text-slate-400 leading-relaxed">See your real profit margins, revenue breakdown and expense analysis.</p>
            </div>
            <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-5 card-hover">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3"><HiOutlineLightningBolt className="text-amber-400 text-lg" /></div>
              <h3 className="text-sm font-bold text-white mb-1">AI Insights</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Get competition analysis, market value, and growth strategies from AI.</p>
            </div>
            <div className="bg-[#141a22] rounded-2xl border border-[#1b222c] p-5 card-hover">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 flex items-center justify-center mb-3"><HiOutlineChatBubbleLeftRight className="text-sky-400 text-lg" /></div>
              <h3 className="text-sm font-bold text-white mb-1">AI Suggestions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">Ask AI for personalized tips to grow your business and increase profit.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const w: Widgets = data.widgets || EMPTY_WIDGETS;
  const genderTotal = w.salesByGender.mens + w.salesByGender.womens + w.salesByGender.kids;
  const productTotal = w.productSales.reduce((s, p) => s + p.amount, 0);
  const locMax = Math.max(...w.revenueByLocation.map((l) => l.amount), 1);

  // Zero / placeholder fallbacks so widgets always render (no "not found" text)
  const zeroTrend = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((label) => ({ label, income: 0, expenses: 0 }));
  const placeholderOrders = Array.from({ length: 3 }).map(() => ({ id: "—", amount: "$0", method: "—", date: "—", status: "—" }));
  const placeholderProducts = Array.from({ length: 3 }).map(() => ({ name: "—", sales: 0, revenue: "$0", rating: "—", status: "—" }));
  const ordersToShow = w.recentOrders.length ? w.recentOrders : placeholderOrders;
  const productsToShow = w.topProducts.length ? w.topProducts : placeholderProducts;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Greeting + Ideas */}
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
                <button onClick={() => setIdea((i) => (i - 1 + ideas.length) % ideas.length)} className="w-8 h-8 rounded-full bg-[#1b222c] hover:bg-primary/20 text-slate-400 hover:text-primary-light flex items-center justify-center transition-all"><HiOutlineChevronLeft /></button>
                <button onClick={() => setIdea((i) => (i + 1) % ideas.length)} className="w-8 h-8 rounded-full bg-[#1b222c] hover:bg-primary/20 text-slate-400 hover:text-primary-light flex items-center justify-center transition-all"><HiOutlineChevronRight /></button>
              </div>
            </div>
            <div key={idea} className="animate-fade-in">
              <h4 className="text-lg font-bold text-white leading-snug">{ideas[idea].title}</h4>
              <p className="text-sm text-slate-400 mt-2">{ideas[idea].body}</p>
              <Link href="/ai-assistant" className="inline-block mt-4 px-4 py-2 rounded-lg border border-[#232b36] text-sm font-semibold text-white hover:border-primary hover:text-primary-light transition-all">Read Now</Link>
            </div>
          </Card>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 animate-fade-in-up pt-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-primary-light uppercase tracking-widest mb-2">Business Analytics</p>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white break-words line-clamp-2" title={data.businessName}>{data.businessName}</h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 truncate">{data.industry} &bull; Analyzed {analyzedDate}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link href="/upload" className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
              <HiOutlineUpload className="text-sm" /><span className="hidden sm:inline">New Analysis</span><span className="sm:hidden">New</span>
            </Link>
            <button onClick={() => setShowDeleteConfirm(true)} className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-900/20 border border-red-800/30 text-xs sm:text-sm font-medium text-red-400 hover:bg-red-900/30 transition-all">
              <HiOutlineTrash className="text-sm" /><span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        </div>

        {/* Metric cards (real) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 stagger">
          <div className="relative overflow-hidden rounded-2xl border border-[#1b222c] bg-gradient-to-br from-primary/10 via-[#141a22] to-[#141a22] p-5 card-hover">
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-primary/15 flex items-center justify-center"><HiOutlineCurrencyDollar className="text-primary-light text-xl" /></div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-primary-light bg-primary/10 px-2 py-1 rounded-full"><HiOutlineTrendingUp /> Revenue</span>
              </div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Monthly Revenue</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white animate-count">{formatCurrency(data.monthlyRevenue)}</p>
              <Sparkline color="#00a76f" points={data.monthlyRevenue > 0 ? [8, 12, 9, 15, 13, 18, 22] : [0, 0, 0, 0, 0, 0, 0]} className="mt-3" />
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-[#1b222c] bg-gradient-to-br from-red-500/10 via-[#141a22] to-[#141a22] p-5 card-hover">
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-red-500/15 flex items-center justify-center"><HiOutlineExclamationCircle className="text-red-400 text-xl" /></div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded-full"><HiOutlineTrendingDown /> Expenses</span>
              </div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Monthly Expenses</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white animate-count">{formatCurrency(data.monthlyExpenses)}</p>
              <Sparkline color="#f87171" points={data.monthlyExpenses > 0 ? [18, 14, 16, 12, 15, 11, 9] : [0, 0, 0, 0, 0, 0, 0]} className="mt-3" />
            </div>
          </div>
          <div className={`relative overflow-hidden rounded-2xl border ${isProfit ? "border-primary/30" : "border-red-800/40"} bg-gradient-to-br ${isProfit ? "from-primary/15" : "from-red-500/15"} via-[#141a22] to-[#141a22] p-5 card-hover`}>
            <div className={`absolute -right-8 -top-8 w-28 h-28 ${isProfit ? "bg-primary/15" : "bg-red-500/15"} rounded-full blur-2xl pointer-events-none`} />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-11 h-11 rounded-xl ${isProfit ? "bg-primary/15" : "bg-red-500/15"} flex items-center justify-center`}>{isProfit ? <HiOutlineArrowTrendingUp className="text-primary-light text-xl" /> : <HiOutlineArrowTrendingDown className="text-red-400 text-xl" />}</div>
                <span className={`text-[11px] font-bold px-2 py-1 rounded-full ${isProfit ? "bg-primary/15 text-primary-light" : "bg-red-900/30 text-red-400"}`}>{isProfit ? "PROFIT" : "LOSS"}</span>
              </div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Monthly {isProfit ? "Profit" : "Loss"}</p>
              <p className={`text-2xl sm:text-3xl font-extrabold animate-count ${isProfit ? "text-primary-light" : "text-red-400"}`}>{isProfit ? "+" : "-"}{formatCurrency(Math.abs(profit))}</p>
              <div className="mt-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-[#0b0e13] overflow-hidden"><div className={`h-full rounded-full ${isProfit ? "bg-gradient-to-r from-primary to-primary-light" : "bg-gradient-to-r from-red-600 to-red-400"}`} style={{ width: `${Math.min(100, Math.abs(profitMargin))}%` }} /></div>
                <span className="text-[11px] text-slate-400">{profitMargin.toFixed(1)}%</span>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-[#1b222c] bg-gradient-to-br from-sky-500/10 via-[#141a22] to-[#141a22] p-5 card-hover">
            <div className="absolute -right-8 -top-8 w-28 h-28 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-sky-500/15 flex items-center justify-center"><HiOutlineUserGroup className="text-sky-400 text-xl" /></div>
                <span className="text-[11px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-1 rounded-full">Total</span>
              </div>
              <p className="text-[11px] text-slate-400 uppercase tracking-wider mb-1">Customers</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-white animate-count">{data.numberOfCustomers > 0 ? data.numberOfCustomers.toLocaleString() : "N/A"}</p>
              {data.numberOfCustomers > 0 && data.monthlyRevenue > 0 ? (
                <p className="text-[11px] text-slate-500 mt-3">{formatCurrency(data.monthlyRevenue / data.numberOfCustomers)} / customer</p>
              ) : (
                <Sparkline color="#38bdf8" points={data.numberOfCustomers > 0 ? [10, 12, 11, 14, 13, 16, 15] : [0, 0, 0, 0, 0, 0, 0]} className="mt-3" />
              )}
            </div>
          </div>
        </div>

        <div className="pt-2">
          <h2 className="text-lg font-bold text-white mb-1">Performance Overview</h2>
          <p className="text-xs text-slate-500 mb-4">Extracted from your analyzed data. Sections with no data stay empty.</p>
        </div>

        {/* Income vs Expenses trend + Product Sales */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-2 p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-2">Income vs Expenses</h3>
            <TrendChart data={w.monthlyTrend.length > 1 ? w.monthlyTrend : zeroTrend} />
          </Card>

          <Card className="p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-2">Product Sales</h3>
            <div className="relative flex justify-center my-4">
              <Donut segments={w.productSales.length ? w.productSales.map((p, i) => ({ value: p.amount || p.percent || 1, color: DONUT_COLORS[i % DONUT_COLORS.length] })) : []} />
              {!w.productSales.length && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-500">$0</span>
                </div>
              )}
            </div>
            <div className="space-y-3">
              {(w.productSales.length ? w.productSales : [{ name: "—", amount: 0, percent: 0 }, { name: "—", amount: 0, percent: 0 }]).map((p, i) => (
                <div key={p.name + i} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-slate-300"><span className="w-2.5 h-2.5 rounded-full" style={{ background: w.productSales.length ? DONUT_COLORS[i % DONUT_COLORS.length] : "#232b36" }} />{p.name}</span>
                  <span className="text-slate-400"><span className="text-white font-medium">{formatCurrency(p.amount)}</span>{productTotal > 0 ? ` ${Math.round((p.amount / productTotal) * 100)}%` : " 0%"}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Recent Orders + Revenue by Location */}
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
                  </tr>
                </thead>
                <tbody>
                  {ordersToShow.map((o, i) => (
                    <tr key={i} className="border-b border-[#1b222c]/60 hover:bg-[#0f141b] transition-colors">
                      <td className="py-3 text-slate-200">{o.id}</td>
                      <td className="py-3 text-slate-300">{o.amount}</td>
                      <td className="py-3 text-slate-400 hidden sm:table-cell">{o.method}</td>
                      <td className="py-3 text-slate-400 hidden md:table-cell">{o.date}</td>
                      <td className="py-3"><span className={`px-2.5 py-1 rounded-md text-xs font-medium ${orderStatus[o.status] || "bg-[#1b222c] text-slate-500"}`}>{o.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-4">Revenue by Location</h3>
            <div className="h-24 rounded-xl mb-5 opacity-70" style={{ backgroundImage: "radial-gradient(circle, #2a3a44 1.4px, transparent 1.6px)", backgroundSize: "12px 12px", maskImage: "radial-gradient(120% 90% at 50% 40%, #000 40%, transparent 75%)", WebkitMaskImage: "radial-gradient(120% 90% at 50% 40%, #000 40%, transparent 75%)" }} />
            {w.revenueByLocation.length ? (
              <div className="space-y-4">
                {w.revenueByLocation.map((l, i) => (
                  <div key={l.country + i}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="flex items-center gap-2 text-slate-300"><HiOutlineGlobe className="text-primary-light" /> {l.country}</span>
                      <span className="text-white font-medium">{formatCurrency(l.amount)}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-[#1b222c] overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: `${(l.amount / locMax) * 100}%` }} /></div>
                  </div>
                ))}
              </div>
            ) : data.country ? (
              <div>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="flex items-center gap-2 text-slate-300"><HiOutlineGlobe className="text-primary-light" /> {data.country}</span>
                  <span className="text-white font-medium">{formatCurrency(data.monthlyRevenue)}</span>
                </div>
                <div className="h-1.5 rounded-full bg-[#1b222c] overflow-hidden"><div className="h-full rounded-full bg-primary" style={{ width: data.monthlyRevenue > 0 ? "100%" : "0%" }} /></div>
              </div>
            ) : (
              <p className="text-center text-xs text-slate-500 py-2">No location data available.</p>
            )}
          </Card>
        </div>

        {/* Sales by Gender + Top Selling Products */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-2">Sales by Gender</h3>
            <div className="flex justify-center my-6">
              <Donut segments={genderTotal > 0 ? [{ value: w.salesByGender.mens, color: "#00a76f" }, { value: w.salesByGender.womens, color: "#f5a524" }, { value: w.salesByGender.kids, color: "#f87171" }] : []} size={190} thickness={16} />
            </div>
            <div className="flex items-center justify-center gap-5 text-sm">
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-primary" />Mens {genderTotal > 0 ? Math.round((w.salesByGender.mens / genderTotal) * 100) : 0}%</span>
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-amber-400" />Womens {genderTotal > 0 ? Math.round((w.salesByGender.womens / genderTotal) * 100) : 0}%</span>
              <span className="flex items-center gap-1.5 text-slate-300"><span className="w-2.5 h-2.5 rounded-full bg-red-400" />Kids {genderTotal > 0 ? Math.round((w.salesByGender.kids / genderTotal) * 100) : 0}%</span>
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
                  {productsToShow.map((p, i) => (
                    <tr key={i} className="border-b border-[#1b222c]/60 hover:bg-[#0f141b] transition-colors">
                      <td className="py-3"><div className="flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-[#1b222c]" /><span className="text-slate-200">{p.name}</span></div></td>
                      <td className="py-3 text-slate-300">{p.sales}</td>
                      <td className="py-3 text-slate-400 hidden sm:table-cell">{p.revenue}</td>
                      <td className="py-3 text-amber-400 hidden md:table-cell">{p.rating === "—" ? "—" : `★ ${p.rating}`}</td>
                      <td className="py-3"><span className={`px-2.5 py-1 rounded-md text-xs font-medium ${stockStatus[p.status] || "bg-[#1b222c] text-slate-500"}`}>{p.status}</span></td>
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
              <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500">Industry</span><span className="text-[10px] font-semibold text-slate-300">{data.industry || "N/A"}</span></div>
              <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500">Location</span><span className="text-[10px] font-semibold text-slate-300">{data.country || "N/A"}</span></div>
              <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500">Age</span><span className="text-[10px] font-semibold text-slate-300">{data.businessAge || "N/A"}</span></div>
              <div className="flex items-center justify-between"><span className="text-[10px] text-slate-500">Source</span><span className="text-[10px] font-semibold text-slate-300">{data.hasPdf ? "PDF + Form" : "Manual Entry"}</span></div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
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
