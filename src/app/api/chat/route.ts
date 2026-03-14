import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { History } from "@/lib/models/History";
import { getUserIdFromRequest } from "@/lib/auth";
import { generateAIResponse, generateImage } from "@/lib/gemini";

const FREE_DAILY_LIMIT = 10;

export async function POST(req: NextRequest) {
  try {
    const { tool, module, input, extraFields } = await req.json();

    if (!tool || !input) {
      return NextResponse.json(
        { error: "Tool and input are required" },
        { status: 400 }
      );
    }

    const userId = getUserIdFromRequest(req);
    let userPlan = "free";
    let user = null;

    if (userId) {
      await connectDB();
      user = await User.findById(userId);

      if (user) {
        userPlan = user.plan;

        // Rate limiting for free users
        if (userPlan === "free") {
          const today = new Date().toISOString().split("T")[0];
          if (user.lastRequestDate !== today) {
            user.requestsToday = 0;
            user.lastRequestDate = today;
          }
          if (user.requestsToday >= FREE_DAILY_LIMIT) {
            return NextResponse.json(
              {
                error: `Daily limit reached (${FREE_DAILY_LIMIT} requests). Upgrade to Pro for unlimited access.`,
              },
              { status: 429 }
            );
          }
          user.requestsToday += 1;
          await user.save();
        }
      }
    }

    // Generate AI response
    let output: string;
    if (tool === "Image Generator") {
      const style = extraFields?.Style || "";
      output = await generateImage(input, style);
    } else {
      output = await generateAIResponse(tool, input, extraFields);
    }

    // Save to history if user is logged in
    if (userId) {
      await History.create({
        userId,
        tool,
        module: module || "general",
        input,
        output,
        extraFields,
      });
    }

    return NextResponse.json({ output, plan: userPlan });
  } catch (error: unknown) {
    console.error("Chat error:", error);

    const msg = error instanceof Error ? error.message : "";
    const errorMessage = msg.includes("API_KEY")
      ? "AI API key not configured. Add your Gemini API key in .env.local"
      : msg.includes("429") || msg.includes("quota")
      ? "Rate limit reached. Please wait a few seconds and try again."
      : "AI generation failed. Please try again.";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
