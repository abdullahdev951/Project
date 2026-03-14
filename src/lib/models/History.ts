import mongoose, { Schema, Document } from "mongoose";

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  tool: string;
  module: string;
  input: string;
  output: string;
  extraFields?: Record<string, string>;
  createdAt: Date;
}

const HistorySchema = new Schema<IHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tool: { type: String, required: true },
    module: { type: String, required: true },
    input: { type: String, required: true },
    output: { type: String, required: true },
    extraFields: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const History = mongoose.models.History || mongoose.model<IHistory>("History", HistorySchema);
