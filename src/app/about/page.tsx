"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import {
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
  HiOutlineChartBar,
  HiOutlineArrowRight,
  HiOutlineCheckCircle,
} from "react-icons/hi";
import { HiOutlineCpuChip, HiOutlineSquares2X2 } from "react-icons/hi2";

const stats = [
  { value: "7+", label: "AI Modules" },
  { value: "30+", label: "Tools & Features" },
  { value: "10K+", label: "Happy Users" },
  { value: "99.9%", label: "Uptime" },
];

const features = [
  "Real-time business data analysis with AI",
  "PDF document extraction and processing",
  "Interactive AI chat for business advice",
  "Comprehensive health score reports",
  "Profit/loss breakdowns and trends",
  "Growth strategy recommendations",
  "Multi-industry support and benchmarks",
  "Secure, privacy-first data handling",
];

export default function AboutPage() {
  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Grand Hero */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in-up">
          <p className="text-xs font-bold text-primary dark:text-primary-light uppercase tracking-widest mb-4">About Us</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 leading-tight">
            Illuminating the Pulse of{" "}
            <span className="gradient-text">Enterprise</span>
          </h1>
          <p className="text-base text-muted dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            AI Assist Pro transforms raw business data into actionable intelligence,
            empowering organizations to make data-driven decisions with confidence.
          </p>
        </div>

        {/* Mission + Stats Row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {/* Mission Card */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-6 flex flex-col justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mb-4 shadow-lg shadow-primary/20">
              <HiOutlineGlobeAlt className="text-white text-xl" />
            </div>
            <h2 className="text-xl font-bold text-foreground dark:text-white mb-3">Our Mission</h2>
            <p className="text-sm text-muted dark:text-slate-400 leading-relaxed">
              To democratize AI-powered business intelligence, making enterprise-grade analytics
              accessible to businesses of every size, everywhere.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="lg:col-span-3 grid grid-cols-2 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-white dark:bg-[#1E293B] border border-edge dark:border-[#334155] rounded-2xl p-6 text-center"
              >
                <div className="text-3xl font-extrabold gradient-text mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted dark:text-slate-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* The Engine of Progress */}
        <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-6 md:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-amber-400 flex items-center justify-center shadow-sm">
              <HiOutlineLightningBolt className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground dark:text-white">The Engine of Progress</h2>
              <p className="text-xs text-muted dark:text-slate-400">What powers AI Assist Pro</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-3">
            {features.map((feature) => (
              <div key={feature} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-[#0F172A] transition-all">
                <HiOutlineCheckCircle className="text-green-500 text-lg flex-shrink-0" />
                <span className="text-sm text-muted dark:text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Architected for the Infinite */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <HiOutlineCpuChip className="text-primary text-xl" />
            </div>
            <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">AI-First Architecture</h3>
            <p className="text-sm text-muted dark:text-slate-400 leading-relaxed">
              Built from the ground up with AI at the core, leveraging Google Gemini for advanced business intelligence.
            </p>
          </div>
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-6">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mb-4">
              <HiOutlineShieldCheck className="text-green-500 text-xl" />
            </div>
            <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">Enterprise Security</h3>
            <p className="text-sm text-muted dark:text-slate-400 leading-relaxed">
              Privacy-first design with local data storage, encrypted connections, and zero data sharing with third parties.
            </p>
          </div>
          <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-6">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center mb-4">
              <HiOutlineSquares2X2 className="text-amber-500 text-xl" />
            </div>
            <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">Modular Platform</h3>
            <p className="text-sm text-muted dark:text-slate-400 leading-relaxed">
              Extensible and scalable with 7+ AI modules and 30+ tools that adapt to your specific business needs.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Transform Your Business?</h2>
          <p className="text-sm text-white/80 mb-6 max-w-md mx-auto">
            Start analyzing your business data today and unlock AI-powered insights
          </p>
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 bg-white text-primary text-sm font-semibold px-6 py-3 rounded-xl hover:bg-white/90 transition-all shadow-lg"
          >
            Get Started
            <HiOutlineArrowRight />
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
