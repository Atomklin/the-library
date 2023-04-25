import express from "express";

import search from "./Routes/search";

const hostname = process.env["HOST_NAME"] ?? "127.0.0.1";
const port = process.env["PORT"] 
  ? parseInt(process.env["PORT"])
  : 6969;

const app = express();

app.disable("x-powered-by");
app.use("/api/search", search);

app.listen(port, hostname, () => 
  console.log("Listenting to http://localhost:" + port + "/api")
);
