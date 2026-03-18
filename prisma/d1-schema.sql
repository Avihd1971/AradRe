-- D1 schema for AradRe
-- Run with: npm run d1:migrate  (remote) or npm run d1:migrate:local (local preview)

CREATE TABLE IF NOT EXISTS "Property" (
  "id"          TEXT    NOT NULL PRIMARY KEY,
  "title"       TEXT    NOT NULL,
  "price"       REAL    NOT NULL,
  "type"        TEXT    NOT NULL,
  "category"    TEXT    NOT NULL,
  "location"    TEXT    NOT NULL,
  "area"        REAL    NOT NULL,
  "bedrooms"    INTEGER,
  "bathrooms"   INTEGER,
  "description" TEXT    NOT NULL,
  "images"      TEXT    NOT NULL DEFAULT '[]',
  "status"      TEXT    NOT NULL DEFAULT 'ACTIVE',
  "featured"    INTEGER NOT NULL DEFAULT 0,
  "createdAt"   TEXT    NOT NULL DEFAULT (datetime('now')),
  "updatedAt"   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS "User" (
  "id"        TEXT NOT NULL PRIMARY KEY,
  "email"     TEXT NOT NULL UNIQUE,
  "password"  TEXT NOT NULL,
  "name"      TEXT,
  "createdAt" TEXT NOT NULL DEFAULT (datetime('now'))
);
