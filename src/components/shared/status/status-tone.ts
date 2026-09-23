export type StatusTone = "success" | "warning" | "danger" | "info" | "neutral";

const STATUS_TONE_BY_VALUE: Record<string, StatusTone> = {
  ACTIVE: "success",
  SUCCESS: "success",
  COMPLETED: "success",
  PUBLISHED: "success",

  PENDING: "warning",
  PROCESSING: "info",
  DRAFT: "warning",
  SUSPENDED: "warning",

  INACTIVE: "neutral",
  ARCHIVED: "neutral",

  FAILED: "danger",
  CANCELLED: "danger",
  CANCELED: "danger",
  EXPIRED: "danger",
  DELETED: "danger",
};

function normalizeStatusValue(status: string) {
  return status.trim().toUpperCase().replace(/[\s-]+/g, "_");
}

/** Map a backend status string to a visual tone. Unknown values fall back to `neutral`. */
export function statusTone(status: string | null | undefined): StatusTone {
  if (!status) return "neutral";
  return STATUS_TONE_BY_VALUE[normalizeStatusValue(status)] ?? "neutral";
}
