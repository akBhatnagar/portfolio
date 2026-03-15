import { NextResponse } from "next/server";
import { verifyResetCode } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 });
    }

    const result = verifyResetCode(email, code);
    if (!result) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 400 });
    }

    return NextResponse.json({ success: true, resetToken: result.resetToken });
  } catch (error) {
    console.error("Reset verify error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
