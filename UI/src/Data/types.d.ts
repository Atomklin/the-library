export type SearchResponse = Item[];

export type ItemType = "Collection" | "Video" | "Image" | "Audio" | "Unknown";

interface BaseItem {
  id:         string;
  location:   string;
  thumbnail?: string;
  type:       ItemType;
}

export type Item = BaseItem & {
  nsfw:         0 | 1;
  name:         string;
  description?: string;
  tags:         string[];
}

export type CollectionItem = BaseItem & {
  group_id: number;
}

export type VisibleModal = 
  "search-options" | 
  "video-player";