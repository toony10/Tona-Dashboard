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
    <div role="alert" className={ cn("text-sm text-destructive", className) }>
      { title ? <p className="mb-1 font-bold underline">{ title }</p> : null }
      <ul>
        { errors.map((error) => (
          <li key={ error } className="flex items-center gap-2">
            <span
              aria-hidden
              className="mt-1.5 size-1.5 shrink-0 rounded-full bg-current"
            />
            { error }
          </li>
        )) }
      </ul>
    </div>
  );
}
