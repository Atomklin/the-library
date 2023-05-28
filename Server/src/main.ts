import express from "express";

import { indexFilesDirectory } from "./Data/crawler";
import { generateVideoThumbnails } from "./Data/thumbnailer";
import search from "./Routes/search";

const app = express();
const port = 6969;

app.disable("x-powered-by");
app.use("/api/search", search);


void async function() {
  await indexFilesDirectory();
  await generateVideoThumbnails();
  
  app.listen(port, () => 
    console.log("Listening to http://localhost:6969/api")
  );
}();
