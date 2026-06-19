"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useAuth } from "@/lib/AuthContext";
import {
  HiOutlineShoppingCart,
  HiOutlineCurrencyDollar,
  HiOutlineUserCircle,
  HiOutlineArrowSmUp,
  HiOutlineArrowSmDown,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiOutlineSparkles,
} from "react-icons/hi";

/* ---------- tiny inline chart helpers (no deps) ---------- */

function AreaChart() {
  // monthly revenue points (Jan..Jul) normalized into a 760x230 viewbox
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
      <svg viewBox={`0 0 ${w} ${h + 28}`} className="w-full h-[230px]" preserveAspectRatio="none">
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
        <path
          d={line}
          fill="none"
          stroke="#00a76f"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw-line"
        />
        {coords.map((c, i) => (
          <circle key={i} cx={c[0]} cy={c[1]} r="5" fill="#0b0e13" stroke="#00a76f" strokeWidth="3" />
        ))}
        {months.map((m, i) => (
          <text
            key={m}
            x={i * stepX}
            y={h + 20}
            fill="#64748b"
            fontSize="12"
            textAnchor={i === 0 ? "start" : i === months.length - 1 ? "end" : "middle"}
          >
            {m}
          </text>
        ))}
      </svg>
    </div>
  );
}

function Donut({
  segments,
  size = 200,
  thickness = 26,
}: {
  segments: { value: number; color: string }[];
  size?: number;
  thickness?: number;
}) {
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
          <circle
            key={i}
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={thickness}
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
          />
        );
        offset += len;
        return el;
      })}
    </svg>
  );
}

/* ---------- data ---------- */

const stats = [
  { label: "Documents Analyzed", value: "5,312", change: "+2.29%", up: true, icon: HiOutlineShoppingCart, tint: "from-amber-500/20 text-amber-400" },
  { label: "Revenue", value: "$120,000", change: "+2.19%", up: true, icon: HiOutlineCurrencyDollar, tint: "from-primary/20 text-primary-light" },
  { label: "Conversion Rate", value: "3.5%", change: "-3.19%", up: false, icon: HiOutlineUserCircle, tint: "from-sky-500/20 text-sky-400" },
];

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

export default function DashboardPage() {
  const { user } = useAuth();
  const [idea, setIdea] = useState(0);
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5 max-w-[1500px] mx-auto">
        {/* Top: greeting + ideas */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
          <div className="xl:col-span-2 relative overflow-hidden rounded-2xl p-6 sm:p-8 animate-fade-in-up">
            <div className="absolute inset-0 animate-gradient bg-[linear-gradient(110deg,#b91c1c_0%,#7c3a2d_38%,#1d6b54_70%,#00a76f_100%)]" />
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-2">
                <span className="animate-float inline-block">👋</span> Hello {firstName},
              </h2>
              <p className="text-white/80 text-sm mt-2 max-w-md">
                Welcome to your AI Business Dashboard! Monitor your performance, track your progress,
                and gain valuable insights.
              </p>
              <Link
                href="/ai-assistant"
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl bg-white text-[#0b0e13] text-sm font-semibold hover:bg-white/90 transition-all"
              >
                <HiOutlineSparkles className="text-lg text-primary" /> Start AI
              </Link>
            </div>
          </div>

          <Card className="p-5 sm:p-6 animate-fade-in-up">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">Ideas for You</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setIdea((i) => (i - 1 + ideas.length) % ideas.length)}
                  className="w-8 h-8 rounded-full bg-[#1b222c] hover:bg-primary/20 text-slate-400 hover:text-primary-light flex items-center justify-center transition-all"
                >
                  <HiOutlineChevronLeft />
                </button>
                <button
                  onClick={() => setIdea((i) => (i + 1) % ideas.length)}
                  className="w-8 h-8 rounded-full bg-[#1b222c] hover:bg-primary/20 text-slate-400 hover:text-primary-light flex items-center justify-center transition-all"
                >
                  <HiOutlineChevronRight />
                </button>
              </div>
            </div>
            <div key={idea} className="animate-fade-in">
              <h4 className="text-xl font-bold text-white leading-snug">{ideas[idea].title}</h4>
              <p className="text-sm text-slate-400 mt-3">{ideas[idea].body}</p>
              <Link
                href="/ai-assistant"
                className="inline-block mt-5 px-4 py-2 rounded-lg border border-[#232b36] text-sm font-semibold text-white hover:border-primary hover:text-primary-light transition-all"
              >
                Read Now
              </Link>
            </div>
          </Card>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 stagger">
          {stats.map((s) => (
            <Card key={s.label} className="p-5 card-hover">
              <div className="flex items-center gap-3 mb-5">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${s.tint} to-transparent flex items-center justify-center`}>
                  <s.icon className="text-xl" />
                </div>
                <span className="text-slate-300 font-medium">{s.label}</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-bold text-white animate-count">{s.value}</span>
                <span className={`flex items-center gap-1 text-sm font-semibold ${s.up ? "text-primary-light" : "text-red-400"}`}>
                  {s.change}
                  {s.up ? <HiOutlineArrowSmUp /> : <HiOutlineArrowSmDown />}
                </span>
              </div>
            </Card>
          ))}
        </div>

        {/* Revenue + Product Sales */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
          <Card className="xl:col-span-2 p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-5">Revenue</h3>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-xl bg-[#0f141b] border border-[#1b222c] p-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Total Income
                </div>
                <p className="text-2xl font-bold text-white mt-2">$120,000</p>
              </div>
              <div className="rounded-xl bg-[#0f141b] border border-[#1b222c] p-4">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Total Expenses
                </div>
                <p className="text-2xl font-bold text-white mt-2">$198,214</p>
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
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: p.color }} />
                    {p.name}
                  </span>
                  <span className="text-slate-400">
                    <span className="text-white font-medium">{p.amount}</span> {p.value}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Orders + Revenue by Location */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
          <Card className="xl:col-span-2 p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-4">Orders</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-500 border-b border-[#1b222c]">
                    <th className="py-3 font-medium">Order ID</th>
                    <th className="py-3 font-medium">Amount</th>
                    <th className="py-3 font-medium hidden sm:table-cell">Shipping Method</th>
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
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusStyle[o.status]}`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button className="px-3 py-1 rounded-md border border-[#232b36] text-xs text-slate-300 hover:border-primary hover:text-primary-light transition-all">
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-4">Revenue by Location</h3>
            <div
              className="h-32 rounded-xl mb-5 opacity-70"
              style={{
                backgroundImage: "radial-gradient(circle, #2a3a44 1.4px, transparent 1.6px)",
                backgroundSize: "12px 12px",
                maskImage: "radial-gradient(120% 90% at 50% 40%, #000 40%, transparent 75%)",
                WebkitMaskImage: "radial-gradient(120% 90% at 50% 40%, #000 40%, transparent 75%)",
              }}
            />
            <div className="space-y-4">
              {locations.map((l) => (
                <div key={l.country}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-slate-300">{l.country}</span>
                    <span className="text-white font-medium">{l.amount}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-[#1b222c] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${l.pct}%`, background: l.color }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sales by gender + Top selling */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-5">
          <Card className="p-5 sm:p-6">
            <h3 className="text-white font-semibold mb-2">Sales by Gender</h3>
            <div className="flex justify-center my-6">
              <Donut
                segments={[
                  { value: 45, color: "#00a76f" },
                  { value: 35, color: "#f5a524" },
                  { value: 20, color: "#f87171" },
                ]}
                size={190}
                thickness={16}
              />
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
                      <td className="py-3">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-[#1b222c]" />
                          <span className="text-slate-200">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3 text-slate-300">{p.sale}</td>
                      <td className="py-3 text-slate-400 hidden sm:table-cell">{p.revenue}</td>
                      <td className="py-3 text-amber-400 hidden md:table-cell">★ {p.rating}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${stockStyle[p.status]}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
