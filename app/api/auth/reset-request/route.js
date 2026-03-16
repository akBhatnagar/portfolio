import { NextResponse } from "next/server";
import { getUserByEmail, createResetCode } from "@/lib/auth";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ success: true, message: "If the email exists, a reset code has been sent." });
    }

    const code = createResetCode(user.id);

    await sendEmail({
      to: email,
      subject: "Portfolio Admin - Password Reset Code",
      text: `Your password reset code is: ${code}\n\nThis code expires in 15 minutes.\n\nIf you did not request this, please ignore this email.`,
      html: `
        <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e40af;">Password Reset</h2>
          <p>Your password reset code is:</p>
          <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin: 16px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1e40af;">${code}</span>
          </div>
          <p style="color: #64748b; font-size: 14px;">This code expires in 15 minutes.</p>
          <p style="color: #64748b; font-size: 14px;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "If the email exists, a reset code has been sent." });
  } catch (error) {
    console.error("Reset request error:", error);
    return NextResponse.json({ error: "Failed to send reset code. Please try again." }, { status: 500 });
  }
}
