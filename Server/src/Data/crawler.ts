import { mkdir, readdir } from "node:fs/promises";
import { join, normalize, parse } from "node:path";

import { crawlDir, isDir } from "../All-Purpose/filesystem";
import { pathToURLPathname, staticDir } from "./common";
import database from "./database";
import { ItemType } from "./types";

/** Crawls the static directory and saves the indexes to the database */
export async function indexStaticDirectory() {
  if (!isDir(staticDir)) 
    return mkdir(staticDir);

  const dirents = await readdir(staticDir, { withFileTypes: true });
  const insertToIndex = database.prepare(
    "INSERT OR IGNORE INTO indexed_items (" +
      "location, name, type" +
    ") VALUES (?, ?, ?);"
  );

  const insertToGroup = database.prepare(
    "INSERT OR IGNORE INTO grouped_items (" +
      "group_id, location, type" +
    ") VALUES ((SELECT id FROM indexed_items WHERE location = ?), ?, ?);"
  );

  const insertGroupedItem = database.transaction((dir: string, files: string[]) => {
    const pathname = pathToURLPathname(dir);
    insertToIndex.run(
      pathname,
      normalize(parse(dir).name),
      "Collection"
    );

    for (const file of files.sort())
      insertToGroup.run(
        pathname,
        pathToURLPathname(file),
        resolveType(file)
      );
  });

  for (const dirent of dirents) {
    if (/^\.cache/.test(dirent.name)) 
      continue;

    const fullPath = join(staticDir, dirent.name);
    if (dirent.isFile()) 
      insertToIndex.run(
        pathToURLPathname(fullPath),
        normalize(parse(dirent.name).name),
        resolveType(dirent.name)
      );
    
    else if (dirent.isDirectory()) {
      const files = await crawlDir(fullPath);
      insertGroupedItem(fullPath, files);
    }
  }
}


const videoExtension = new Set(["mp4", "mov", "wmv", "webm", "avi", "flv", "mkv", "mts"]);
const imageExtension = new Set(["png", "avif", "gif", "jpg", "jpeg", "svg", "webp"]);
const audioExtension = new Set(["wav", "mp3", "aac", "aacp", "ogg", "flac"]);

export function resolveType(path: string): ItemType {
  const ext = parse(path).ext.substring(1);
  
  if (videoExtension.has(ext)) return "Video";
  if (imageExtension.has(ext)) return "Image";
  if (audioExtension.has(ext)) return "Audio";
  return "Unknown";
}