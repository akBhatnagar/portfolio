"use client";

import { useState, useEffect } from "react";

export default function SettingsTab() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) setSettings(await res.json());
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleGithub = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showGithubLinks: !settings.showGithubLinks }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings((prev) => ({ ...prev, showGithubLinks: updated.showGithubLinks }));
        setMessage("Setting updated!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error("Failed to update setting:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading settings...</div>;
  }

  if (!settings) {
    return <div className="text-center py-12 text-red-500">Failed to load settings</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Settings</h2>
        {message && <span className="text-sm text-green-500">{message}</span>}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">Show GitHub Links</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Display GitHub repository links on project tiles in the public portfolio
            </p>
          </div>
          <button
            onClick={handleToggleGithub}
            disabled={saving}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
              settings.showGithubLinks ? "bg-primary-600" : "bg-gray-300 dark:bg-gray-600"
            }`}
            role="switch"
            aria-checked={settings.showGithubLinks}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                settings.showGithubLinks ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
