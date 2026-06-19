"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  HiOutlineArrowRight,
  HiOutlineChartBar,
  HiOutlineExclamationCircle,
  HiOutlineDocumentText,
  HiOutlineX,
  HiOutlineCloudUpload,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import { HiOutlineBriefcase } from "react-icons/hi2";

interface FormData {
  businessName: string;
  industry: string;
  monthlyRevenue: string;
  monthlyExpenses: string;
  marketingBudget: string;
  numberOfCustomers: string;
  businessAge: string;
  country: string;
}

const industries = [
  "E-Commerce",
  "SaaS / Software",
  "Restaurant / Food",
  "Retail / Shop",
  "Freelancing / Agency",
  "Healthcare",
  "Education",
  "Real Estate",
  "Manufacturing",
  "Transportation",
  "Entertainment",
  "Finance / Banking",
  "Other",
];

export default function UploadPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    businessName: "",
    industry: "",
    monthlyRevenue: "",
    monthlyExpenses: "",
    marketingBudget: "",
    numberOfCustomers: "",
    businessAge: "",
    country: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfText, setPdfText] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const processFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file only.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("PDF file size should be less than 10MB.");
      return;
    }

    setPdfFile(file);
    setPdfLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/extract-pdf", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to extract PDF text");
        setPdfFile(null);
        return;
      }
      setPdfText(data.text);
    } catch {
      setError("Failed to process PDF. Please try again.");
      setPdfFile(null);
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const removePdf = () => {
    setPdfFile(null);
    setPdfText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasFormData = form.businessName || form.industry || form.monthlyRevenue || form.monthlyExpenses;
    const hasPdf = pdfText;

    if (!hasFormData && !hasPdf) {
      setError("Please fill in business details or upload a PDF document.");
      return;
    }
    if (hasFormData && (!form.businessName || !form.industry || !form.monthlyRevenue || !form.monthlyExpenses)) {
      setError("Please fill in at least Business Name, Industry, Revenue, and Expenses.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      let input = "";
      if (hasFormData) {
        input += `
Business Name: ${form.businessName}
Industry: ${form.industry}
Monthly Revenue: $${form.monthlyRevenue}
Monthly Expenses: $${form.monthlyExpenses}
Marketing Budget: $${form.marketingBudget || "Not specified"}
Number of Customers: ${form.numberOfCustomers || "Not specified"}
Business Age: ${form.businessAge || "Not specified"}
Country: ${form.country || "Not specified"}
        `.trim();
      }
      if (hasPdf) {
        input += `\n\n--- Uploaded Document Data ---\n${pdfText}`;
      }

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          tool: "Business Analyzer",
          module: "Business Analysis",
          input: input.trim(),
          extraFields: {},
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      // Extract structured widget data + headline summary from the same input.
      // Non-fatal if it fails.
      const emptySummary = {
        businessName: "",
        industry: "",
        country: "",
        businessAge: "",
        monthlyRevenue: 0,
        monthlyExpenses: 0,
        marketingBudget: 0,
        numberOfCustomers: 0,
      };
      let summary = emptySummary;
      let widgets = {
        monthlyTrend: [],
        productSales: [],
        recentOrders: [],
        revenueByLocation: [],
        salesByGender: { mens: 0, womens: 0, kids: 0 },
        topProducts: [],
      };
      try {
        const exRes = await fetch("/api/extract-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ input: input.trim() }),
        });
        const exData = await exRes.json();
        if (exRes.ok && exData.data) {
          const { summary: s, ...rest } = exData.data;
          if (s) summary = s;
          widgets = rest;
        }
      } catch {
        // keep empty widgets — dashboard will show zero states
      }

      // Form value first, then AI-extracted value, then 0/default.
      const num = (formVal: string, extracted: number, isInt = false) => {
        const parsed = isInt ? parseInt(formVal) : parseFloat(formVal);
        return parsed || extracted || 0;
      };

      // Save full analysis data for dashboard
      const analysisData = {
        businessName: form.businessName || summary.businessName || pdfFile?.name || "Business",
        industry: form.industry || summary.industry || "General",
        monthlyRevenue: num(form.monthlyRevenue, summary.monthlyRevenue),
        monthlyExpenses: num(form.monthlyExpenses, summary.monthlyExpenses),
        marketingBudget: num(form.marketingBudget, summary.marketingBudget),
        numberOfCustomers: num(form.numberOfCustomers, summary.numberOfCustomers, true),
        businessAge: form.businessAge || summary.businessAge || "N/A",
        country: form.country || summary.country || "N/A",
        report: data.output,
        analyzedAt: new Date().toISOString(),
        hasPdf: !!pdfFile,
        pdfName: pdfFile?.name || null,
        widgets,
      };
      localStorage.setItem("analysisData", JSON.stringify(analysisData));
      localStorage.setItem("analysisReport", data.output);
      localStorage.setItem("analysisBusinessName", analysisData.businessName);
      router.push("/reports");
    } catch {
      setError("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-[#0f141b] border border-[#232b36] text-sm text-slate-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 placeholder-slate-500 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-300 mb-1.5";

  const supportedTypes = ["PDF", "Financial Reports", "Sales Data", "Invoices"];

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-4 sm:space-y-5">
        {/* Page Header */}
        <div className="animate-fade-in-up">
          <p className="text-xs font-bold text-primary-light uppercase tracking-widest mb-2">Data Pipeline</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Upload &amp; Analyze</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Drop your business data or fill in the form to generate AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {/* Left - Upload Area */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-5">
            {/* Drag & Drop Zone */}
            <div
              className={`group relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 ${
                isDragging
                  ? "border-primary bg-primary/10 scale-[1.01]"
                  : "border-[#232b36] bg-[#141a22] hover:border-primary/50 hover:bg-[#0f141b]"
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="absolute inset-0 bg-glow opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all ${
                    isDragging ? "bg-primary/20 animate-float" : "bg-primary/10"
                  }`}
                >
                  <HiOutlineCloudUpload className="text-primary-light text-3xl" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">
                  {isDragging ? "Release to upload" : "Drop your data here"}
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Drag &amp; drop your PDF files, or click to browse
                </p>
                <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white text-xs font-semibold cursor-pointer hover:shadow-lg hover:shadow-primary/25 transition-all">
                  <HiOutlineCloudUpload className="text-sm" />
                  Browse Files
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handlePdfUpload}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-500 mt-3">Supports PDF up to 10MB</p>
              </div>
            </div>

            {/* Supported type chips */}
            <div className="flex flex-wrap gap-2">
              {supportedTypes.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-lg bg-[#0f141b] border border-[#1b222c] text-[11px] font-medium text-slate-400"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Uploaded File */}
            {pdfFile && (
              <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-4 animate-scale-in">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Uploaded File</p>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
                    <HiOutlineDocumentText className="text-white text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{pdfFile.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {pdfLoading ? "Extracting text..." : `${(pdfFile.size / 1024).toFixed(1)} KB`}
                    </p>
                  </div>
                  {pdfLoading ? (
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin flex-shrink-0" />
                  ) : (
                    <button type="button" onClick={removePdf} className="p-1.5 rounded-lg hover:bg-red-900/20 text-slate-400 hover:text-red-400 transition-all flex-shrink-0">
                      <HiOutlineX className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-5">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineLightningBolt className="text-amber-400" />
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processing Info</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">AI Model</span>
                  <span className="text-xs font-semibold text-white">Gemini 2.5 Flash</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Avg. Processing</span>
                  <span className="text-xs font-semibold text-white">~15 seconds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Output</span>
                  <span className="text-xs font-semibold text-white">Full Report</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Business Form */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl bg-[#141a22] border border-[#1b222c] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center">
                  <HiOutlineBriefcase className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Business Details</h2>
                  <p className="text-xs text-slate-400">Or enter your data manually</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className={labelClass}>Business Name *</label>
                  <input type="text" name="businessName" value={form.businessName} onChange={handleChange} placeholder="e.g., My Online Store" className={inputClass} />
                </div>

                <div>
                  <label className={labelClass}>Industry *</label>
                  <select name="industry" value={form.industry} onChange={handleChange} className={inputClass}>
                    <option value="">Select Industry</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Monthly Revenue ($) *</label>
                    <input type="number" name="monthlyRevenue" value={form.monthlyRevenue} onChange={handleChange} placeholder="5000" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Monthly Expenses ($) *</label>
                    <input type="number" name="monthlyExpenses" value={form.monthlyExpenses} onChange={handleChange} placeholder="4200" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Marketing Budget ($)</label>
                  <input type="number" name="marketingBudget" value={form.marketingBudget} onChange={handleChange} placeholder="500" className={inputClass} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>No. of Customers</label>
                    <input type="number" name="numberOfCustomers" value={form.numberOfCustomers} onChange={handleChange} placeholder="100" className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Business Age</label>
                    <input type="text" name="businessAge" value={form.businessAge} onChange={handleChange} placeholder="e.g., 2 years" className={inputClass} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Country</label>
                  <input type="text" name="country" value={form.country} onChange={handleChange} placeholder="e.g., Pakistan, USA" className={inputClass} />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-900/10 border border-red-800/30 text-red-400 text-xs animate-fade-in">
                    <HiOutlineExclamationCircle className="text-lg flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || pdfLoading}
                  className="w-full bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <HiOutlineChartBar className="text-lg" />
                      Go Analyze
                      <HiOutlineArrowRight />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
