import { NextRequest, NextResponse } from "next/server";
import { compare, hash } from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { getUserIdFromRequest } from "@/lib/auth";

// PATCH /api/auth/update — update the logged-in user's profile / password
export async function PATCH(req: NextRequest) {
  try {
    const userId = getUserIdFromRequest(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, currentPassword, newPassword } = await req.json();

    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update name
    if (typeof name === "string" && name.trim()) {
      user.name = name.trim();
    }

    // Update email (ensure unique)
    if (typeof email === "string" && email.trim()) {
      const newEmail = email.toLowerCase().trim();
      if (newEmail !== user.email) {
        const existing = await User.findOne({ email: newEmail });
        if (existing && existing._id.toString() !== userId) {
          return NextResponse.json({ error: "Email already in use" }, { status: 400 });
        }
        user.email = newEmail;
      }
    }

    // Change password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: "Current password is required to set a new password" },
          { status: 400 }
        );
      }
      if (String(newPassword).length < 6) {
        return NextResponse.json(
          { error: "New password must be at least 6 characters" },
          { status: 400 }
        );
      }
      const ok = await compare(currentPassword, user.password);
      if (!ok) {
        return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
      }
      user.password = await hash(newPassword, 12);
    }

    await user.save();

    return NextResponse.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        plan: user.plan,
        role: user.role,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Update profile error:", msg, error);
    return NextResponse.json({ error: msg || "Something went wrong" }, { status: 500 });
  }
}
