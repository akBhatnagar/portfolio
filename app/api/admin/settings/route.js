import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/auth";
import { getContent, setContent } from "@/lib/db";
import { getAllThemes, isCustomTheme, getCustomHex } from "@/lib/themes";

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
    const customColor = isCustomTheme(colorTheme) ? getCustomHex(colorTheme) : null;
    const navbarIcon = getContent("navbar_icon") || null;

    return NextResponse.json({ showGithubLinks, colorTheme, themes, customColor, navbarIcon });
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
      const validPresets = getAllThemes().map((t) => t.key);
      if (validPresets.includes(body.colorTheme)) {
        setContent("color_theme", body.colorTheme);
      } else {
        return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
      }
    }

    if (body.customColor) {
      const hex = body.customColor.replace("#", "");
      if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
        return NextResponse.json({ error: "Invalid hex color" }, { status: 400 });
      }
      setContent("color_theme", `custom:#${hex}`);
    }

    const showGithubLinks = getContent("show_github_links") ?? false;
    const colorTheme = getContent("color_theme") || "blue";
    const customColor = isCustomTheme(colorTheme) ? getCustomHex(colorTheme) : null;

    return NextResponse.json({ showGithubLinks, colorTheme, customColor });
  } catch (error) {
    console.error("Update settings error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
