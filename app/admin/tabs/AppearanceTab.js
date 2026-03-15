"use client";

import { useState, useEffect } from "react";

export default function AppearanceTab() {
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

  const handleThemeChange = async (themeKey) => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colorTheme: themeKey }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings((prev) => ({ ...prev, colorTheme: updated.colorTheme }));
        setMessage("Theme updated! Refresh the portfolio to see changes.");
        setTimeout(() => setMessage(""), 5000);
      }
    } catch (err) {
      console.error("Failed to update theme:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading appearance settings...</div>;
  }

  if (!settings) {
    return <div className="text-center py-12 text-red-500">Failed to load settings</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Color Theme</h2>
        {message && <span className="text-sm text-green-500">{message}</span>}
      </div>

      <p className="text-sm text-gray-500 dark:text-gray-400">
        Choose a color theme for your portfolio. The selected theme will apply to buttons, links, and accents across the site.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {settings.themes?.map((theme) => {
          const isActive = settings.colorTheme === theme.key;
          const rgbValues = theme.primary["600"];
          return (
            <button
              key={theme.key}
              onClick={() => handleThemeChange(theme.key)}
              disabled={saving}
              className={`relative p-4 rounded-lg border-2 transition ${
                isActive
                  ? "border-gray-900 dark:border-white ring-2 ring-offset-2 ring-gray-900 dark:ring-white dark:ring-offset-gray-800"
                  : "border-gray-200 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-400"
              }`}
            >
              <div
                className="w-full h-12 rounded-md mb-3"
                style={{ backgroundColor: `rgb(${rgbValues})` }}
              />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {theme.label}
              </span>
              {isActive && (
                <span className="absolute top-2 right-2 text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2 py-0.5 rounded-full">
                  Active
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
