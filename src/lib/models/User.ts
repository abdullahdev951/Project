import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  plan: "free" | "pro" | "business";
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  requestsToday: number;
  lastRequestDate: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    plan: { type: String, enum: ["free", "pro", "business"], default: "free" },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    requestsToday: { type: Number, default: 0 },
    lastRequestDate: { type: String, default: "" },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
