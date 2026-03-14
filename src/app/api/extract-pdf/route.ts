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
    const buffer = new Uint8Array(arrayBuffer);

    // Use unpdf - designed for serverless environments (no DOMMatrix needed)
    const { extractText } = await import("unpdf");
    const result = await extractText(buffer);
    const trimmed = (Array.isArray(result.text) ? result.text.join("\n") : result.text)?.trim();

    if (!trimmed) {
      return NextResponse.json(
        { error: "Could not extract text from PDF. The file may be image-based or empty." },
        { status: 400 }
      );
    }

    // Limit text to ~8000 chars to avoid token limits
    const truncatedText = trimmed.length > 8000
      ? trimmed.substring(0, 8000) + "\n\n[... Document truncated for analysis ...]"
      : trimmed;

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
