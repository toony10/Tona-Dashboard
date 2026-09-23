"use client";

import * as React from "react";
import NextTopLoader from "nextjs-toploader";

export function TopLoader({
  color = "var(--primary)",
  height = 6,
  showSpinner = false,
  speed = 200,
  crawl = true,
  ...props
}: React.ComponentProps<typeof NextTopLoader>) {
  return (
    <NextTopLoader
      color={color}
      height={height}
      showSpinner={showSpinner}
      speed={speed}
      crawl={crawl}
      {...props}
    />
  );
}
