import { join, relative } from "node:path";

export const staticDir = join(
  process.cwd(), 
  process.env["STATIC_DIR"].trim()
);


/** Converts Windows path into a url pathname that the webserver can use */
export function pathToURLPathname(path: string) {
  return "/" + relative(staticDir, path)
    .replace(/\\+/g, "/");
}


export function normalize(input: string) {
  return input.replace(/^[a-zA-Z0-9]+/g, " ").trim();
}