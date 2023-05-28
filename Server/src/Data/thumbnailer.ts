import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { downloadFFmpeg, downloadFFprobe, ffmpegPath, ffprobePath } from "../All-Purpose/ffmpeg";
import { generateGridThumbnail, GridThumnailCreatorOptions } from "../All-Purpose/thumnail";
import { databaseDir, pathToURLPathname, thumbnailDir } from "./common";
import database, { ItemType } from "./database";

export async function generateVideoThumbnails(options: Omit<GridThumnailCreatorOptions, "output"> = {}) {
  if (!existsSync(thumbnailDir)) await mkdir(thumbnailDir);
  if (!existsSync(ffprobePath)) await downloadFFprobe();
  if (!existsSync(ffmpegPath)) await downloadFFmpeg();

  const itemPaths = database.prepare(
    "SELECT path FROM items " +
    "WHERE thumbnail IS NULL AND type = ?;"
  ).all(ItemType.Video) as { path: string }[];

  const insertThumbnail = database.prepare(
    "UPDATE items SET thumbnail = ? " +
    "WHERE path = ?;"
  );

  for (const { path } of itemPaths) {
    const input = join(databaseDir, path);
    const output = join(thumbnailDir, randomUUID() + ".png");

    try {
      await generateGridThumbnail(input, { output, ...options });  
      insertThumbnail.run(pathToURLPathname(output), path);
    } catch (e) {
      console.error(e);
    }
  }

  // Set Image Thumbnails to their path
  database.prepare(
    "UPDATE items SET thumbnail = path " +
    "WHERE thumbnail IS NULL AND type = ?;"
  ).run(ItemType.Image);

  // Set thumbnail of groups to the first item on the group's thumbnail
  database.prepare(
    "UPDATE groups SET thumbnail = (" +
      "SELECT thumbnail FROM items " +
      "INNER JOIN item_group_mapping ON item_group_mapping.item_id = items.id " + 
      "WHERE item_group_mapping.group_id = groups.id " +
        "AND items.thumbnail IS NOT NULL " +
      "LIMIT 1" +
    ");"
  ).run();
}
