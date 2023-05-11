import { randomUUID } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

import { downloadFFmpeg, downloadFFprobe, ffmpegPath, ffprobePath } from "../All-Purpose/ffmpeg";
import { generateGridThumbnail, GridThumnailCreatorOptions } from "../All-Purpose/thumnail";
import { pathToURLPathname, staticDir } from "./common";
import database from "./database";

export async function generateVideoThumbnails(options: Omit<GridThumnailCreatorOptions, "output"> = {}) {
  const thumbnailDir = join(staticDir, ".cache");

  if (!existsSync(thumbnailDir)) await mkdir(thumbnailDir);
  if (!existsSync(ffprobePath)) await downloadFFprobe();
  if (!existsSync(ffmpegPath)) await downloadFFmpeg();

  async function createThumbnails(table: string) {
    const inputs = database.prepare(
      "SELECT id, location FROM " + table +
      " WHERE type = 'Video' AND thumbnail IS NULL;"
    ).all() as { location: string, id: string }[];

    const update = database.prepare(
      "UPDATE " + table + " SET thumbnail = ? WHERE id = ?;"
    );

    for (const { location, id } of inputs) {
      try {
        const output = join(thumbnailDir, randomUUID() + ".png");
        await generateGridThumbnail(join(staticDir, location), { output, ...options });
        update.run(pathToURLPathname(output), id);
      } catch (e) {
        console.error(e);
      }
    }
  }
    
  await createThumbnails("indexed_items");
  await createThumbnails("grouped_items");

  database.exec(
    "UPDATE indexed_items " +
    "SET thumbnail = (" +
      "SELECT location FROM grouped_items g " +
      "WHERE g.group_id = indexed_items.id AND g.type = 'Image' " +
      "LIMIT 1" +
    ") WHERE type = 'Collection';"
  );
}
