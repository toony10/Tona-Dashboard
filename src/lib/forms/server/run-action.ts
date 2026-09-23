import "server-only";

import { revalidatePath } from "next/cache";
import type { ApiResponse } from "@/lib/api/types";
import type { z } from "zod";

import type { ActionResult } from "../types";

export async function runAction<TInput, TData>(config: {
  schema: z.ZodType<TInput>;
  input: unknown;
  handler: (input: TInput) => Promise<ApiResponse<TData>>;
  revalidatePaths?: string[] | ((input: TInput) => string[]);
}): Promise<ActionResult<TData>> {
  try {
    const parsed = config.schema.safeParse(config.input);

    if (!parsed.success) {
      return {
        success: false,
        statusCode: 422,
        message: "Validation failed",
        errors: parsed.error.issues.map((issue) => issue.message),
      };
    }

    const result = await config.handler(parsed.data);

    if (result.success && config.revalidatePaths) {
      const paths =
        typeof config.revalidatePaths === "function"
          ? config.revalidatePaths(parsed.data)
          : config.revalidatePaths;

      for (const path of paths) {
        revalidatePath(path);
      }
    }

    return result;
  } catch {
    return {
      success: false,
      statusCode: 500,
      message: "Unexpected error",
      errors: [],
    };
  }
}
