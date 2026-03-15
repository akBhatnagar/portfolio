const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { getDb } = require("./db");

const SESSION_DURATION_MS = 30 * 60 * 1000; // 30 minutes

async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function createSession(userId) {
  const db = getDb();
  const token = crypto.randomBytes(32).toString("hex");
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_DURATION_MS);

  db.prepare(
    "INSERT INTO sessions (id, user_id, last_active, expires_at) VALUES (?, ?, ?, ?)"
  ).run(token, userId, now.toISOString(), expiresAt.toISOString());

  return token;
}

function validateSession(token) {
  if (!token) return null;
  const db = getDb();
  const session = db.prepare(
    "SELECT s.*, u.username, u.email FROM sessions s JOIN admin_users u ON s.user_id = u.id WHERE s.id = ?"
  ).get(token);

  if (!session) return null;

  const now = new Date();
  const lastActive = new Date(session.last_active);
  const inactiveMs = now.getTime() - lastActive.getTime();

  if (inactiveMs > SESSION_DURATION_MS) {
    db.prepare("DELETE FROM sessions WHERE id = ?").run(token);
    return null;
  }

  const newExpiry = new Date(now.getTime() + SESSION_DURATION_MS);
  db.prepare(
    "UPDATE sessions SET last_active = ?, expires_at = ? WHERE id = ?"
  ).run(now.toISOString(), newExpiry.toISOString(), token);

  return { userId: session.user_id, username: session.username, email: session.email };
}

function deleteSession(token) {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE id = ?").run(token);
}

function deleteAllUserSessions(userId) {
  const db = getDb();
  db.prepare("DELETE FROM sessions WHERE user_id = ?").run(userId);
}

function getUserByUsername(username) {
  const db = getDb();
  return db.prepare("SELECT * FROM admin_users WHERE username = ?").get(username);
}

function getUserByEmail(email) {
  const db = getDb();
  return db.prepare("SELECT * FROM admin_users WHERE email = ?").get(email);
}

function updateUserPassword(userId, passwordHash) {
  const db = getDb();
  db.prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?").run(passwordHash, userId);
}

function createResetCode(userId) {
  const db = getDb();
  db.prepare("UPDATE reset_codes SET used = 1 WHERE user_id = ? AND used = 0").run(userId);

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  db.prepare(
    "INSERT INTO reset_codes (user_id, code, expires_at) VALUES (?, ?, ?)"
  ).run(userId, code, expiresAt.toISOString());

  return code;
}

function verifyResetCode(email, code) {
  const db = getDb();
  const user = getUserByEmail(email);
  if (!user) return null;

  const record = db.prepare(
    "SELECT * FROM reset_codes WHERE user_id = ? AND code = ? AND used = 0 ORDER BY id DESC LIMIT 1"
  ).get(user.id, code);

  if (!record) return null;

  const now = new Date();
  if (now > new Date(record.expires_at)) {
    db.prepare("UPDATE reset_codes SET used = 1 WHERE id = ?").run(record.id);
    return null;
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  db.prepare("UPDATE reset_codes SET used = 1 WHERE id = ?").run(record.id);

  const tokenExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes to use reset token
  db.prepare(
    "INSERT INTO reset_codes (user_id, code, expires_at, used) VALUES (?, ?, ?, 0)"
  ).run(user.id, resetToken, tokenExpiry.toISOString());

  return { resetToken, userId: user.id };
}

function validateResetToken(resetToken) {
  const db = getDb();
  const record = db.prepare(
    "SELECT * FROM reset_codes WHERE code = ? AND used = 0 ORDER BY id DESC LIMIT 1"
  ).get(resetToken);

  if (!record) return null;

  const now = new Date();
  if (now > new Date(record.expires_at)) {
    db.prepare("UPDATE reset_codes SET used = 1 WHERE id = ?").run(record.id);
    return null;
  }

  return { userId: record.user_id, recordId: record.id };
}

function consumeResetToken(recordId) {
  const db = getDb();
  db.prepare("UPDATE reset_codes SET used = 1 WHERE id = ?").run(recordId);
}

module.exports = {
  hashPassword,
  verifyPassword,
  createSession,
  validateSession,
  deleteSession,
  deleteAllUserSessions,
  getUserByUsername,
  getUserByEmail,
  updateUserPassword,
  createResetCode,
  verifyResetCode,
  validateResetToken,
  consumeResetToken,
};
