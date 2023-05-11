import { existsSync, statSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { join } from "node:path";

export async function crawlDir(directory: string) {
  const subdirectories = [directory];
  const fullPaths: string[] = [];
  let index = 0;

  do {
    const subdirectory = subdirectories[index];
    const dirents = await readdir(subdirectory, { withFileTypes: true });
    
    for (const dirent of dirents) {
      const fullPath = join(subdirectory, dirent.name);

      if (dirent.isDirectory())
        subdirectories.push(fullPath);
      else if (dirent.isFile())
        fullPaths.push(fullPath);
    }

    index++;
  } while (index < subdirectories.length);
  return fullPaths;
}


export function isDir(path: string) {
  return existsSync(path) && statSync(path).isDirectory();
}


export function assertFile(path: string) {
  if (!existsSync(path))
    throw Error(path + " does not exist");

  if (!statSync(path).isFile())
    throw Error(path + " is not a file");
}