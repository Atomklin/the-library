import { existsSync, mkdirSync } from "node:fs";
import { isAbsolute, join, relative } from "node:path";

export const databaseDir = getEnvAbsolutePath("DATABASE_DIR");
export const filesDir = getEnvAbsolutePath("FILES_DIR");
export const thumbnailDir = join(filesDir, ".thumbnail");

if (!existsSync(databaseDir)) 
  mkdirSync(databaseDir);

if (!existsSync(filesDir))
  throw Error(filesDir + " does not exist.");

/** Converts Windows path into a url pathname that the webserver can use */
export function pathToURLPathname(path: string) {
  return "/files/" + relative(filesDir, path)
    .replace(/\\+/g, "/");
}


function getEnvAbsolutePath(env: string) {
  const value = (process.env[env] as string).trim();
  if (!value) throw Error("Missing Path: " + env);
  if (isAbsolute(value)) return value;
  else return join(process.cwd(), value);
}