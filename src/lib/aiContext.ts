// Builds a context string about the logged-in user's business/account so the
// AI Assistant can answer questions about "my business / website / reports".

interface WidgetItem {
  name?: string;
  country?: string;
}

interface ActiveData {
  businessName?: string;
  industry?: string;
  country?: string;
  businessAge?: string;
  monthlyRevenue?: number;
  monthlyExpenses?: number;
  marketingBudget?: number;
  numberOfCustomers?: number;
  report?: string;
  widgets?: {
    topProducts?: WidgetItem[];
    productSales?: WidgetItem[];
    revenueByLocation?: WidgetItem[];
  };
}

interface SavedItem {
  hasPdf?: boolean;
  pdfName?: string | null;
  businessName?: string;
}

const money = (n: number) => `$${(n || 0).toLocaleString()}`;

export async function getBusinessContext(): Promise<string> {
  const parts: string[] = [];
  try {
    const raw = localStorage.getItem("analysisData");
    if (raw) {
      const d = JSON.parse(raw) as ActiveData;
      const rev = d.monthlyRevenue || 0;
      const exp = d.monthlyExpenses || 0;
      parts.push(
        `Active business: "${d.businessName || "N/A"}" — industry ${d.industry || "N/A"}, country ${d.country || "N/A"}, age ${d.businessAge || "N/A"}.`
      );
      parts.push(
        `Monthly Revenue: ${money(rev)}, Monthly Expenses: ${money(exp)}, Net Profit: ${money(rev - exp)}, Marketing Budget: ${money(d.marketingBudget || 0)}, Customers: ${d.numberOfCustomers || 0}.`
      );
      const w = d.widgets || {};
      if (w.topProducts?.length) parts.push(`Top products: ${w.topProducts.map((p) => p.name).filter(Boolean).join(", ")}.`);
      if (w.productSales?.length) parts.push(`Product categories: ${w.productSales.map((p) => p.name).filter(Boolean).join(", ")}.`);
      if (w.revenueByLocation?.length) parts.push(`Revenue locations: ${w.revenueByLocation.map((l) => l.country).filter(Boolean).join(", ")}.`);
      if (d.report) parts.push(`Latest AI analysis report (for reference):\n${String(d.report).slice(0, 3500)}`);
    }

    // Saved reports / uploaded PDFs in the account
    const token = localStorage.getItem("token");
    if (token) {
      const res = await fetch("/api/analyses", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const j = await res.json();
        const list: SavedItem[] = j.analyses || [];
        const pdfs = list.filter((a) => a.hasPdf && a.pdfName);
        let line = `The user has ${list.length} saved report(s) in their account on this website.`;
        if (pdfs.length) {
          line += ` ${pdfs.length} of them were generated from uploaded PDF files: ${pdfs.map((a) => a.pdfName).join(", ")}.`;
        }
        const names = list.map((a) => a.businessName).filter(Boolean);
        if (names.length) line += ` Report names: ${names.join(", ")}.`;
        parts.push(line);
      }
    }
  } catch {
    // best-effort; return whatever we gathered
  }
  return parts.join("\n");
}
