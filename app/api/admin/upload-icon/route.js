import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/auth";
import { setContent } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

async function authenticate() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  return validateSession(token);
}

export async function POST(request) {
  const user = await authenticate();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await request.formData();
    const file = formData.get("icon");

    if (!file || typeof file === "string") {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: "Only PNG, JPEG, WebP, and GIF are allowed" }, { status: 400 });
    }

    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ error: "File must be under 2MB" }, { status: 400 });
    }

    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const filename = `icon.${ext}`;
    const uploadDir = path.join(process.cwd(), "data", "uploads");

    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, filename), buffer);

    setContent("navbar_icon", filename);

    return NextResponse.json({ success: true, filename });
  } catch (error) {
    console.error("Upload icon error:", error);
    return NextResponse.json({ error: "Failed to upload icon" }, { status: 500 });
  }
}
