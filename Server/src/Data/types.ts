export enum ItemType {
  Unknown = 0,
  Group = 1,
  Video = 2,
  Audio = 3,
  Image = 4
}

export interface Item {
  id:           number;
  path:         string;
  type:         ItemType,
  name:         string;
  nsfw:         0 | 1;
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

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_DIR: string;
      FILES_DIR: string;
      
      FFPROBE?: string;
      FFMPEG?: string;
    }
  } 
}