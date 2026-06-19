import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/lib/models/User";

/**
 * One-time admin bootstrap endpoint.
 *
 * Creates (or promotes) the admin account using credentials from env vars so it
 * works identically on local and on the live deployment — you just call this
 * URL once per environment.
 *
 * Required env vars:
 *   ADMIN_EMAIL         e.g. admin@aiassistpro.com
 *   ADMIN_PASSWORD      the admin password (min 6 chars)
 *   ADMIN_SETUP_SECRET  a random secret; must be passed to call this endpoint
 *
 * Usage (local):
 *   curl -X POST http://localhost:3000/api/admin/seed \
 *     -H "Content-Type: application/json" \
 *     -d '{"secret":"<ADMIN_SETUP_SECRET>"}'
 *
 * Usage (live): same, with your production URL.
 */
export async function POST(req: NextRequest) {
  try {
    const setupSecret = process.env.ADMIN_SETUP_SECRET;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!setupSecret || !adminEmail || !adminPassword) {
      return NextResponse.json(
        {
          error:
            "Admin seed is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_SETUP_SECRET in the environment.",
        },
        { status: 500 }
      );
    }

    // Accept the secret from the request body or an x-setup-secret header.
    let bodySecret: string | undefined;
    try {
      const body = await req.json();
      bodySecret = body?.secret;
    } catch {
      // no JSON body — fall back to header
    }
    const provided = bodySecret || req.headers.get("x-setup-secret") || "";

    if (provided !== setupSecret) {
      return NextResponse.json({ error: "Invalid setup secret" }, { status: 401 });
    }

    if (adminPassword.length < 6) {
      return NextResponse.json(
        { error: "ADMIN_PASSWORD must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const email = adminEmail.toLowerCase().trim();
    const hashedPassword = await hash(adminPassword, 12);

    const existing = await User.findOne({ email });

    if (existing) {
      existing.role = "admin";
      existing.password = hashedPassword;
      await existing.save();
      return NextResponse.json({
        message: "Existing user promoted to admin and password reset.",
        user: { id: existing._id, email: existing.email, role: existing.role },
      });
    }

    const admin = await User.create({
      name: "Admin",
      email,
      password: hashedPassword,
      role: "admin",
      plan: "business",
    });

    return NextResponse.json(
      {
        message: "Admin account created.",
        user: { id: admin._id, email: admin.email, role: admin.role },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Admin seed error:", msg, error);
    return NextResponse.json({ error: msg || "Something went wrong" }, { status: 500 });
  }
}
