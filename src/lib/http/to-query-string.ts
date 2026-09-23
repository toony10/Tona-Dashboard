export type QueryParamPrimitive = string | number | boolean;

export type QueryParamValue =
  | QueryParamPrimitive
  | null
  | undefined
  | ReadonlyArray<QueryParamPrimitive | null | undefined>;

export type QueryParams = Record<string, QueryParamValue>;

function appendValue(
  search: URLSearchParams,
  key: string,
  value: QueryParamPrimitive,
): void {
  search.append(key, String(value));
}

export function toQueryString(params?: QueryParams | null): string {
  if (!params) {
    return "";
  }

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") {
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        if (item == null || item === "") {
          continue;
        }
        appendValue(search, key, item);
      }
      continue;
    }

    appendValue(search, key, value as QueryParamPrimitive);
  }

  const query = search.toString();
  return query ? `?${query}` : "";
}
