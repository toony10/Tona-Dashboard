"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  useForm,
  type DefaultValues,
  type FieldValues,
} from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import type { ActionResult } from "../types";

type UseCrudFormOptions<
  TSchema extends z.ZodType<FieldValues, z.ZodTypeDef, FieldValues>,
  TData,
> = {
  schema: TSchema;
  defaultValues?: DefaultValues<z.infer<TSchema>>;
  action: (values: z.infer<TSchema>) => Promise<ActionResult<TData>>;
  onSuccess?: (result: ActionResult<TData>) => void;
  resetOnSuccess?: boolean;
};

export function useCrudForm<
  TSchema extends z.ZodType<FieldValues, z.ZodTypeDef, FieldValues>,
  TData = null,
>({
  schema,
  defaultValues,
  action,
  onSuccess,
  resetOnSuccess = true,
}: UseCrudFormOptions<TSchema, TData>) {
  const router = useRouter();
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const form = useForm<z.infer<TSchema>>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setServerErrors([]);

    const result = await action(values);

    if (result.success) {
      toast.success(result.message);
      router.refresh();

      if (resetOnSuccess) {
        form.reset(defaultValues);
      }

      onSuccess?.(result);
      return;
    }

    toast.error(result.message);
    setServerErrors(result.errors ?? []);
  });

  return {
    form,
    onSubmit,
    serverErrors,
    clearServerErrors: () => setServerErrors([]),
    isSubmitting: form.formState.isSubmitting,
  };
}
