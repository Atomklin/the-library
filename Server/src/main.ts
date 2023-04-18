import bodyParser from "body-parser";
import express from "express";

import { SearchRequest } from "./types";

const app = express();
const port = 6969;

app.use(bodyParser.json());

app.post("/api/search", (req, res) => {
  const request = req.params as SearchRequest;
  if (!request.query || !request.options) 
    return res.sendStatus(400);

  // Sample Content 
  return res.json({
    timestamp: new Date().toISOString(),
    results: [],
  });
});

app.listen(port, () => {
  console.log("Listening on port", port);
});


