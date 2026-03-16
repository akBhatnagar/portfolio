const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(process.cwd(), "portfolio.db");

let _db = null;

function getDb() {
  if (_db) return _db;

  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");

  _db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      last_active TEXT DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS reset_codes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
      code TEXT NOT NULL,
      expires_at TEXT NOT NULL,
      used INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      link TEXT,
      github_url TEXT,
      display_order INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS site_content (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  seed(_db);
  return _db;
}

function seed(db) {
  const hasContent = db.prepare("SELECT COUNT(*) as count FROM site_content").get();
  if (hasContent.count === 0) {
    const insert = db.prepare("INSERT OR IGNORE INTO site_content (key, value) VALUES (?, ?)");
    const seedTx = db.transaction(() => {
      insert.run("home_title", JSON.stringify("Hi, I'm Akshay Bhatnagar"));
      insert.run("home_subtitle", JSON.stringify("Full Stack Developer based in Milton Keynes, UK 🚀\nI build modern, responsive, and performant web applications."));
      insert.run("about_paragraphs", JSON.stringify([
        "I am Akshay Bhatnagar, a passionate Full Stack Developer based in Milton Keynes, UK. I specialize in building responsive and scalable web applications with React, Node.js, and modern web technologies.",
        "With a strong background in software engineering and problem-solving, I love transforming ideas into elegant digital solutions.",
        "When I'm not coding, I enjoy exploring new technologies, contributing to open source, and learning about design."
      ]));
      insert.run("color_theme", JSON.stringify("blue"));
      insert.run("show_github_links", JSON.stringify(false));
    });
    seedTx();
  }

  const hasProjects = db.prepare("SELECT COUNT(*) as count FROM projects").get();
  if (hasProjects.count === 0) {
    const insertProject = db.prepare(
      "INSERT INTO projects (title, description, link, github_url, display_order) VALUES (?, ?, ?, ?, ?)"
    );
    const projectsTx = db.transaction(() => {
      insertProject.run("Portfolio Website", "A modern portfolio website built with React and Tailwind CSS showcasing my skills and projects.", "https://akshaybhatnagar.in", "https://github.com/akBhatnagar/portfolio", 0);
      insertProject.run("Task Manager App", "A full-stack task manager app with user authentication, built using MERN stack.", "https://comingsoon.akshaybhatnagar.in", "", 1);
      insertProject.run("E-commerce Store", "An online store prototype built with React and Stripe for payments integration.", "https://comingsoon.akshaybhatnagar.in", "", 2);
      insertProject.run("To-Do Application", "A simple and efficient to-do app to organize tasks by groups, built with React, Express, and SQLite.", "https://todo.akshaybhatnagar.in/", "https://github.com/akBhatnagar/ToDo_App", 3);
    });
    projectsTx();
  }
}

function getContent(key) {
  const db = getDb();
  const row = db.prepare("SELECT value FROM site_content WHERE key = ?").get(key);
  return row ? JSON.parse(row.value) : null;
}

function setContent(key, value) {
  const db = getDb();
  db.prepare("INSERT OR REPLACE INTO site_content (key, value) VALUES (?, ?)").run(key, JSON.stringify(value));
}

function getAllContent() {
  const db = getDb();
  const rows = db.prepare("SELECT key, value FROM site_content").all();
  const result = {};
  for (const row of rows) {
    result[row.key] = JSON.parse(row.value);
  }
  return result;
}

function getProjects() {
  const db = getDb();
  return db.prepare("SELECT * FROM projects ORDER BY display_order ASC").all();
}

function getProject(id) {
  const db = getDb();
  return db.prepare("SELECT * FROM projects WHERE id = ?").get(id);
}

function createProject({ title, description, link, github_url }) {
  const db = getDb();
  const maxOrder = db.prepare("SELECT MAX(display_order) as max_order FROM projects").get();
  const nextOrder = (maxOrder.max_order ?? -1) + 1;
  const result = db.prepare(
    "INSERT INTO projects (title, description, link, github_url, display_order) VALUES (?, ?, ?, ?, ?)"
  ).run(title, description, link || "", github_url || "", nextOrder);
  return getProject(result.lastInsertRowid);
}

function updateProject(id, { title, description, link, github_url, display_order }) {
  const db = getDb();
  db.prepare(
    "UPDATE projects SET title = ?, description = ?, link = ?, github_url = ?, display_order = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(title, description, link || "", github_url || "", display_order ?? 0, id);
  return getProject(id);
}

function deleteProject(id) {
  const db = getDb();
  db.prepare("DELETE FROM projects WHERE id = ?").run(id);
}

function reorderProjects(orderedIds) {
  const db = getDb();
  const stmt = db.prepare("UPDATE projects SET display_order = ? WHERE id = ?");
  const tx = db.transaction(() => {
    orderedIds.forEach((id, index) => stmt.run(index, id));
  });
  tx();
}

module.exports = {
  getDb,
  getContent,
  setContent,
  getAllContent,
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  reorderProjects,
};
