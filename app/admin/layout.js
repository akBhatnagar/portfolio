import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { validateSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard | Portfolio",
};

export default async function AdminLayout({ children }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;
  const user = validateSession(token);

  if (!user) {
    redirect("/admin-login");
  }

  return <>{children}</>;
}
