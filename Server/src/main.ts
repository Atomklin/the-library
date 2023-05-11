import express from "express";

import { indexStaticDirectory } from "./Data/crawler";
import { generateVideoThumbnails } from "./Data/thumbnailer";
import search from "./Routes/search";

const app = express();
const port = 6969;

app.disable("x-powered-by");
app.use("/api/search", search);


void async function() {
  await indexStaticDirectory();
  await generateVideoThumbnails();
  
  app.listen(port, () => 
    console.log("Listening to http://localhost:6969/api")
  );
}();
