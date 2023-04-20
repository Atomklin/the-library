export type SearchResponse = Result[];
export interface Result {
  type: "Video" | "Audio" | "Image" | "Gallery" | "File"
  description: string;
  thumbnail: string;
  tags: string[];
  title: string;
  id: string;
}