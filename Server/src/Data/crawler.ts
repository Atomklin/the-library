import { readdir } from "node:fs/promises";
import { join, parse, relative, sep } from "node:path";

import { filesDir, pathToURLPathname, thumbnailDir } from "./common";
import database, { ItemType } from "./database";

/** Crawls the `FILES_DIR` directory and saves the indexes to the database */
export async function indexFilesDirectory() {
  const insertGroup = database.prepare(
    "INSERT OR IGNORE INTO groups (" +
      "path, name" +
    ") VALUES (?, ?);"
  );

  const insertItemGroupMap = database.prepare(
    "INSERT OR IGNORE INTO item_group_mapping (" +
      "item_id, group_id" +
    ") VALUES (" + 
      "(SELECT id FROM items  WHERE path = ?), " +
      "(SELECT id FROM groups WHERE path = ?));"
  );

  const insertItem = database.prepare(
    "INSERT OR IGNORE INTO items (" +
      "path, name, type" +
    ") VALUES (?, ?, ?);"
  );


  const subdirectoryQueue: string[] = [filesDir];
  const indexFile = database.transaction((path: string) => {
    const itemPath = pathToURLPathname(path);
    const { dir, ext, name } = parse(path);

    insertItem.run(
      itemPath, name, 
      resolveType(ext.substring(1))
    );
    
    // Directories are considered groups, and every directory
    // a file is part of is considered a group it's part of.
    const directories = relative(filesDir, dir).split(sep);
    let currentDirectory = "/files";
    
    for (const directory of directories) {
      if (!directory.length) return;

      currentDirectory += "/" + directory;
      insertGroup.run(currentDirectory, directory);
      insertItemGroupMap.run(itemPath, currentDirectory);
    }
  });
  

  do {
    const subdirectory = subdirectoryQueue.shift()!;
    const dirent = await readdir(subdirectory, { withFileTypes: true });

    for (const elem of dirent) {
      const fullPath = join(subdirectory, elem.name);

      if (fullPath == thumbnailDir) continue;
      if (elem.isDirectory())
        subdirectoryQueue.push(fullPath);
      else if (elem.isFile()) 
        indexFile(fullPath);
    }

  } while (subdirectoryQueue.length);
}


// Most common file extensions
const videoExtensions = new Set(["mp4", "mov", "wmv", "webm", "avi", "flv", "mkv", "mts"]);
const imageExtensions = new Set(["png", "avif", "gif", "jpg", "jpeg", "svg", "webp"]);
const audioExtensions = new Set(["wav", "mp3", "aac", "aacp", "ogg", "flac"]);

export function resolveType(ext: string) {
  if (videoExtensions.has(ext)) return ItemType.Video;
  if (imageExtensions.has(ext)) return ItemType.Image;
  if (audioExtensions.has(ext)) return ItemType.Audio;
  return ItemType.Unknown;
}