import { ChildProcessWithoutNullStreams, spawn } from "node:child_process";
import { existsSync, statSync } from "node:fs";

import { ffmpegPath, ffProbePath } from "./ffmpeg";

export async function generateGridThumbnail(path: string, options: GridThumbnailCreatorOptions) {
  if (!existsSync(path)) 
    throw Error(path + " does not exist");

  if (!statSync(path).isFile()) 
    throw Error(path + " is not a file");

  const totalFrames = await countVideoFrames(path);

  const height = options.height ?? 1080;
  const columns = options.columns ?? 6;
  const rows = options.rows ?? 5;

  const totalThumbnails = Math.floor(totalFrames / (columns * rows));
  const videoFilter = 
    `select='not(mod(n, ${totalThumbnails}))', ` +
    `scale=-1:${Math.floor(height / rows)}, ` +
    `tile=${columns}x${rows}`;

  const ffmpeg = spawn(ffmpegPath, [
    "-loglevel",  "fatal",
    "-i",          path,
    "-vf",         videoFilter,
    "-frames:v",  "1",
    "-y",          options.output
  ], { stdio: "pipe" });
  
  await promisifyChildProcess(ffmpeg);
}


export async function countVideoFrames(path: string) {
  const ffProbe = spawn(ffProbePath, [
    "-loglevel",       "fatal", 
    "-count_frames",      
    "-select_streams", "v", // Select the video stream
    "-show_entries",   "stream=nb_frames", // Only show nb_frames of stream
    "-print_format",   "default=nokey=1:noprint_wrappers=1", // Removes key and [STREAM] wrapper
    path
  ], { stdio: "pipe" });

  const output = await promisifyChildProcess(ffProbe);
  return parseInt(output);
}


function promisifyChildProcess(child: ChildProcessWithoutNullStreams) {
  return new Promise<string>((resolve, reject) => {
    let data = "";
    let error = "";
    
    child.stdout.on("data", (c) => data += c);
    child.stderr.on("data", (c) => error += c);

    child.once("error", (e) => {
      child.removeAllListeners();
      reject(e);
    });
    
    child.once("close", (code) => {
      child.stderr.removeAllListeners();
      child.stdout.removeAllListeners();

      if (code != 0) 
        return reject(
          new Error(`Child Ended with ${code} : ${error}`)
        );

      resolve(data);
    });
  });
}


export interface GridThumbnailCreatorOptions {
  output:   string;
  columns?: number;
  rows?:    number;
  height?:  number;
}
