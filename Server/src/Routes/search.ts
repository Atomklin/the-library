import { Router } from "express";

import database from "../Data/database";
import { Result } from "../Data/types";

const router = Router();
const parse = (req: any) => ({
  safeSearch: Number(req.query.safe_search) || 1,
  query: String(req.query.query)
});


router.get("/", (req, res) => {
  const { query, safeSearch } = parse(req);

  if (!query || !query.length) 
    return res.sendStatus(400);

  const safeSearchFilter = 
    "( CASE " +
      "WHEN fts_index.id > 0 THEN items.nsfw " +
      "ELSE groups.nsfw " +
    "END ) = 0 AND ";

  const results = database.prepare(
    "SELECT " +
      "ABS(fts_index.id) AS id, " +
      "fts_index.name, " +
      "fts_index.description, " +
      "items.group_id, " +
      "CASE " +
        "WHEN fts_index.id > 0 THEN items.type " +
        "ELSE 1 " +
      "END AS type, " +
      "CASE " +
        "WHEN fts_index.id > 0 THEN items.thumbnail " +
        "ELSE groups.thumbnail " +
      "END AS thumbnail, " +
      "CASE " +
        "WHEN fts_index.id > 0 THEN items.path " +
        "ELSE groups.path " +
      "END AS path " +
    "FROM fts_index " +
    "INNER JOIN items ON items.id = fts_index.id " +
    "INNER JOIN groups ON groups.id = -fts_index.id " +
    "WHERE " + 
      (safeSearch ? safeSearchFilter : "") +
      "fts_index MATCH ?;"
  ).all(query) as Result[];

  res.json(results);
});


// Groups only search
router.get("/groups", (req, res) => {
  const { query, safeSearch } = parse(req);

  if (!query || !query.length) 
    return res.sendStatus(400);

  const results = database.prepare(
    "SELECT * " +
    "FROM fts_index " +
    "INNER JOIN groups ON groups.id = -fts_index.id " +
    "WHERE "  +
      (safeSearch ? "nsfw = 0 AND " : "") +
      "fts_index MATCH ?;"
  ).all(query);

  res.json(results);
});


// Items only search
router.get("/items", (req, res) => {
  const { query, safeSearch } = parse(req);

  if (!query || !query.length)
    return res.sendStatus(400);

  const results = database.prepare(
    "SELECT * " +
    "FROM fts_index " +
    "INNER JOIN items ON items.id = fts_index.id " +
    "WHERE " +
      (safeSearch ? "nsfw = 0 AND " : "") +
      "fts_index MATCH ?;"
  ).all(query);

  res.json(results);
});

export default router;