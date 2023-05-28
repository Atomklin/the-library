CREATE TABLE IF NOT EXISTS groups (
  id           INTEGER PRIMARY KEY,
  name         TEXT NOT NULL,
  nsfw         INTEGER DEFAULT 0,
  path         TEXT UNIQUE,
  description  TEXT,
  thumbnail    TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS item_group_mapping (
  item_id      INTEGER NOT NULL,
  group_id     INTEGER NOT NULL,
  PRIMARY KEY (item_id, group_id),
  FOREIGN KEY (group_id) REFERENCES groups (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  FOREIGN KEY (item_id)  REFERENCES items  (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) STRICT;

CREATE TABLE IF NOT EXISTS items (
  id           INTEGER PRIMARY KEY,
  name         TEXT NOT NULL,
  nsfw         INTEGER DEFAULT 0, 
  type         INTEGER NOT NULL DEFAULT 0,
  path         TEXT NOT NULL UNIQUE,
  description  TEXT,
  thumbnail    TEXT
) STRICT;

CREATE TABLE IF NOT EXISTS item_metadata (
  id             INTEGER PRIMARY KEY,
  size           INTEGER,
  creation_date  TEXT,
  md5_checksum   TEXT
) STRICT;

/* 
  Using Porter Stemming tokenizer 
  Info : https://www.sqlite.org/fts3.html#tokenizer
*/
CREATE VIRTUAL TABLE IF NOT EXISTS fts_index 
USING fts5(id UNINDEXED, name, description, tokenize=porter);