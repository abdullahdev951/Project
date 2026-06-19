import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { User, IUser } from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key";

export function signToken(userId: string) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: NextRequest): string | null {
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7);
  }
  return req.cookies.get("token")?.value || null;
}

export function getUserIdFromRequest(req: NextRequest): string | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const decoded = verifyToken(token);
  return decoded?.userId || null;
}

/**
 * Resolves the authenticated user from the request and ensures they are an
 * admin. Returns the user document on success, or an `error`/`status` pair the
 * caller can return directly. Works the same locally and in production since it
 * relies only on the JWT + the user's `role` field in MongoDB.
 */
export async function requireAdmin(
  req: NextRequest
): Promise<{ user: IUser } | { error: string; status: number }> {
  const userId = getUserIdFromRequest(req);
  if (!userId) return { error: "Unauthorized", status: 401 };

  await connectDB();
  const user = await User.findById(userId);
  if (!user) return { error: "User not found", status: 404 };
  if (user.role !== "admin") return { error: "Admin access required", status: 403 };

  return { user };
}
