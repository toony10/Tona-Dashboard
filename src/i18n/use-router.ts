"use client";

import { createNavigation } from "next-intl/navigation";

import { useRouterWithTopLoader } from "@/hooks/use-router-with-top-loader";

import { routing } from "./routing";

const { useRouter: useI18nRouter } = createNavigation(routing);

export function useRouter() {
  return useRouterWithTopLoader(useI18nRouter());
}
