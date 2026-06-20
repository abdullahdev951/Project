import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Analysis } from "@/lib/models/Analysis";
import { getUserIdFromRequest } from "@/lib/auth";

// GET /api/analyses — list the logged-in user's saved analyses (newest first)
export async function GET(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const analyses = await Analysis.find({ userId }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ analyses });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("List analyses error:", msg, error);
    return NextResponse.json({ error: msg || "Something went wrong" }, { status: 500 });
  }
}

// POST /api/analyses — save a new analysis for the logged-in user
export async function POST(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await connectDB();

    const analysis = await Analysis.create({
      userId,
      businessName: body.businessName || "Business",
      pdfName: body.pdfName || null,
      hasPdf: !!body.hasPdf,
      industry: body.industry || "",
      country: body.country || "",
      businessAge: body.businessAge || "",
      monthlyRevenue: Number(body.monthlyRevenue) || 0,
      monthlyExpenses: Number(body.monthlyExpenses) || 0,
      marketingBudget: Number(body.marketingBudget) || 0,
      numberOfCustomers: Number(body.numberOfCustomers) || 0,
      report: body.report || "",
      widgets: body.widgets || {},
    });

    return NextResponse.json({ id: analysis._id, analysis }, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Save analysis error:", msg, error);
    return NextResponse.json({ error: msg || "Something went wrong" }, { status: 500 });
  }
}
