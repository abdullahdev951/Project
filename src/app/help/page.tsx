"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  HiOutlineUpload,
  HiOutlineChartBar,
  HiOutlineQuestionMarkCircle,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineMail,
  HiOutlineChevronDown,
  HiOutlineSearch,
} from "react-icons/hi";
import { HiOutlineChatBubbleLeftRight, HiOutlineArrowPath, HiOutlineBookOpen, HiOutlineCodeBracket } from "react-icons/hi2";

const faqs = [
  {
    q: "What data do I need to provide?",
    a: "At minimum, you need your business name, industry, monthly revenue, and monthly expenses. More details like marketing budget, customer count, and business age will give you a more accurate analysis.",
  },
  {
    q: "Can I upload a PDF instead of filling the form?",
    a: "Yes! You can upload a PDF with your business data (financial reports, sales data, etc.) and the AI will extract and analyze the information automatically.",
  },
  {
    q: "Where are my reports saved?",
    a: "Reports are saved locally in your browser. Go to the Reports page from the sidebar to view your latest analysis. You can also download reports as text files.",
  },
  {
    q: "How does the AI Assistant work?",
    a: "The AI Assistant is a chat-based tool. You can ask it anything — business strategies, marketing ideas, financial advice, content writing, etc. It uses advanced AI to provide helpful, actionable responses.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. Your data is processed securely and we don't store or share your business information with third parties. Reports are saved only in your browser's local storage.",
  },
  {
    q: "What's included in the Free plan?",
    a: "The Free plan includes the Business Analysis tool, AI Assistant chat, and up to 10 AI requests per day. Upgrade to Pro for unlimited access and advanced features.",
  },
];

export default function HelpPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.q.toLowerCase().includes(search.toLowerCase()) ||
      faq.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5">
        {/* Hero with search */}
        <div className="relative overflow-hidden rounded-2xl border border-[#1b222c] bg-[#141a22] p-8 sm:p-10 text-center animate-fade-in-up">
          <div className="absolute inset-0 bg-glow pointer-events-none" />
          <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20 animate-float">
              <HiOutlineQuestionMarkCircle className="text-white text-2xl" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              How can we <span className="gradient-text">help you</span> today?
            </h1>
            <p className="text-sm text-slate-400 max-w-lg mx-auto mb-6">
              Everything you need to get started and make the most of AI Assist Pro
            </p>
            <div className="relative max-w-xl mx-auto">
              <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for answers..."
                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#0f141b] border border-[#232b36] text-sm text-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder-slate-500 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Feature Cards - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {/* Getting Started */}
          <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-6 card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <HiOutlineLightningBolt className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Getting Started</h3>
                <p className="text-xs text-slate-400">Quick setup guide</p>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { step: "01", text: "Upload your business data or PDF document" },
                { step: "02", text: "AI analyzes and generates insights" },
                { step: "03", text: "View your report on the Reports page" },
                { step: "04", text: "Chat with AI Assistant for more advice" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <span className="text-[10px] font-bold text-primary-light bg-primary/10 px-2 py-1 rounded-lg">{item.step}</span>
                  <span className="text-xs text-slate-400">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Data Connection */}
          <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-6 card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                <HiOutlineArrowPath className="text-white text-lg" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Data Connection</h3>
                <p className="text-xs text-slate-400">How to upload your data</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <HiOutlineUpload className="text-primary-light mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-400">Upload PDF files with your financial reports, sales data, or business documents</p>
              </div>
              <div className="flex items-start gap-3">
                <HiOutlineChartBar className="text-primary-light mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-400">Fill in the manual form with business name, industry, revenue, and expenses</p>
              </div>
              <div className="flex items-start gap-3">
                <HiOutlineLightningBolt className="text-amber-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-400">Both methods work - AI extracts and processes the data automatically</p>
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 animate-fade-in-up stagger" style={{ animationDelay: "0.2s" }}>
          <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-5 card-hover">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <HiOutlineBookOpen className="text-primary-light text-lg" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Account Management</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Manage your profile, preferences, and notification settings from the Settings page.</p>
          </div>
          <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-5 card-hover">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
              <HiOutlineShieldCheck className="text-primary-light text-lg" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">Privacy &amp; Security</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Your data is secure and never shared. Reports are stored locally in your browser only.</p>
          </div>
          <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-5 card-hover">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
              <HiOutlineCodeBracket className="text-amber-400 text-lg" />
            </div>
            <h3 className="text-sm font-bold text-white mb-1">API Reference</h3>
            <p className="text-xs text-slate-400 leading-relaxed">Powered by Google Gemini AI for intelligent business analysis and chat assistance.</p>
          </div>
        </div>

        {/* FAQs with Accordion */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {filteredFaqs.length === 0 ? (
              <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-8 text-center">
                <p className="text-sm text-slate-400">No results found for &ldquo;{search}&rdquo;.</p>
              </div>
            ) : (
              filteredFaqs.map((faq) => {
                const index = faqs.indexOf(faq);
                const isOpen = openFaq === index;
                return (
                  <div
                    key={faq.q}
                    className={`rounded-2xl bg-[#141a22] border overflow-hidden transition-colors ${
                      isOpen ? "border-primary/40" : "border-[#1b222c]"
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full flex items-center justify-between p-5 text-left group"
                    >
                      <h3 className="text-sm font-bold text-white pr-4 group-hover:text-primary-light transition-colors">{faq.q}</h3>
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                          isOpen ? "bg-primary/20 text-primary-light rotate-180" : "bg-[#1b222c] text-slate-400"
                        }`}
                      >
                        <HiOutlineChevronDown />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 -mt-1 animate-slide-down">
                        <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Still Need Help - Contact CTA */}
        <div className="relative overflow-hidden rounded-2xl border border-[#1b222c] bg-[#141a22] p-8 text-center">
          <div className="absolute inset-0 bg-glow pointer-events-none" />
          <div className="relative">
            <h2 className="text-xl font-bold text-white mb-2">Still need help?</h2>
            <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
              Our team is here to assist you with any questions or issues
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary-light card-hover">
                <HiOutlineChatBubbleLeftRight className="text-lg" />
                <div className="text-left">
                  <p className="text-xs font-bold">Live Chat</p>
                  <p className="text-[10px] opacity-70">Available 24/7</p>
                </div>
              </div>
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 card-hover">
                <HiOutlineMail className="text-lg" />
                <div className="text-left">
                  <p className="text-xs font-bold">Email Support</p>
                  <p className="text-[10px] opacity-70">support@aiassistpro.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
