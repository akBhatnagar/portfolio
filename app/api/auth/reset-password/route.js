import { NextResponse } from "next/server";
import {
  validateResetToken,
  consumeResetToken,
  hashPassword,
  updateUserPassword,
  deleteAllUserSessions,
} from "@/lib/auth";

export async function POST(request) {
  try {
    const { resetToken, password, confirmPassword } = await request.json();

    if (!resetToken || !password || !confirmPassword) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const result = validateResetToken(resetToken);
    if (!result) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    const hash = await hashPassword(password);
    updateUserPassword(result.userId, hash);
    consumeResetToken(result.recordId);
    deleteAllUserSessions(result.userId);

    return NextResponse.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
