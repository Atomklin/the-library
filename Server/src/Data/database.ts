import Database from "better-sqlite3";
import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const databaseDir = process.env["DATABASE_DIR"] ?? join(__dirname, "..", "..", "database");
const fullpath = join(databaseDir, "database.db");
if (!existsSync(databaseDir)) 
  mkdirSync(databaseDir);


const database = new Database(fullpath);
database.pragma("journal_mode = WAL"); // Performance improvement
database.pragma("synchronous = NORMAL");
database.pragma("foreign_keys = ON");

database.exec(
  "CREATE TABLE IF NOT EXISTS files (" +
    "id           INTEGER PRIMARY KEY NOT NULL, " +
    "name         TEXT NOT NULL, " +
    "type         TEXT NOT NULL, " +
    "nsfw         INTEGER DEFAULT 0, " + // boolean 0 or 1
    "description  TEXT, " +
    "thumbnail    TEXT, " +
    "tags         TEXT" +
  ");"
);

database.exec(
  "CREATE TABLE IF NOT EXISTS galleries (" +
    "id        INTEGER NOT NULL, " +
    "page_num  INTEGER NOT NULL, " +
    "location  TEXT NOT NULL, " +
    "size      INTEGER, " +
    "PRIMARY KEY (id, page_num), " +
    "FOREIGN KEY (id) " +
      "REFERENCES files (id) " +
        "ON DELETE CASCADE " +
        "ON UPDATE NO ACTION" +
  ");"
);

database.exec(
  "CREATE TABLE IF NOT EXISTS videos (" +
    "id           INTEGER PRIMARY KEY, " + 
    "location     TEXT NOT NULL, " +
    "duration_ms  INTEGER, " +
    "size         INTEGER, " +
    "FOREIGN KEY (id) " +
      "REFERENCES files (id) " +
      "ON DELETE CASCADE " +
      "ON UPDATE NO ACTION" +
  ");"
);

// Using Porter Stemming tokenizer 
// Info : https://www.sqlite.org/fts3.html#tokenizer
database.exec(
  "CREATE VIRTUAL TABLE IF NOT EXISTS files_index "  +
  "USING fts5(id UNINDEXED, name, description, tags, tokenize=porter);"
);

// Index the data being inserted into files
database.exec(
  "CREATE TRIGGER IF NOT EXISTS after_files_insert " +
  "AFTER INSERT ON files " + 
  "BEGIN " +
    "INSERT INTO files_index (" +
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
  "CREATE TRIGGER IF NOT EXISTS after_files_update " +
  "AFTER UPDATE ON files " +
  "BEGIN " +
    "UPDATE files_index "  +
    "SET " +
      "name = NEW.name, " +
      "description = NEW.description, " +
      "tags = NEW.tags " +
    "WHERE id = NEW.id; " +
  "END;"
);

// Delete index when the original row is deleted
database.exec(
  "CREATE TRIGGER IF NOT EXISTS after_files_delete " +
  "AFTER DELETE ON files " +
  "BEGIN " +
    "DELETE FROM files_index " +
    "WHERE id = OLD.id; " +
  "END;"
);


export default database;