"use client";

import * as React from "react";
import { useTopLoader } from "nextjs-toploader";

type RouterWithNavigation = {
  push: (...args: never[]) => unknown;
  replace: (...args: never[]) => unknown;
};

export function useRouterWithTopLoader<T extends RouterWithNavigation>(
  router: T,
): T {
  const loader = useTopLoader();

  const push = React.useCallback(
    (...args: Parameters<T["push"]>) => {
      loader.start();
      return router.push(...(args as Parameters<T["push"]>));
    },
    [loader, router],
  ) as T["push"];

  const replace = React.useCallback(
    (...args: Parameters<T["replace"]>) => {
      loader.start();
      return router.replace(...(args as Parameters<T["replace"]>));
    },
    [loader, router],
  ) as T["replace"];

  return { ...router, push, replace };
}
