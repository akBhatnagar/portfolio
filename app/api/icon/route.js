import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { getContent } from "@/lib/db";

export const dynamic = "force-dynamic";

const MIME_TYPES = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
};

export async function GET() {
  try {
    const iconFilename = getContent("navbar_icon");

    if (iconFilename) {
      const iconPath = path.join(process.cwd(), "data", "uploads", iconFilename);
      try {
        const buffer = await readFile(iconPath);
        const ext = iconFilename.split(".").pop().toLowerCase();
        return new NextResponse(buffer, {
          headers: {
            "Content-Type": MIME_TYPES[ext] || "image/png",
            "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
          },
        });
      } catch {
        // Uploaded file missing, fall through to default
      }
    }

    const defaultPath = path.join(process.cwd(), "public", "memoji.png");
    const buffer = await readFile(defaultPath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Icon serve error:", error);
    return NextResponse.json({ error: "Icon not found" }, { status: 404 });
  }
}
