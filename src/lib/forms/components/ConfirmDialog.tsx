"use client";

import { useTranslations } from "next-intl";
import { useCallback } from "react";

import {
  Button,
} from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useConfirmAction } from "../hooks/use-confirm-action";
import { useControllableDialog } from "../hooks/use-controllable-dialog";
import type { ActionResult, CrudDialogProps } from "../types";
import { FormErrors } from "./FormErrors";
import { SubmitButton } from "./SubmitButton";

type ConfirmDialogProps<TInput, TData = null> = Omit<CrudDialogProps, "onSuccess"> & {
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: React.ReactNode;
  cancelLabel?: React.ReactNode;
  variant?: "default" | "destructive";
  action: (input: TInput) => Promise<ActionResult<TData>>;
  actionInput: TInput;
  onSuccess?: (result: ActionResult<TData>) => void;
};

export function ConfirmDialog<TInput, TData = null>({
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant = "destructive",
  action,
  actionInput,
  trigger,
  open,
  onOpenChange,
  redirectTo,
  onSuccess,
}: ConfirmDialogProps<TInput, TData>) {
  const t = useTranslations("Crud");
  const { open: dialogOpen, setOpen } = useControllableDialog(open, onOpenChange);

  const handleSuccess = useCallback(
    (result: ActionResult<TData>) => {
      onSuccess?.(result);
      setOpen(false);
    },
    [onSuccess, setOpen],
  );

  const { execute, isPending, serverErrors, clearServerErrors } = useConfirmAction({
    action,
    redirectTo,
    onSuccess: handleSuccess,
  });

  const handleOpenChange = (next: boolean) => {
    if (isPending) {
      return;
    }

    if (!next) {
      clearServerErrors();
    }

    setOpen(next);
  };

  const handleConfirm = () => {
    void execute(actionInput);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={handleOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent showCloseButton={!isPending}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <FormErrors errors={serverErrors} title={t("errorsTitle")} />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isPending}
            onClick={() => handleOpenChange(false)}
          >
            {cancelLabel ?? t("cancel")}
          </Button>
          <SubmitButton
            type="button"
            variant={variant}
            loading={isPending}
            onClick={handleConfirm}
          >
            {confirmLabel ?? t("confirm")}
          </SubmitButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
