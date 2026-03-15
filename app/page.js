import { getAllContent, getProjects } from "@/lib/db";
import PortfolioClient from "@/components/PortfolioClient";

export const dynamic = "force-dynamic";

export default function PortfolioPage() {
  const siteContent = getAllContent();
  const projects = getProjects();

  return <PortfolioClient siteContent={siteContent} projects={projects} />;
}
