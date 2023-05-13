import { Router } from "express";

import database from "../Data/database";
import { IndexedItem } from "../Data/types";

const router = Router();

router.get("/", (req, res) => {
  const params = req.query;
  const query = String(params.query);
  const safeSearch = Number(params.safe_search) || 1;

  if (!query || !query.length) 
    return res.sendStatus(400);

  const raw = database.prepare(
    "SELECT * FROM indexed_items f " +
    "INNER JOIN fts_indexed_items i ON i.id = f.id " +
    "WHERE " +
      "fts_indexed_items MATCH ? " + 
      (safeSearch ?  "AND f.nsfw = 0 " : "") +
    "ORDER BY " +
      "bm25(fts_indexed_items, ?, ?, ?) " +
    "LIMIT ?;"
  ).all(
    query, 
    Number(params.name_weight) || 1,
    Number(params.description_weight) || 5,
    Number(params.tags_weight) || 4,
    Number(params.limit) || 25
  ) as IndexedItem[]; 

  res.json(raw.map(({ tags, ...others }) => ({
    tags: tags ? tags.split(/ +/g) : [],
    ...others
  })));
});


export default router;