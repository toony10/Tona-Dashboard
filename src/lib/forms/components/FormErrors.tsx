"use client";

import { cn } from "@/lib/utils";

type FormErrorsProps = {
  errors?: string[];
  title?: string;
  className?: string;
};

export function FormErrors({ errors, title, className }: FormErrorsProps) {
  if (!errors?.length) {
    return null;
  }

  return (
    <div
      role="alert"
      className={cn(
        "rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive",
        className,
      )}
    >
      {title ? <p className="mb-1 font-medium">{title}</p> : null}
      <ul>
        {errors.map((error) => (
          <li key={error} className="text-sm text-black">
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
}
