export enum ItemType {
  Unknown = 0,
  Group = 1,
  Video = 2,
  Audio = 3,
  Image = 4
}

export interface Result {
  id:           number;
  name:         string;
  nsfw:         0 | 1;
  type:         ItemType;
  path?:        string;
  description?: string;
  thumbnail?:   string;
}

export type SearchResponse = Result[];

export type Item = Result & { 
  path: string;
}

export type Groups = Omit<Result, "type">;