import mongoose, { Schema, Document } from "mongoose";

export interface IAnalysis extends Document {
  userId: mongoose.Types.ObjectId;
  businessName: string;
  pdfName?: string | null;
  hasPdf: boolean;
  industry: string;
  country: string;
  businessAge: string;
  monthlyRevenue: number;
  monthlyExpenses: number;
  marketingBudget: number;
  numberOfCustomers: number;
  report: string;
  widgets: Record<string, unknown>;
  createdAt: Date;
}

const AnalysisSchema = new Schema<IAnalysis>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    businessName: { type: String, default: "Business" },
    pdfName: { type: String, default: null },
    hasPdf: { type: Boolean, default: false },
    industry: { type: String, default: "" },
    country: { type: String, default: "" },
    businessAge: { type: String, default: "" },
    monthlyRevenue: { type: Number, default: 0 },
    monthlyExpenses: { type: Number, default: 0 },
    marketingBudget: { type: Number, default: 0 },
    numberOfCustomers: { type: Number, default: 0 },
    report: { type: String, default: "" },
    widgets: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const Analysis =
  mongoose.models.Analysis || mongoose.model<IAnalysis>("Analysis", AnalysisSchema);
