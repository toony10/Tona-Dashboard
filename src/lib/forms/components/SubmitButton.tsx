"use client";

import { Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
  loadingLabel?: string;
};

export function SubmitButton({
  loading = false,
  loadingLabel,
  disabled,
  children,
  className,
  ...props
}: SubmitButtonProps) {
  return (
    <Button
      type="submit"
      disabled={disabled || loading}
      className={"cursor-pointer group " + cn(className)}
      {...props}
    >
      {loading ? (
        <>
          <Loader2Icon className="size-4 animate-spin transition-transform group-hover:translate-x-0.5" />
          {loadingLabel ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  );
}
