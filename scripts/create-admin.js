#!/usr/bin/env node

const readline = require("readline");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "portfolio.db");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log("\n=== Portfolio Admin User Setup ===\n");

  const username = await ask("Username: ");
  const email = await ask("Email: ");
  const password = await ask("Password (min 8 chars): ");

  if (!username || !email || !password) {
    console.error("\nAll fields are required.");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("\nPassword must be at least 8 characters.");
    process.exit(1);
  }

  const db = new Database(DB_PATH);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);

  const existing = db.prepare("SELECT id FROM admin_users WHERE username = ? OR email = ?").get(username, email);
  if (existing) {
    const overwrite = await ask("\nUser already exists. Overwrite password? (y/N): ");
    if (overwrite.toLowerCase() !== "y") {
      console.log("Aborted.");
      process.exit(0);
    }
    const hash = await bcrypt.hash(password, 12);
    db.prepare("UPDATE admin_users SET password_hash = ?, email = ? WHERE username = ? OR email = ?")
      .run(hash, email, username, email);
    console.log("\nAdmin user updated successfully!");
  } else {
    const hash = await bcrypt.hash(password, 12);
    db.prepare("INSERT INTO admin_users (username, email, password_hash) VALUES (?, ?, ?)")
      .run(username, email, hash);
    console.log("\nAdmin user created successfully!");
  }

  console.log(`  Username: ${username}`);
  console.log(`  Email: ${email}`);
  console.log(`\nYou can now log in at /admin-login\n`);

  rl.close();
  db.close();
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
