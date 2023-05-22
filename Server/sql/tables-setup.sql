CREATE TABLE IF NOT EXISTS groups (
  id           INTEGER PRIMARY KEY,
  path         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  nsfw         INTEGER DEFAULT 0,
  description  TEXT,
  thumbnail    TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS items (
  id           INTEGER PRIMARY KEY,
  path         TEXT NOT NULL UNIQUE,
  name         TEXT NOT NULL,
  nsfw         INTEGER DEFAULT 0, 
  type         INTEGER NOT NULL DEFAULT 0,
  group_id     INTEGER,
  description  TEXT,
  thumbnail    TEXT,
  FOREIGN KEY (group_id)
    REFERENCES groups (id)
      ON DELETE CASCADE
      ON UPDATE NO ACTION
) STRICT;

/* 
  Using Porter Stemming tokenizer 
  Info : https://www.sqlite.org/fts3.html#tokenizer
*/
CREATE VIRTUAL TABLE IF NOT EXISTS fts_index 
USING fts5(id UNINDEXED, name, description, tokenize=porter);