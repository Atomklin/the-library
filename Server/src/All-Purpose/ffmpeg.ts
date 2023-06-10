import { gotScraping } from "got-scraping";
import { chmodSync, createWriteStream, existsSync, mkdirSync } from "node:fs";
import { arch, platform } from "node:os";
import { join } from "node:path";
import { pipeline } from "node:stream/promises";

const sys = `${platform()}-${arch()}`;
const ext = platform() == "win32" ? ".exe" : "";
const binDir = join(__dirname, "..", "..", "bin");

function getFullPath(name: string) {
  return join(binDir, name + "-" + sys + ext);
}

async function downloadBinary(repo: string, name: string)  {
  const fullPath = getFullPath(name);
  
  if (!existsSync(binDir)) mkdirSync(binDir);
  if (existsSync(fullPath))
    return fullPath;
  
  const api = "https://api.github.com/repos";
  const url = `${api}/${repo}/contents/platforms/${sys}`;
  const info = await gotScraping(url).json<File[]>();

  const regex = new RegExp(name, "i");
  const dlLink = info.find((e) => regex.test(e.name))?.download_url;
  if (!dlLink) throw Error(`${name} pre-compiled binary not found for ${sys}`);

  await pipeline(
    gotScraping.stream(dlLink),
    createWriteStream(fullPath)
  );

  chmodSync(fullPath, 0o755);
  return fullPath;
}

interface File {
  name: string;
  download_url: string;
}


export const ffProbePath = process.env["FFPROBE"] ?? getFullPath("ffprobe");
export const ffmpegPath = process.env["FFMPEG"] ?? getFullPath("ffmpeg");

export const downloadFFprobe = () => 
  downloadBinary("SavageCore/node-ffprobe-installer", "ffprobe");

export const downloadFFmpeg = () => 
  downloadBinary("kribblo/node-ffmpeg-installer", "ffmpeg");
