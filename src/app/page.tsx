"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import ScrollReveal from "@/components/ScrollReveal";
import {
  HiOutlineSparkles,
  HiOutlineDocumentText,
  HiOutlineChartBar,
  HiOutlineChatAlt2,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineArrowRight,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineCheckCircle,
} from "react-icons/hi";

const features = [
  { icon: HiOutlineChatAlt2, title: "AI Business Assistant", desc: "Ask anything about your business and get instant, data-aware answers powered by the latest AI models." },
  { icon: HiOutlineDocumentText, title: "Document Analysis", desc: "Upload PDFs, reports and spreadsheets — get summaries, insights and action items in seconds." },
  { icon: HiOutlineChartBar, title: "Smart Analytics", desc: "Beautiful dashboards for revenue, sales and conversion with real-time charts and trends." },
  { icon: HiOutlineLightningBolt, title: "Instant Reports", desc: "Generate polished, shareable reports from your data with a single click — no spreadsheets." },
  { icon: HiOutlineShieldCheck, title: "Secure & Private", desc: "Your data is encrypted and never shared. Enterprise-grade security on every plan." },
  { icon: HiOutlineSparkles, title: "Content Generation", desc: "Draft blogs, emails and product copy tailored to your brand voice in moments." },
];

const steps = [
  { n: "01", title: "Create your account", desc: "Sign up free in seconds — no credit card required." },
  { n: "02", title: "Connect your data", desc: "Upload documents or link your business numbers." },
  { n: "03", title: "Get AI insights", desc: "Chat, analyze and generate reports instantly." },
];

const stats = [
  { value: "50K+", label: "Documents analyzed" },
  { value: "12K+", label: "Active businesses" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Avg. rating" },
];

export default function LandingPage() {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0e13] text-slate-200 overflow-x-hidden">
      {/* ===== Nav ===== */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b0e13]/80 border-b border-[#1b222c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-lg shadow-primary/25">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="13" width="4" height="8" rx="1.5" fill="white" opacity="0.55" />
                <rect x="10" y="8" width="4" height="13" rx="1.5" fill="white" opacity="0.8" />
                <rect x="17" y="3" width="4" height="18" rx="1.5" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              AI Assist <span className="text-primary-light">Pro</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link href="/dashboard" className="btn-primary text-sm py-2.5">Go to Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3">
                  Login
                </Link>
                <Link href="/signup" className="btn-primary text-sm py-2.5">Get Started</Link>
              </>
            )}
          </div>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-slate-300">
            {menuOpen ? <HiOutlineX className="text-2xl" /> : <HiOutlineMenu className="text-2xl" />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-[#1b222c] bg-[#0b0e13] px-4 py-4 space-y-3 animate-slide-down">
            <a href="#features" className="block text-slate-300" onClick={() => setMenuOpen(false)}>Features</a>
            <a href="#how" className="block text-slate-300" onClick={() => setMenuOpen(false)}>How it works</a>
            <Link href="/pricing" className="block text-slate-300">Pricing</Link>
            <div className="flex gap-3 pt-2">
              {user ? (
                <Link href="/dashboard" className="btn-primary text-sm flex-1 text-center py-2.5">Dashboard</Link>
              ) : (
                <>
                  <Link href="/login" className="btn-secondary text-sm flex-1 text-center py-2.5">Login</Link>
                  <Link href="/signup" className="btn-primary text-sm flex-1 text-center py-2.5">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ===== Hero ===== */}
      <section className="relative bg-grid">
        <div className="absolute inset-0 bg-glow pointer-events-none" />
        <div className="absolute top-20 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary-light text-xs font-medium mb-6 animate-fade-in-up">
            <HiOutlineSparkles /> Powered by the latest AI models
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-[1.1] tracking-tight animate-fade-in-up max-w-4xl mx-auto">
            Your AI-powered <span className="gradient-text">business assistant</span>, all in one place
          </h1>
          <p className="mt-6 text-lg text-slate-400 max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Analyze documents, track revenue and sales, generate reports and chat with your data —
            beautifully simple, blazing fast, and built for growing businesses.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Link href={user ? "/dashboard" : "/signup"} className="btn-primary flex items-center gap-2 text-base">
              {user ? "Open Dashboard" : "Start for free"} <HiOutlineArrowRight />
            </Link>
            <Link href="/pricing" className="btn-secondary text-base">View pricing</Link>
          </div>
          <p className="mt-4 text-xs text-slate-500 animate-fade-in-up" style={{ animationDelay: "0.25s" }}>
            No credit card required · Free plan available
          </p>

          {/* Dashboard preview mockup */}
          <ScrollReveal animation="reveal-scale" className="mt-16">
            <div className="relative max-w-5xl mx-auto rounded-2xl border border-[#1b222c] bg-[#141a22] p-3 shadow-2xl shadow-primary/10">
              <div className="rounded-xl overflow-hidden border border-[#1b222c]">
                <div className="flex items-center gap-1.5 px-4 py-3 bg-[#0f141b] border-b border-[#1b222c]">
                  <span className="w-3 h-3 rounded-full bg-red-400/70" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/70" />
                  <span className="w-3 h-3 rounded-full bg-primary/70" />
                </div>
                <div className="grid grid-cols-3 gap-3 p-4 bg-[#0b0e13]">
                  {[
                    { l: "Documents", v: "5,312", c: "+2.29%" },
                    { l: "Revenue", v: "$120K", c: "+2.19%" },
                    { l: "Conversion", v: "3.5%", c: "-3.19%" },
                  ].map((s) => (
                    <div key={s.l} className="rounded-xl bg-[#141a22] border border-[#1b222c] p-4 text-left">
                      <p className="text-xs text-slate-500">{s.l}</p>
                      <p className="text-xl font-bold text-white mt-1">{s.v}</p>
                      <p className={`text-xs mt-1 ${s.c.startsWith("+") ? "text-primary-light" : "text-red-400"}`}>{s.c}</p>
                    </div>
                  ))}
                  <div className="col-span-3 rounded-xl bg-[#141a22] border border-[#1b222c] p-4">
                    <svg viewBox="0 0 600 120" className="w-full h-24">
                      <defs>
                        <linearGradient id="heroArea" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#00a76f" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#00a76f" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0,90 L100,70 L200,95 L300,55 L400,75 L500,20 L600,40 L600,120 L0,120 Z" fill="url(#heroArea)" />
                      <path d="M0,90 L100,70 L200,95 L300,55 L400,75 L500,20 L600,40" fill="none" stroke="#00a76f" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ===== Stats strip ===== */}
      <section className="border-y border-[#1b222c] bg-[#0f141b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <ScrollReveal key={s.label} delay={i * 80} className="text-center">
              <p className="text-3xl sm:text-4xl font-extrabold gradient-text">{s.value}</p>
              <p className="text-sm text-slate-400 mt-1">{s.label}</p>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== Features ===== */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-primary-light text-sm font-semibold uppercase tracking-wider">Features</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Everything your business needs</h2>
          <p className="text-slate-400 mt-4">One platform to analyze, understand and act on your business data — powered by AI.</p>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={(i % 3) * 90}>
              <div className="h-full rounded-2xl bg-[#141a22] border border-[#1b222c] p-6 card-hover">
                <div className="w-12 h-12 rounded-xl bg-primary/15 text-primary-light flex items-center justify-center mb-5">
                  <f.icon className="text-2xl" />
                </div>
                <h3 className="text-lg font-semibold text-white">{f.title}</h3>
                <p className="text-sm text-slate-400 mt-2 leading-relaxed">{f.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ===== How it works ===== */}
      <section id="how" className="bg-[#0f141b] border-y border-[#1b222c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <ScrollReveal className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary-light text-sm font-semibold uppercase tracking-wider">How it works</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mt-3">Get started in 3 simple steps</h2>
          </ScrollReveal>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <ScrollReveal key={s.n} delay={i * 120}>
                <div className="relative rounded-2xl bg-[#141a22] border border-[#1b222c] p-8 h-full">
                  <span className="text-5xl font-extrabold text-primary/20">{s.n}</span>
                  <h3 className="text-xl font-semibold text-white mt-4">{s.title}</h3>
                  <p className="text-slate-400 mt-2">{s.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-24">
        <ScrollReveal animation="reveal-scale">
          <div className="relative overflow-hidden rounded-3xl p-10 sm:p-16 text-center">
            <div className="absolute inset-0 animate-gradient bg-[linear-gradient(120deg,#00855a,#00a76f,#1fc98a,#00a76f)]" />
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative">
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Ready to grow smarter?</h2>
              <p className="text-white/85 mt-4 max-w-xl mx-auto">
                Join thousands of businesses using AI Assist Pro to make better decisions, faster.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href={user ? "/dashboard" : "/signup"} className="px-7 py-3.5 rounded-xl bg-white text-[#0b0e13] font-semibold hover:bg-white/90 transition-all flex items-center gap-2">
                  {user ? "Open Dashboard" : "Create free account"} <HiOutlineArrowRight />
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/80">
                <span className="flex items-center gap-1.5"><HiOutlineCheckCircle /> Free plan</span>
                <span className="flex items-center gap-1.5"><HiOutlineCheckCircle /> No credit card</span>
                <span className="flex items-center gap-1.5"><HiOutlineCheckCircle /> Cancel anytime</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ===== Footer ===== */}
      <footer className="border-t border-[#1b222c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <HiOutlineChartBar className="text-white" />
              </div>
              <span className="font-bold text-white">AI Assist <span className="text-primary-light">Pro</span></span>
            </Link>
            <p className="text-sm text-slate-500 mt-4 max-w-sm">
              The AI business assistant that helps you analyze, understand and grow — all from one beautiful dashboard.
            </p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3 text-sm">Product</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
              <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-3 text-sm">Company</p>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/help" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#1b222c] py-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} AI Assist Pro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
