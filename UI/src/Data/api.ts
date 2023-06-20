import type { ItemType, SearchResponse } from "./types";

export async function search(req: SearchRequest): Promise<SearchResponse> {
  const params = new URLSearchParams({
    safe_search: Number(req.safeSearch) || 0,
    query: req.query,
  })

  if (req.blacklist)
    params.append("blacklist", [...req.blacklist.values()].join(","))
  
  const url = "/api/search?" + params
  const res = await fetch(url, { method: "GET" });

  if (!res.ok) throw Error(`Status Code ${res.status} - ${res.statusText}`);
  return res.json();
}

interface SearchRequest {
  query: string;
  safeSearch?: boolean;
  blacklist?: Set<ItemType>;
}