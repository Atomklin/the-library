import express from "express";

import search from "./Routes/search";

const app = express();
const port = 6969;

app.disable("x-powered-by");
app.use("/api/search", search);

app.listen(port, () => 
  console.log("Listenting to http://localhost:" + port + "/api")
);