import { z } from "zod";

/**
 * Optional form text: blank or whitespace-only input becomes `undefined` so JSON
 * bodies omit the key. Non-empty values are validated by `schema` (should use `.trim()`).
 */
export function optionalString<T extends z.ZodType<string, z.ZodTypeDef, string>>(
  schema: T,
) {
  return z
    .union([z.string(), z.undefined()])
    .transform((value) => {
      if (value === undefined) {
        return undefined;
      }

      const trimmed = value.trim();
      return trimmed === "" ? undefined : trimmed;
    })
    .pipe(z.union([schema, z.undefined()]));
}
