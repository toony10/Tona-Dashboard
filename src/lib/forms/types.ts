import type { ReactNode } from "react";

export type ActionResult<TData = null> = {
  success: boolean;
  statusCode: number;
  message: string;
  data?: TData;
  errors?: string[];
};

export type CrudDialogProps = {
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  redirectTo?: string;
  onSuccess?: (result: ActionResult<unknown>) => void;
};
