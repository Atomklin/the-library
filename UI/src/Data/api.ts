import type { SearchResponse } from "./types";

export async function search(query: string, options?: Record<string, string>): Promise<SearchResponse> {
  const params = new URLSearchParams({ query, ...options })
  const url = "/api/search?" + params

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) throw Error(`Status Code ${res.status} - ${res.statusText}`);

  return res.json();
}