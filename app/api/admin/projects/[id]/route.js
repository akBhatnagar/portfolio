import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { validateSession } from "@/lib/auth";
import { getProject, updateProject, deleteProject } from "@/lib/db";

async function authenticate() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  return validateSession(token);
}

export async function PUT(request, { params }) {
  const user = await authenticate();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const existing = getProject(Number(id));
    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, link, github_url, display_order } = body;

    if (!title || !description) {
      return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
    }

    const updated = updateProject(Number(id), {
      title,
      description,
      link,
      github_url,
      display_order: display_order ?? existing.display_order,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const user = await authenticate();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const existing = getProject(Number(id));
    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    deleteProject(Number(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
