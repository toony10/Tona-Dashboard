export type UrlSearchParamValue = string | string[] | undefined;

export type UrlSearchParams = Record<string, UrlSearchParamValue>;

export type UrlSearchParamsInput = UrlSearchParams | Promise<UrlSearchParams>;

export type UrlParamSpec =
  | "string"
  | "number"
  | { type: "string"; default?: string }
  | { type: "number"; default?: number };

export type UrlParamsSpec = Record<string, UrlParamSpec>;

type InferUrlParam<S extends UrlParamSpec> = S extends {
  type: "number";
  default: number;
}
  ? number
  : S extends "number" | { type: "number" }
    ? number | undefined
    : S extends { type: "string"; default: string }
      ? string
      : string | undefined;

export type InferUrlParams<T extends UrlParamsSpec> = {
  [K in keyof T]: InferUrlParam<T[K]>;
};

export const listUrlParams = {
  page: { type: "number", default: 1 },
  limit: { type: "number", default: 10 },
  search: "string",
} as const satisfies UrlParamsSpec;

function firstSearchParam(value: UrlSearchParamValue) {
  const raw = Array.isArray(value) ? value[0] : value;
  const trimmed = raw?.trim();
  return trimmed ? trimmed : undefined;
}

function parseNumber(value: string | undefined) {
  if (value == null) {
    return undefined;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return undefined;
  }

  return parsed;
}

function resolveSpec(spec: UrlParamSpec): {
  type: "string" | "number";
  defaultValue?: string | number;
} {
  if (typeof spec === "string") {
    return { type: spec };
  }

  return { type: spec.type, defaultValue: spec.default };
}

export async function getUrlParams<const T extends UrlParamsSpec>(
  searchParams: UrlSearchParamsInput,
  spec: T,
): Promise<InferUrlParams<T>> {
  const params = await searchParams;
  const result = {} as InferUrlParams<T>;

  for (const key of Object.keys(spec) as Array<keyof T & string>) {
    const { type, defaultValue } = resolveSpec(spec[key]);
    const raw = firstSearchParam(params[key]);

    if (type === "number") {
      const parsed = parseNumber(raw);
      result[key] = (
        parsed == null ? defaultValue : parsed
      ) as InferUrlParams<T>[typeof key];
      continue;
    }

    result[key] = (raw ?? defaultValue) as InferUrlParams<T>[typeof key];
  }

  return result;
}
