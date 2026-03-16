"use client";

import { useState, useEffect } from "react";

export default function ContentTab() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch("/api/admin/content");
      if (res.ok) {
        const data = await res.json();
        setContent(data);
      }
    } catch (err) {
      console.error("Failed to fetch content:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          home_title: content.home_title,
          home_subtitle: content.home_subtitle,
          about_paragraphs: content.about_paragraphs,
        }),
      });

      if (res.ok) {
        setMessage("Content saved successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error("Failed to save:", err);
      setMessage("Failed to save content.");
    } finally {
      setSaving(false);
    }
  };

  const updateParagraph = (index, value) => {
    setContent((prev) => {
      const updated = [...prev.about_paragraphs];
      updated[index] = value;
      return { ...prev, about_paragraphs: updated };
    });
  };

  const addParagraph = () => {
    setContent((prev) => ({
      ...prev,
      about_paragraphs: [...prev.about_paragraphs, ""],
    }));
  };

  const removeParagraph = (index) => {
    setContent((prev) => ({
      ...prev,
      about_paragraphs: prev.about_paragraphs.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading content...</div>;
  }

  if (!content) {
    return <div className="text-center py-12 text-red-500">Failed to load content</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Site Content</h2>
        {message && (
          <span className={`text-sm ${message.includes("Failed") ? "text-red-500" : "text-green-500"}`}>
            {message}
          </span>
        )}
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Home Title
          </label>
          <input
            type="text"
            value={content.home_title || ""}
            onChange={(e) => setContent({ ...content, home_title: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Home Subtitle
          </label>
          <textarea
            rows={3}
            value={content.home_subtitle || ""}
            onChange={(e) => setContent({ ...content, home_subtitle: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 transition resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">Use line breaks for multiple lines</p>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              About Paragraphs
            </label>
            <button
              onClick={addParagraph}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              + Add paragraph
            </button>
          </div>
          <div className="space-y-3">
            {content.about_paragraphs?.map((para, i) => (
              <div key={i} className="flex gap-2">
                <textarea
                  rows={3}
                  value={para}
                  onChange={(e) => updateParagraph(i, e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 transition resize-none"
                  placeholder={`Paragraph ${i + 1}`}
                />
                {content.about_paragraphs.length > 1 && (
                  <button
                    onClick={() => removeParagraph(i)}
                    className="self-start px-3 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    title="Remove paragraph"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2.5 rounded-lg text-white font-medium transition ${
            saving ? "bg-primary-400 cursor-not-allowed" : "bg-primary-600 hover:bg-primary-700"
          }`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
