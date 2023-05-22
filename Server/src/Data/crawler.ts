import { existsSync } from "node:fs";
import { mkdir, readdir } from "node:fs/promises";
import { join, normalize, parse } from "node:path";

import { crawlDir } from "../All-Purpose/filesystem";
import { dataDir, pathToURLPathname } from "./common";
import database, { ItemType } from "./database";

/** Crawls the "files" directory and saves the indexes to the database */
export async function indexStaticDirectory() {
  const dir = join(dataDir, "files");
  if (!existsSync(dir))
    return mkdir(dir);

  const dirents = await readdir(dir, { withFileTypes: true });
  const insertItem = database.prepare(
    "INSERT OR IGNORE INTO items (" +
      "path, name, type" +
    ") VALUES (?, ?, ?);"
  );

  const insertItemWithGroupId = database.prepare(
    "INSERT OR IGNORE INTO items ("   +
      "path, name, type, group_id" +
    ") VALUES (?, ?, ?, (SELECT id FROM groups WHERE path = ?));"
  );

  const insertGroup = database.prepare(
    "INSERT OR IGNORE INTO groups (" +
      "path, name" +
    ") VALUES (?, ?);"
  );


  const insertCollection = database.transaction((dir: string, files: string[]) => {
    insertGroup.run(
      pathToURLPathname(dir), 
      normalize(parse(dir).name)
    );

    for (const file of files) 
      insertItemWithGroupId.run(
        pathToURLPathname(file),
        normalize(parse(file).name),
        resolveType(file),
        dir
      );
  });

  for (const dirent of dirents) {
    if (/\.cache/.test(dirent.name)) 
      continue;

    const fullpath = join(dir, dirent.name);
    if (dirent.isFile()) 
      insertItem.run(
        pathToURLPathname(fullpath),
        normalize(parse(dirent.name).name),
        resolveType(dirent.name)
      );

    else if (dirent.isDirectory()) {
      const files = await crawlDir(fullpath);
      insertCollection(fullpath, files);
    }
  }
}


const videoExtension = new Set(["mp4", "mov", "wmv", "webm", "avi", "flv", "mkv", "mts"]);
const imageExtension = new Set(["png", "avif", "gif", "jpg", "jpeg", "svg", "webp"]);
const audioExtension = new Set(["wav", "mp3", "aac", "aacp", "ogg", "flac"]);

export function resolveType(path: string) {
  const ext = parse(path).ext.substring(1);
  
  if (videoExtension.has(ext)) return ItemType.Video;
  if (imageExtension.has(ext)) return ItemType.Image;
  if (audioExtension.has(ext)) return ItemType.Audio;
  return ItemType.Unknown;
}