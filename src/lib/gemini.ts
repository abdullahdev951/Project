import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateAIResponse(
  tool: string,
  input: string,
  extraFields?: Record<string, string>
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const extraContext = extraFields
    ? Object.entries(extraFields)
        .filter(([, v]) => v)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
    : "";

  const prompt = buildPrompt(tool, input, extraContext);

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

export interface DashboardSummary {
  businessName: string;
  industry: string;
  country: string;
  businessAge: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  marketingBudget: number;
  numberOfCustomers: number;
}

export interface DashboardData {
  summary: DashboardSummary;
  monthlyTrend: { label: string; income: number; expenses: number }[];
  productSales: { name: string; amount: number; percent: number }[];
  recentOrders: { id: string; amount: string; method: string; date: string; status: string }[];
  revenueByLocation: { country: string; amount: number }[];
  salesByGender: { mens: number; womens: number; kids: number };
  topProducts: { name: string; sales: number; revenue: string; rating: string; status: string }[];
}

const EMPTY_SUMMARY: DashboardSummary = {
  businessName: "",
  industry: "",
  country: "",
  businessAge: "",
  monthlyRevenue: 0,
  monthlyExpenses: 0,
  marketingBudget: 0,
  numberOfCustomers: 0,
};

const EMPTY_DASHBOARD: DashboardData = {
  summary: EMPTY_SUMMARY,
  monthlyTrend: [],
  productSales: [],
  recentOrders: [],
  revenueByLocation: [],
  salesByGender: { mens: 0, womens: 0, kids: 0 },
  topProducts: [],
};

/**
 * Extracts structured dashboard data from the business text / PDF content.
 * Only returns data that is actually present — empty arrays / zeros otherwise.
 * Never throws; returns empty structure on any failure so the dashboard still renders.
 */
export async function extractDashboardData(input: string): Promise<DashboardData> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `You are a strict data-extraction engine. From the BUSINESS DATA below, extract ONLY information that is explicitly present. DO NOT invent, guess or estimate any values. Return a SINGLE valid JSON object and NOTHING else (no markdown fences, no commentary), with EXACTLY this shape:
{
  "summary": {"businessName":"","industry":"","country":"","businessAge":"","monthlyRevenue":0,"monthlyExpenses":0,"marketingBudget":0,"numberOfCustomers":0},
  "monthlyTrend": [{"label":"Jan","income":0,"expenses":0}],
  "productSales": [{"name":"","amount":0,"percent":0}],
  "recentOrders": [{"id":"","amount":"$0","method":"","date":"","status":"Completed"}],
  "revenueByLocation": [{"country":"","amount":0}],
  "salesByGender": {"mens":0,"womens":0,"kids":0},
  "topProducts": [{"name":"","sales":0,"revenue":"$0","rating":"4.5/5","status":"In Stock"}]
}
RULES:
- "summary": extract the headline business figures. monthlyRevenue/monthlyExpenses/marketingBudget/numberOfCustomers are plain numbers (no "$", no commas); use 0 if not present. businessName/industry/country/businessAge are strings ("" if not present).
- If a section's data is NOT present in the input, return an empty array for it (or all zeros for salesByGender). Never fabricate rows.
- "income"/"expenses"/"amount"/"percent"/"sales" must be plain numbers (no "$", no commas).
- recentOrders.status must be one of: Shipped, Pending, Cancel, Completed.
- topProducts.status must be one of: In Stock, Low Stock, Out of Stock.
- salesByGender values are counts or percentages as found in the data.
- Limit every array to at most 8 items.

BUSINESS DATA:
${input}`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    // strip ```json ... ``` fences if present
    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```$/i, "")
      .trim();
    const parsed = JSON.parse(text);
    return {
      summary: {
        businessName: String(parsed.summary?.businessName || ""),
        industry: String(parsed.summary?.industry || ""),
        country: String(parsed.summary?.country || ""),
        businessAge: String(parsed.summary?.businessAge || ""),
        monthlyRevenue: Number(parsed.summary?.monthlyRevenue) || 0,
        monthlyExpenses: Number(parsed.summary?.monthlyExpenses) || 0,
        marketingBudget: Number(parsed.summary?.marketingBudget) || 0,
        numberOfCustomers: Number(parsed.summary?.numberOfCustomers) || 0,
      },
      monthlyTrend: Array.isArray(parsed.monthlyTrend) ? parsed.monthlyTrend.slice(0, 8) : [],
      productSales: Array.isArray(parsed.productSales) ? parsed.productSales.slice(0, 8) : [],
      recentOrders: Array.isArray(parsed.recentOrders) ? parsed.recentOrders.slice(0, 8) : [],
      revenueByLocation: Array.isArray(parsed.revenueByLocation) ? parsed.revenueByLocation.slice(0, 8) : [],
      salesByGender: {
        mens: Number(parsed.salesByGender?.mens) || 0,
        womens: Number(parsed.salesByGender?.womens) || 0,
        kids: Number(parsed.salesByGender?.kids) || 0,
      },
      topProducts: Array.isArray(parsed.topProducts) ? parsed.topProducts.slice(0, 8) : [],
    };
  } catch (e) {
    console.error("extractDashboardData failed:", e);
    return EMPTY_DASHBOARD;
  }
}

export async function generateImage(
  prompt: string,
  style?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    // @ts-expect-error - responseModalities supported in newer API
    generationConfig: { responseModalities: ["image", "text"] },
  });

  const fullPrompt = style
    ? `Generate an image in ${style} style: ${prompt}`
    : `Generate an image: ${prompt}`;

  const result = await model.generateContent(fullPrompt);
  const response = result.response;
  const parts = response.candidates?.[0]?.content?.parts;

  if (parts) {
    for (const part of parts) {
      if (part.inlineData) {
        const { mimeType, data } = part.inlineData;
        return `data:${mimeType};base64,${data}`;
      }
    }
  }

  throw new Error("No image was generated. Please try again with a different prompt.");
}

function buildPrompt(tool: string, input: string, extraContext: string): string {
  const base = `You are AI Assist Pro, a helpful AI assistant. Respond in a clear, well-formatted way.\n\n`;

  const toolPrompts: Record<string, string> = {
    "Code Generator": `${base}You are an expert programmer. Generate clean, well-commented code based on the user's request.\n${extraContext}\n\nUser Request: ${input}`,
    "JSON Formatter": `${base}Format, validate and beautify the following JSON. If invalid, explain the errors.\n\nJSON Input: ${input}`,
    "API Tester": `${base}Help the user test and understand this API.\n${extraContext}\n\nAPI Details: ${input}`,
    "Regex Tester": `${base}Generate a regex pattern based on the description. Explain each part.\n\nDescription: ${input}`,
    "DB Query Helper": `${base}Generate a database query based on the description.\n${extraContext}\n\nQuery Description: ${input}`,
    "Text Generator": `${base}Generate high-quality text content based on the request.\n${extraContext}\n\nRequest: ${input}`,
    "Resume Builder": `${base}Create a professional resume/cover letter based on the details.\n${extraContext}\n\nDetails: ${input}`,
    "Paraphraser": `${base}Paraphrase/transform the text as requested.\n${extraContext}\n\nText: ${input}`,
    "Language Translator": `${base}Translate the following text accurately.\n${extraContext}\n\nText: ${input}`,
    "AI Writing Coach": `${base}Review the writing and provide detailed feedback.\n${extraContext}\n\nText: ${input}`,
    "Trip Planner": `${base}Create a detailed trip itinerary.\n${extraContext}\n\nTrip Details: ${input}`,
    "Budget Planner": `${base}Calculate travel budget and give suggestions.\n${extraContext}\n\nTravel Plans: ${input}`,
    "Flights & Hotels": `${base}Recommend flights and hotels based on the details.\n${extraContext}\n\nTravel Details: ${input}`,
    "Local Experiences": `${base}Suggest local experiences, food and hidden gems.\n\nDestination Details: ${input}`,
    "Tips & Tricks": `${base}Give pro-level gaming tips and tricks.\n${extraContext}\n\nGame/Question: ${input}`,
    "Walkthroughs": `${base}Provide a detailed game walkthrough.\n\nQuestion: ${input}`,
    "Game Stats Tracker": `${base}Analyze gaming stats and suggest improvements.\n${extraContext}\n\nStats: ${input}`,
    "Workout Planner": `${base}Create a personalized workout plan.\n${extraContext}\n\nGoals: ${input}`,
    "Diet Planner": `${base}Create a detailed diet/meal plan.\n${extraContext}\n\nDietary Needs: ${input}`,
    "BMI Calculator": `${base}Calculate BMI and give health recommendations.\n\nDetails: ${input}`,
    "Meditation Guide": `${base}Provide a guided meditation session.\n${extraContext}\n\nRequest: ${input}`,
    "Recipe Generator": `${base}Generate a detailed recipe with steps.\n${extraContext}\n\nIngredients/Request: ${input}`,
    "Meal Planner": `${base}Create a meal plan with balanced nutrition.\n${extraContext}\n\nPreferences: ${input}`,
    "Calorie Calculator": `${base}Calculate calories and nutritional breakdown.\n\nFood Items: ${input}`,
    "Ingredient Substitute": `${base}Suggest ingredient substitutes with explanations.\n\nRequest: ${input}`,
    "Invoice Generator": `${base}Generate a professional invoice in text format.\n${extraContext}\n\nDetails: ${input}`,
    "Task Manager": `${base}Break down the project into organized tasks.\n${extraContext}\n\nProject: ${input}`,
    "Expense Tracker": `${base}Analyze expenses and give financial insights.\n\nExpenses: ${input}`,
    "Client CRM": `${base}Help manage client information and communications.\n${extraContext}\n\nDetails: ${input}`,
    "Business Analyzer": `${base}You are an expert business analyst and consultant. The user has provided their business details. Analyze the data thoroughly and provide a comprehensive business analysis report.

Your report MUST include these sections with clear markdown formatting:

## Business Health Score
Give a score out of 10 and explain why.

## Profit / Loss Analysis
Calculate profit/loss, profit margin %, and explain the financial status.

## Current Business Status
Summarize where the business stands right now.

## Competition Analysis
Based on the industry, analyze the competition level (High/Medium/Low) and what competitors typically do.

## Growth Suggestions
Provide 5-7 actionable suggestions to grow the business (marketing, pricing, services, etc.)

## Business Roadmap
- Next 3 months strategy
- Next 6 months growth plan
- Long term (1 year) scaling plan

## Key Risks & Warnings
Highlight any financial risks or red flags.

Be specific, data-driven, and actionable. Use the actual numbers provided to calculate real metrics.

Business Details:
${input}`,
    "AI Assistant": `${base}You are a helpful, knowledgeable AI assistant. You can help with any topic — business advice, marketing strategies, content writing, brainstorming, problem solving, and general questions. Provide clear, actionable, and well-structured responses.\n\nUser Message: ${input}`,
  };

  return toolPrompts[tool] || `${base}${extraContext}\n\nUser Request: ${input}`;
}
