import { ItemType } from "./database";

export interface Item {
  id:           number;
  path:         string;
  type:         ItemType,
  name:         string;
  nsfw:         0 | 1;
  group_id:     number;
  description?: string;
  thumbnail?:   string;
}

export interface Groups {
  id:           number;
  name:         string;
  nsfw:         0 | 1;
  description?: string;
  thumbnail?:   string;
}

export type Result = Item;

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATA_DIR: string;
      
      FFPROBE?: string;
      FFMPEG?: string;
    }
  } 
}