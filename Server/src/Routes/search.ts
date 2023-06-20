import { Router } from "express";

import database from "../Data/database";

const router = Router();

router.get("/", (req, res) => {
  const query = "\""  + String(req.query.query).replace(/"/g, "\"\"") + "\"*";
  const safeSearch = Number(req.query.safe_search) || 1;
  const blacklist = req.query.blacklist;

  if (!query || !query.length) 
    return res.sendStatus(400);

  const safeSearchFilter = 
    "( CASE " +
      "WHEN fts_index.id > 0 THEN items.nsfw " +
      "ELSE groups.nsfw " +
    "END ) = 0 AND ";

  let results = database.prepare(
    "SELECT " +
      "ABS(fts_index.id) AS id, " +
      "fts_index.name, " +
      "fts_index.description, " +
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
    "LEFT JOIN items ON items.id = fts_index.id " +
    "LEFT JOIN groups ON groups.id = -fts_index.id " +
    "WHERE " + 
      (safeSearch ? safeSearchFilter : "") +
      "fts_index MATCH ? " +
    "ORDER BY rank;"
  ).all(query);

  if (blacklist) {
    const blackListedTypes = new Set(
      String(blacklist).split(",")
        .map((e) => parseInt(e))
    );

    results = results.filter((result: any) =>
      !blackListedTypes.has(result.type)
    );
  }

  res.json(results);
});


export default router;