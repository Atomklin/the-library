import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { downloadFFmpeg, downloadFFprobe, ffmpegPath, ffProbePath } from "../All-Purpose/ffmpeg";
import {
  generateGridThumbnail, GridThumbnailCreatorOptions
} from "../All-Purpose/thumbnail-creator";
import { databaseDir, pathToURLPathname, thumbnailDir } from "./common";
import database from "./database";
import { ItemType } from "./types";

export async function generateVideoThumbnails(options: Omit<GridThumbnailCreatorOptions, "output"> = {}) {
  if (!existsSync(thumbnailDir)) await mkdir(thumbnailDir);
  if (!existsSync(ffProbePath)) await downloadFFprobe();
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

  // Set thumbnail of the group to the first item in its collection with a thumbnail
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
