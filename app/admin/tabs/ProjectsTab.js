"use client";

import { useState, useEffect } from "react";

const emptyProject = { title: "", description: "", link: "", github_url: "" };

export default function ProjectsTab() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyProject);
  const [showAdd, setShowAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      if (res.ok) setProjects(await res.json());
    } catch (err) {
      console.error("Failed to fetch projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleAdd = async () => {
    if (!form.title || !form.description) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const project = await res.json();
        setProjects((prev) => [...prev, project]);
        setForm(emptyProject);
        setShowAdd(false);
        showMessage("Project added!");
      }
    } catch (err) {
      console.error("Failed to add project:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (id) => {
    if (!form.title || !form.description) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const updated = await res.json();
        setProjects((prev) => prev.map((p) => (p.id === id ? updated : p)));
        setEditingId(null);
        setForm(emptyProject);
        showMessage("Project updated!");
      }
    } catch (err) {
      console.error("Failed to update project:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        showMessage("Project deleted!");
      }
    } catch (err) {
      console.error("Failed to delete project:", err);
    }
  };

  const moveProject = async (index, direction) => {
    const newProjects = [...projects];
    const swapIndex = index + direction;
    if (swapIndex < 0 || swapIndex >= newProjects.length) return;
    [newProjects[index], newProjects[swapIndex]] = [newProjects[swapIndex], newProjects[index]];
    setProjects(newProjects);

    try {
      await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorder: true, orderedIds: newProjects.map((p) => p.id) }),
      });
    } catch (err) {
      console.error("Failed to reorder:", err);
    }
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      description: project.description,
      link: project.link || "",
      github_url: project.github_url || "",
    });
    setShowAdd(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setShowAdd(false);
    setForm(emptyProject);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500 dark:text-gray-400">Loading projects...</div>;
  }

  const renderForm = (onSubmit, submitLabel) => (
    <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 transition"
            placeholder="Project title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live Link</label>
          <input
            type="url"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 transition"
            placeholder="https://..."
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description *</label>
        <textarea
          rows={2}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 transition resize-none"
          placeholder="Brief description"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">GitHub URL</label>
        <input
          type="url"
          value={form.github_url}
          onChange={(e) => setForm({ ...form, github_url: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-600 transition"
          placeholder="https://github.com/..."
        />
      </div>
      <div className="flex gap-2">
        <button
          onClick={onSubmit}
          disabled={saving || !form.title || !form.description}
          className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition ${
            saving || !form.title || !form.description
              ? "bg-primary-400 cursor-not-allowed"
              : "bg-primary-600 hover:bg-primary-700"
          }`}
        >
          {saving ? "Saving..." : submitLabel}
        </button>
        <button
          onClick={cancelEdit}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Projects ({projects.length})</h2>
        <div className="flex items-center gap-3">
          {message && <span className="text-sm text-green-500">{message}</span>}
          {!showAdd && !editingId && (
            <button
              onClick={() => { setShowAdd(true); setForm(emptyProject); }}
              className="text-sm px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition"
            >
              + Add Project
            </button>
          )}
        </div>
      </div>

      {showAdd && renderForm(handleAdd, "Add Project")}

      <div className="space-y-3">
        {projects.map((project, index) => (
          <div key={project.id}>
            {editingId === project.id ? (
              renderForm(() => handleUpdate(project.id), "Save Changes")
            ) : (
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => moveProject(index, -1)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 text-sm"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveProject(index, 1)}
                    disabled={index === projects.length - 1}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 disabled:opacity-30 text-sm"
                  >
                    ▼
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{project.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{project.description}</p>
                  <div className="flex gap-4 mt-1 text-xs text-gray-400">
                    {project.link && <span className="truncate">🔗 {project.link}</span>}
                    {project.github_url && <span className="truncate">🐙 {project.github_url}</span>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => startEdit(project)}
                    className="px-3 py-1.5 text-sm rounded-lg text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="px-3 py-1.5 text-sm rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {projects.length === 0 && !showAdd && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          No projects yet. Add one to get started.
        </div>
      )}
    </div>
  );
}
