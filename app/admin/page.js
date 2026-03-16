"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import ContentTab from "./tabs/ContentTab";
import ProjectsTab from "./tabs/ProjectsTab";
import AppearanceTab from "./tabs/AppearanceTab";
import SettingsTab from "./tabs/SettingsTab";

const TABS = [
  { id: "content", label: "Content" },
  { id: "projects", label: "Projects" },
  { id: "appearance", label: "Appearance" },
  { id: "settings", label: "Settings" },
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("content");
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      router.push("/admin-login");
    }
  }, [router]);

  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      timeout = setTimeout(handleLogout, 30 * 60 * 1000);
    };

    const events = ["mousedown", "keydown", "scroll", "touchstart"];
    events.forEach((e) => window.addEventListener(e, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, [handleLogout]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
            >
              View Site →
            </a>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="text-sm px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex space-x-1 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition ${
                activeTab === tab.id
                  ? "bg-primary-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          {activeTab === "content" && <ContentTab />}
          {activeTab === "projects" && <ProjectsTab />}
          {activeTab === "appearance" && <AppearanceTab />}
          {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
}
