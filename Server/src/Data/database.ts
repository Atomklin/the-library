import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const databaseDir = join(process.cwd(), process.env["DATABASE_DIR"].trim());
const fullpath = join(databaseDir, "database.db");
if (!existsSync(databaseDir)) 
  mkdirSync(databaseDir);


const database = new Database(fullpath);
database.pragma("journal_mode = WAL"); // Performance improvement
database.pragma("synchronous = NORMAL");
database.pragma("foreign_keys = ON");

database.exec(
  "CREATE TABLE IF NOT EXISTS indexed_items (" +
    "id           INTEGER PRIMARY KEY NOT NULL, " +
    "location     TEXT NOT NULL UNIQUE, " +
    "name         TEXT NOT NULL, " +
    "type         TEXT NOT NULL, " +
    "nsfw         INTEGER DEFAULT 0, " + // boolean 0 or 1
    "description  TEXT, " +
    "thumbnail    TEXT, " +
    "tags         TEXT" +
  ");"
);

database.exec(
  "CREATE TABLE IF NOT EXISTS grouped_items (" +
    "id        INTEGER PRIMARY KEY NOT NULL," +
    "location  TEXT NOT NULL UNIQUE, " +
    "group_id  INTEGER NOT NULL, " +
    "type      TEXT NOT NULL, " +
    "thumbnail TEXT, " +
    "FOREIGN KEY (group_id) " +
      "REFERENCES indexed_items (id) " +
        "ON DELETE CASCADE " +
        "ON UPDATE NO ACTION" +
  ");"
);

// Using Porter Stemming tokenizer 
// Info : https://www.sqlite.org/fts3.html#tokenizer
database.exec(
  "CREATE VIRTUAL TABLE IF NOT EXISTS fts_indexed_items "  +
  "USING fts5(id UNINDEXED, name, description, tags, tokenize=porter);"
);

// Index the data being inserted into indexed_items
database.exec(
  "CREATE TRIGGER IF NOT EXISTS after_indexed_items_insert " +
  "AFTER INSERT ON indexed_items " + 
  "BEGIN " +
    "INSERT INTO fts_indexed_items (" +
      "id, " +
      "name, " +
      "description, " +
      "tags" +
    ") VALUES (" +
      "NEW.id, " +
      "NEW.name, " +
      "NEW.description, " +
      "NEW.tags" +
    "); " +
  "END;"
);

// Update index table when original table is updated
database.exec(
  "CREATE TRIGGER IF NOT EXISTS after_indexed_items_update " +
  "AFTER UPDATE ON indexed_items " +
  "BEGIN " +
    "UPDATE fts_indexed_items "  +
    "SET " +
      "name = NEW.name, " +
      "description = NEW.description, " +
      "tags = NEW.tags " +
    "WHERE id = NEW.id; " +
  "END;"
);

// Delete index when the original row is deleted
database.exec(
  "CREATE TRIGGER IF NOT EXISTS after_indexed_items_delete " +
  "AFTER DELETE ON indexed_items " +
  "BEGIN " +
    "DELETE FROM fts_indexed_items " +
    "WHERE id = OLD.id; " +
  "END;"
);


export default database;