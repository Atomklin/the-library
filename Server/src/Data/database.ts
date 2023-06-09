import Database from "better-sqlite3";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { databaseDir } from "./common";

const fullPath = join(databaseDir, "database.db");
const database = new Database(fullPath);

database.pragma("journal_mode = WAL"); // Performance improvement
database.pragma("synchronous = NORMAL");
database.pragma("foreign_keys = ON");

const sqlDir = join(__dirname, "..", "..", "sql");
const runSQL = (filename: string) => 
  database.exec(readFileSync(join(sqlDir, filename)).toString("utf8"));

runSQL("tables-setup.sql");
runSQL("triggers-setup.sql");

export default database;