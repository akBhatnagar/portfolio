import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/auth";
import { getContent, setContent } from "@/lib/db";
import { getAllThemes } from "@/lib/themes";

async function authenticate() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  return validateSession(token);
}

export async function GET() {
  const user = await authenticate();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const showGithubLinks = getContent("show_github_links") ?? false;
    const colorTheme = getContent("color_theme") || "blue";
    const themes = getAllThemes();

    return NextResponse.json({ showGithubLinks, colorTheme, themes });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request) {
  const user = await authenticate();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    if (body.showGithubLinks !== undefined) {
      setContent("show_github_links", !!body.showGithubLinks);
    }

    if (body.colorTheme) {
      const validThemes = getAllThemes().map((t) => t.key);
      if (!validThemes.includes(body.colorTheme)) {
        return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
      }
      setContent("color_theme", body.colorTheme);
    }

    const showGithubLinks = getContent("show_github_links") ?? false;
    const colorTheme = getContent("color_theme") || "blue";

    return NextResponse.json({ showGithubLinks, colorTheme });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
