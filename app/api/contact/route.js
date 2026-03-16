import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await sendEmail({
      to: process.env.EMAIL_USER || "akshaybhatnagar1998@gmail.com",
      subject: `Portfolio Message from ${name}`,
      text: `You received a message from your portfolio contact form.\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #1e40af;">New Contact Form Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 16px 0;" />
          <p>${message.replace(/\n/g, "<br>")}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true, message: "Message sent!" });
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
