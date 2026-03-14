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
import { HiOutlineBriefcase, HiOutlineArrowPath } from "react-icons/hi2";

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

      // Save full analysis data for dashboard
      const analysisData = {
        businessName: form.businessName || pdfFile?.name || "Business",
        industry: form.industry || "General",
        monthlyRevenue: parseFloat(form.monthlyRevenue) || 0,
        monthlyExpenses: parseFloat(form.monthlyExpenses) || 0,
        marketingBudget: parseFloat(form.marketingBudget) || 0,
        numberOfCustomers: parseInt(form.numberOfCustomers) || 0,
        businessAge: form.businessAge || "N/A",
        country: form.country || "N/A",
        report: data.output,
        analyzedAt: new Date().toISOString(),
        hasPdf: !!pdfFile,
        pdfName: pdfFile?.name || null,
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

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0F172A] border border-edge dark:border-[#334155] text-sm text-foreground dark:text-slate-300 outline-none focus:border-primary dark:focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all";
  const labelClass = "block text-xs font-semibold text-foreground dark:text-slate-300 mb-1.5";

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="mb-6 animate-fade-in-up">
          <p className="text-xs font-bold text-primary-light uppercase tracking-widest mb-2">Data Pipeline</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Upload & Analyze</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Drop your business data or fill in the form to generate AI-powered insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          {/* Left - Upload Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Drag & Drop Zone */}
            <div
              className={`bg-white dark:bg-[#1E293B] rounded-2xl border-2 border-dashed ${
                isDragging ? "border-primary bg-primary/5 dark:bg-primary/5" : "border-edge dark:border-[#334155]"
              } p-8 text-center transition-all`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <HiOutlineCloudUpload className="text-primary dark:text-primary-light text-3xl" />
              </div>
              <h3 className="text-lg font-bold text-foreground dark:text-white mb-2">Drop your data here</h3>
              <p className="text-xs text-muted dark:text-slate-400 mb-4">
                Drag & drop your PDF files, or click to browse
              </p>
              <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold cursor-pointer hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
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
              <p className="text-[10px] text-muted dark:text-slate-500 mt-3">
                Supports PDF up to 10MB
              </p>
            </div>

            {/* Uploaded File */}
            {pdfFile && (
              <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-4">
                <p className="text-xs font-semibold text-muted dark:text-slate-400 uppercase tracking-wider mb-3">Uploaded File</p>
                <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 dark:bg-primary/5 border border-primary/20">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-primary-light flex items-center justify-center flex-shrink-0">
                    <HiOutlineDocumentText className="text-white text-lg" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground dark:text-slate-300 truncate">{pdfFile.name}</p>
                    <p className="text-[10px] text-muted dark:text-slate-500">
                      {pdfLoading ? "Extracting text..." : `${(pdfFile.size / 1024).toFixed(1)} KB`}
                    </p>
                  </div>
                  {pdfLoading ? (
                    <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin flex-shrink-0" />
                  ) : (
                    <button type="button" onClick={removePdf} className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-muted hover:text-red-500 transition-all flex-shrink-0">
                      <HiOutlineX className="text-sm" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-5">
              <div className="flex items-center gap-2 mb-4">
                <HiOutlineLightningBolt className="text-amber-500" />
                <span className="text-xs font-bold text-muted dark:text-slate-400 uppercase tracking-wider">Processing Info</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted dark:text-slate-400">AI Model</span>
                  <span className="text-xs font-semibold text-foreground dark:text-white">Gemini 2.5 Flash</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted dark:text-slate-400">Avg. Processing</span>
                  <span className="text-xs font-semibold text-foreground dark:text-white">~15 seconds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted dark:text-slate-400">Output</span>
                  <span className="text-xs font-semibold text-foreground dark:text-white">Full Report</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Business Form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-[#1E293B] rounded-2xl border border-edge dark:border-[#334155] p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center shadow-sm">
                  <HiOutlineBriefcase className="text-white text-lg" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground dark:text-white">Business Details</h2>
                  <p className="text-xs text-muted dark:text-slate-400">Or enter your data manually</p>
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
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-xs">
                    <HiOutlineExclamationCircle className="text-lg flex-shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || pdfLoading}
                  className="w-full bg-gradient-to-r from-primary to-primary-light text-white text-sm font-semibold py-4 rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
