"use client";

import { useState, useEffect, useRef } from "react";

export default function AppearanceTab() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [hexInput, setHexInput] = useState("");
  const [iconPreview, setIconPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      if (res.ok) {
        const data = await res.json();
        setSettings(data);
        if (data.customColor) setHexInput(data.customColor);
      }
    } catch (err) {
      console.error("Failed to fetch settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 5000);
  };

  const handleThemeChange = async (themeKey) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ colorTheme: themeKey }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings((prev) => ({ ...prev, colorTheme: updated.colorTheme, customColor: null }));
        setHexInput("");
        showMessage("Theme updated! Refresh the portfolio to see changes.");
      }
    } catch (err) {
      console.error("Failed to update theme:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleCustomColor = async () => {
    const hex = hexInput.replace("#", "");
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) {
      showMessage("Enter a valid 6-digit hex color (e.g. #3b82f6)");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customColor: `#${hex}` }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings((prev) => ({ ...prev, colorTheme: updated.colorTheme, customColor: updated.customColor }));
        showMessage("Custom color applied! Refresh the portfolio to see changes.");
      }
    } catch (err) {
      console.error("Failed to set custom color:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleIconUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showMessage("File must be under 2MB");
      return;
    }

    setIconPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("icon", file);

      const res = await fetch("/api/admin/upload-icon", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        showMessage("Icon updated! Refresh the portfolio to see changes.");
      } else {
        const data = await res.json();
        showMessage(data.error || "Failed to upload icon");
        setIconPreview(null);
      }
    } catch (err) {
      console.error("Failed to upload icon:", err);
      showMessage("Failed to upload icon");
      setIconPreview(null);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading appearance settings...</div>;
  }

  if (!settings) {
    return <div className="text-center py-12 text-red-500">Failed to load settings</div>;
  }

  const isCustomActive = settings.colorTheme?.startsWith("custom:");

  return (
    <div className="space-y-10">
      {message && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      {/* Icon Upload */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Navbar Icon</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Upload a new image for the circular icon in the top-left of the navbar. PNG, JPG, WebP, or GIF under 2MB.
        </p>
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-gray-300 dark:ring-gray-600 shrink-0">
            <img
              src={iconPreview || `/api/icon?t=${Date.now()}`}
              alt="Current icon"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              onChange={handleIconUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                uploading
                  ? "bg-gray-300 dark:bg-gray-600 cursor-not-allowed text-gray-500"
                  : "bg-primary-600 text-white hover:bg-primary-700"
              }`}
            >
              {uploading ? "Uploading..." : "Upload New Icon"}
            </button>
          </div>
        </div>
      </div>

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Preset Themes */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Color Theme</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Pick a preset or enter a custom hex color. This applies to buttons, links, and accents across the site.
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

      <hr className="border-gray-200 dark:border-gray-700" />

      {/* Custom Hex Color */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Custom Color</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter any hex color to use as the primary accent. Lighter and darker shades will be generated automatically.
        </p>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="color"
              value={hexInput.startsWith("#") ? hexInput : `#${hexInput || "3b82f6"}`}
              onChange={(e) => setHexInput(e.target.value)}
              className="w-12 h-12 rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer bg-transparent"
            />
          </div>
          <input
            type="text"
            value={hexInput}
            onChange={(e) => setHexInput(e.target.value)}
            placeholder="#3b82f6"
            maxLength={7}
            className="w-32 px-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 transition"
          />
          <button
            onClick={handleCustomColor}
            disabled={saving || !hexInput}
            className={`px-4 py-2.5 rounded-lg text-sm font-medium text-white transition ${
              saving || !hexInput
                ? "bg-primary-400 cursor-not-allowed"
                : "bg-primary-600 hover:bg-primary-700"
            }`}
          >
            {saving ? "Applying..." : "Apply"}
          </button>
          {isCustomActive && (
            <span className="text-xs bg-gray-900 dark:bg-white text-white dark:text-gray-900 px-2.5 py-1 rounded-full">
              Custom Active
            </span>
          )}
        </div>
        {hexInput && /^#?[0-9a-fA-F]{6}$/.test(hexInput) && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">Preview:</span>
            <div className="flex gap-1">
              {[0.35, 0.15, 0, -0.2].map((mix, i) => {
                const labels = ["400", "500", "600", "700"];
                const hex = hexInput.replace("#", "");
                const r = parseInt(hex.substring(0, 2), 16);
                const g = parseInt(hex.substring(2, 4), 16);
                const b = parseInt(hex.substring(4, 6), 16);
                const t = mix >= 0 ? [255, 255, 255] : [0, 0, 0];
                const amt = Math.abs(mix);
                const mr = Math.round(r + (t[0] - r) * amt);
                const mg = Math.round(g + (t[1] - g) * amt);
                const mb = Math.round(b + (t[2] - b) * amt);
                return (
                  <div key={i} className="text-center">
                    <div
                      className="w-10 h-10 rounded-md"
                      style={{ backgroundColor: `rgb(${mr}, ${mg}, ${mb})` }}
                    />
                    <span className="text-[10px] text-gray-400">{labels[i]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
