import { Router } from "express";

import database from "../Data/database";
import { File } from "../Data/types";

const router = Router();
router.get("/", (req, res) => {
  const params = req.query;
  const query = String(params.query);
  const safeSearch = Number(params.safe_search) || 0;

  if (!query || !query.length) 
    return res.sendStatus(400);

  const results = database.prepare(
    "SELECT * FROM files f " +
    "INNER JOIN files_index i ON i.id = f.id " +
    "WHERE " +
      "files_index MATCH ? " + 
      (safeSearch ?  "AND f.nsfw = 0 " : "") +
    "ORDER BY " +
      "bm25(files_index, ?, ?, ?) " +
    "LIMIT ?;"
  ).all(
    query, 
    Number(params.name_weight) || 1,
    Number(params.description_weight) || 5,
    Number(params.tags_weight) || 4,
    Number(params.limit) || 25,
  ) as File[];

  res.json(results);
});


export default router;