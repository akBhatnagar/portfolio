import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/auth";
import { getAllContent, setContent } from "@/lib/db";

async function authenticate() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  return validateSession(token);
}

export async function GET() {
  const user = await authenticate();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const content = getAllContent();
    return NextResponse.json(content);
  } catch (error) {
    console.error("Get content error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  const user = await authenticate();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    const allowedKeys = ["home_title", "home_subtitle", "about_paragraphs", "color_theme", "show_github_links"];

    for (const [key, value] of Object.entries(body)) {
      if (!allowedKeys.includes(key)) {
        return NextResponse.json({ error: `Invalid key: ${key}` }, { status: 400 });
      }
      setContent(key, value);
    }

    const updated = getAllContent();
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update content error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
