import type { SearchResponse } from "./types";

export async function search(query: string, safeSearch?: boolean, args?: string): Promise<SearchResponse> {
  const options: Record<string, string> = { 
    // Store boolean as number
    safe_search: Number(safeSearch).toString() 
  };

  if (args) {
    const regex = /([a-zA-Z_]+)=([\w]+)/g
    const matches = args.matchAll(regex);
    for (const [, key, value] of matches)
      options[key] = value;
  }

  const params = new URLSearchParams({
    ...options,
    query
  })

  const url = "/api/search?" + params
  const res = await fetch(url, { method: "GET" });
  if (!res.ok) 
    throw Error(`Status Code ${res.status} - ${res.statusText}`);

  return res.json();
}