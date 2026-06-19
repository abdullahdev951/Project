import { NextRequest, NextResponse } from "next/server";
import { extractDashboardData } from "@/lib/gemini";

// POST /api/extract-data — extract structured dashboard widgets from business text
export async function POST(req: NextRequest) {
  try {
    const { input } = await req.json();
    if (!input) {
      return NextResponse.json({ error: "Input is required" }, { status: 400 });
    }
    const data = await extractDashboardData(input);
    return NextResponse.json({ data });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("extract-data error:", msg, error);
    // Non-fatal: return empty structure so the dashboard still renders
    return NextResponse.json({
      data: {
        monthlyTrend: [],
        productSales: [],
        recentOrders: [],
        revenueByLocation: [],
        salesByGender: { mens: 0, womens: 0, kids: 0 },
        topProducts: [],
      },
    });
  }
}
