export interface SearchResponse {
  results: QueryResult[];
  timestamp: string;
}

export interface QueryResult {
  type: "Video" | "Audio" | "Image" | "Gallery" | "File"
  description?: string;
  thumbnail?: string;
  tags?: string[];
  title: string;
  id: string;
}