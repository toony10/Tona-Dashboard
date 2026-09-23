"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { useRouterWithTopLoader } from "@/hooks/use-router-with-top-loader";

import type { ActionResult } from "../types";

type UseConfirmActionOptions<TInput, TData> = {
  action: (input: TInput) => Promise<ActionResult<TData>>;
  onSuccess?: (result: ActionResult<TData>) => void;
  redirectTo?: string;
};

export function useConfirmAction<TInput, TData = null>({
  action,
  onSuccess,
  redirectTo,
}: UseConfirmActionOptions<TInput, TData>) {
  const router = useRouterWithTopLoader(useRouter());
  const [isPending, setIsPending] = useState(false);
  const [serverErrors, setServerErrors] = useState<string[]>([]);

  const execute = useCallback(
    async (input: TInput) => {
      setServerErrors([]);
      setIsPending(true);

      try {
        const result = await action(input);

        if (result.success) {
          toast.success(result.message);
          router.refresh();
          onSuccess?.(result);

          if (redirectTo) {
            router.push(redirectTo);
          }

          return result;
        }

        toast.error(result.message);
        setServerErrors(result.errors ?? []);
        return result;
      } finally {
        setIsPending(false);
      }
    },
    [action, onSuccess, redirectTo, router],
  );

  return {
    execute,
    isPending,
    serverErrors,
    clearServerErrors: () => setServerErrors([]),
  };
}
