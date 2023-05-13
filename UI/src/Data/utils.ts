/**
 * Parses `key=value;` into a `Record`
 */
export function parseKeyValuePairs(input: string) {
  if (!input) return null;

  const options: Record<string, string> = {};
  const regex = /([a-zA-Z_]+)=([\w]+)/g
  const matches = input.matchAll(regex);

  for (const [, key, value] of matches) 
    options[key] = value;
    
  return options;
}