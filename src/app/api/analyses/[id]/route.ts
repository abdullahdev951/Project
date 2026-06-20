import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Analysis } from "@/lib/models/Analysis";
import { getUserIdFromRequest } from "@/lib/auth";

// GET /api/analyses/[id] — fetch one analysis owned by the user
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;
    await connectDB();
    const analysis = await Analysis.findOne({ _id: id, userId }).lean();
    if (!analysis) return NextResponse.json({ error: "Report not found" }, { status: 404 });

    return NextResponse.json({ analysis });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Get analysis error:", msg, error);
    return NextResponse.json({ error: msg || "Something went wrong" }, { status: 500 });
  }
}

// DELETE /api/analyses/[id] — delete an analysis owned by the user
export async function DELETE(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;
    await connectDB();
    const result = await Analysis.findOneAndDelete({ _id: id, userId });
    if (!result) return NextResponse.json({ error: "Report not found" }, { status: 404 });

    return NextResponse.json({ message: "Deleted" });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Delete analysis error:", msg, error);
    return NextResponse.json({ error: msg || "Something went wrong" }, { status: 500 });
  }
}
