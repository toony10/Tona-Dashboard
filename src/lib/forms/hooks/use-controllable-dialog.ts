import { useState } from "react";

export function useControllableDialog(
  open?: boolean,
  onOpenChange?: (next: boolean) => void,
) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined;

  return {
    open: isControlled ? open : internalOpen,
    setOpen: (next: boolean) => {
      if (isControlled) {
        onOpenChange?.(next);
        return;
      }

      setInternalOpen(next);
    },
  };
}
