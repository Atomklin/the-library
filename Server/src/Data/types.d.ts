export type ItemType = "Collection" | "Video" | "Image" | "Audio" | "Unknown";

interface BaseItem {
  id:         string;
  location:   string;
  thumbnail?: string;
  type:       ItemType;
}

export type IndexedItem = BaseItem & {
  nsfw:         0 | 1;
  description?: string;
  tags?:        string;
}

export type GroupedItem = BaseItem & {
  group_id: number;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_DIR: string;
      STATIC_DIR: string;

      FFPROBE?: string;
      FFMPEG?: string;
    }
  } 
}