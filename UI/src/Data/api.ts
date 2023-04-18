import type { SearchResponse } from "./types";

export async function search(query: string, options?: Record<string, any>) {
  const res = await fetch("/api/search", {
    body: JSON.stringify({ query, options }),
    method: "POST",
  });
  
  const text = await res.text();
  return JSON.parse(text) as SearchResponse;
}