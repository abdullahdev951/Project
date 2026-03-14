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
    const data = new Uint8Array(arrayBuffer);

    // Import worker first to register it, then import the main library
    await import("pdfjs-dist/legacy/build/pdf.worker.mjs");
    const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");

    const doc = await pdfjs.getDocument({ data }).promise;
    const pages: string[] = [];

    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const strings = content.items
        .filter((item: Record<string, unknown>) => "str" in item)
        .map((item: Record<string, unknown>) => item.str as string);
      pages.push(strings.join(" "));
    }

    const text = pages.join("\n\n").trim();
    await doc.destroy();

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
