import type { SearchResponse } from "./types";

export async function search(query: string, options?: Record<string, any>) {
  const headers = new Headers();
  headers.set("Content-Type", "application/json");

  const res = await fetch("/api/search", {
    body: JSON.stringify({ query, options }),
    headers: headers,
    method: "POST",
  });
  
  const text = await res.text();
  if (res.status != 200) throw Error(`Status Code ${res.status} - ${res.statusText}`);
  if (!text) throw Error("Invalid Response from Server");

  return JSON.parse(text) as SearchResponse;
}