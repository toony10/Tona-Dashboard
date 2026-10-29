"use client";

import { useCallback, useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  formDialogContentClassName,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { useControllableDialog } from "../hooks/use-controllable-dialog";
import type { CrudDialogProps } from "../types";

type FormDialogRenderProps = {
  onClose: () => void;
  formKey: number;
};

type FormDialogProps = CrudDialogProps & {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: (props: FormDialogRenderProps) => React.ReactNode;
  className?: string;
  isPending?: boolean;
};

export function FormDialog({
  title,
  description,
  children,
  trigger,
  open,
  onOpenChange,
  className,
  isPending = false,
}: FormDialogProps) {
  const { open: dialogOpen, setOpen } = useControllableDialog(open, onOpenChange);
  const [formKey, setFormKey] = useState(0);

  const onClose = useCallback(() => {
    if (isPending) {
      return;
    }

    setOpen(false);
  }, [isPending, setOpen]);

  const handleOpenChange = (next: boolean) => {
    if (isPending) {
      return;
    }

    if (next) {
      setFormKey((current) => current + 1);
    }

    setOpen(next);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent
        className={cn(formDialogContentClassName, className)}
        showCloseButton={!isPending}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        {children({ onClose, formKey })}
      </DialogContent>
    </Dialog>
  );
}

export type { FormDialogRenderProps };
