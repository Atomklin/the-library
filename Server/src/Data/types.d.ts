export interface File {
  readonly id: number;
  name: string;
  type: "Video" | "Gallery";
  nsfw: 0 | 1;
  description?: string;
  thumbnail?: string;
  tags?: string;
}

export interface Gallery {
  readonly id: number;
  page_num: number;
  location: string;
  size?: number;
}

export interface Video {
  readonly id: number;
  location: string;
  duration_ms?: number;
  size?: number;
}


declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_DIR?: string;
      HOST_NAME?: string;
      PORT?: string;
    }
  } 
}