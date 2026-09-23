"use server";

import { cookies } from "next/headers";

import { getActionTranslations } from "@/i18n/get-action-translations";
import { setAuthCookies } from "@/lib/auth";
import type { ActionResult } from "@/lib/forms";
import { runAction } from "@/lib/forms/server";
import { login } from "@/services/auth";
import type { AuthUser } from "@/types/auth";
import { createLoginSchema } from "@/validations/auth";

export async function loginAction(
  input: unknown,
  locale: string,
): Promise<ActionResult<AuthUser>> {
  const t = await getActionTranslations(locale, "Auth.loginForm");
  const loginSchema = createLoginSchema(t);

  const result = await runAction({
    schema: loginSchema,
    input,
    handler: async (data) => {
      const response = await login(data);

      if (response.success && response.data) {
        const cookieStore = await cookies();
        setAuthCookies(
          cookieStore,
          response.data.accessToken,
          response.data.refreshToken,
        );
      }

      return response;
    },
  });

  if (result.success && result.data?.id && result.data.email) {
    return {
      success: result.success,
      statusCode: result.statusCode,
      message: result.message,
      data: {
        id: result.data.id,
        email: result.data.email,
        role: result.data.role,
        fullName: result.data.fullName ?? null,
        avatar: result.data.avatar ?? null,
      },
    };
  }

  return {
    success: result.success,
    statusCode: result.statusCode,
    message: result.message,
    errors: result.errors,
  };
}
