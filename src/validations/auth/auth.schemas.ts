import { z } from "zod";

type LoginTranslate = (
  key:
    | "validation.emailRequired"
    | "validation.emailInvalid"
    | "validation.passwordRequired",
) => string;

export function createLoginSchema(t: LoginTranslate) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, t("validation.emailRequired"))
      .email(t("validation.emailInvalid")),
    password: z.string().min(1, t("validation.passwordRequired")),
  });
}

export type LoginInput = z.infer<ReturnType<typeof createLoginSchema>>;
