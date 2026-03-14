import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are supported" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Use pdf-parse with dynamic import for Vercel compatibility
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result.text?.trim();
    await parser.destroy();

    if (!text) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. The file may be image-based or empty." },
        { status: 400 }
      );
    }

    // Limit text to ~8000 chars to avoid token limits
    const truncatedText = text.length > 8000
      ? text.substring(0, 8000) + "\n\n[... Document truncated for analysis ...]"
      : text;

    return NextResponse.json({ text: truncatedText });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("PDF extraction error:", msg, error);
    return NextResponse.json(
      { error: `Failed to process PDF: ${msg}` },
      { status: 500 }
    );
  }
}
