import { ForbiddenPage } from "../forbidden/ForbiddenPage";

import { ErrorBar } from "./ErrorBar";

export type ErrorHandlerProps = {
  statusCode: number;
  message?: string;
  homeHref?: string;
  className?: string;
};

export function ErrorHandler({
  statusCode,
  message,
  homeHref,
  className,
}: ErrorHandlerProps) {
  if (statusCode === 403) {
    return <ForbiddenPage homeHref={homeHref} className={className} />;
  }

  return <ErrorBar message={message} className={className} />;
}
