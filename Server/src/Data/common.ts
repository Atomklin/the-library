import { existsSync, mkdirSync } from "node:fs";
import { join, relative } from "node:path";

export const dataDir = join(
  process.cwd(), 
  process.env["DATA_DIR"].trim()
);

if (!existsSync(dataDir)) 
  mkdirSync(dataDir);

/** Converts Windows path into a url pathname that the webserver can use */
export function pathToURLPathname(path: string) {
  return "/" + relative(dataDir, path)
    .replace(/\\+/g, "/");
}


export function normalize(input: string) {
  return input.replace(/^[a-zA-Z0-9]+/g, " ").trim();
}