"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ImageIcon,
  UploadCloudIcon,
  XIcon,
  CheckCircle2Icon,
} from "lucide-react";

/* ─────────────────────────── Types ─────────────────────────── */

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: "idle" | "uploading" | "done";
}

/** Reason a file was rejected during selection/drop. */
export type RejectReason = "type" | "size" | "duplicate" | "max";

export interface RejectedFile {
  file: File;
  reason: RejectReason;
}

export interface ImageUploaderProps {
  /** Field name for the hidden file <input> */
  name?: string;
  /** Called whenever the list of accepted images changes */
  onChange?: (files: File[]) => void;
  /** Called with any files that were rejected (type/size/duplicate/max) */
  onReject?: (rejected: RejectedFile[]) => void;
  /** Maximum number of images allowed (default: 5) */
  maxImages?: number;
  /** Maximum size per file in bytes (default: 5 MB) */
  maxSize?: number;
  /** Accept string forwarded to the file <input> (default: "image/*") */
  accept?: string;
  /** Pre-populate the uploader with these files */
  defaultFiles?: File[];
  /** Extra classes applied to the root wrapper */
  className?: string;
  /** Disable the uploader */
  disabled?: boolean;
  /** Label shown inside the drop-zone */
  label?: React.ReactNode;
  /** Hint text shown below the label */
  hint?: string;
  /** Show file names below each thumbnail */
  showFileNames?: boolean;
  /** CSS aspect-ratio for each thumbnail (e.g. "1/1", "16/9") */
  aspectRatio?: string;
  /** Number of thumbnail columns (default: 3) */
  columns?: 1 | 2 | 3 | 4 | 5;
  /** Show a toast for rejected files (default: true) */
  showRejectToasts?: boolean;
}

/* ───────────────────────── Helpers ─────────────────────────── */

const COLUMNS_CLASS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-5",
};

function uid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/** Stable key used to detect duplicates. */
function fileKey(file: File) {
  return `${file.name}:${file.size}:${file.lastModified}`;
}

/**
 * Checks a file against an `accept` string (the same syntax the native
 * <input accept> uses), e.g. "image/*", "image/png,image/jpeg", ".png,.webp".
 */
function matchesAccept(file: File, accept: string) {
  const tokens = accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);
  if (tokens.length === 0) return true;

  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();

  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token);
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

function toImageFiles(files: File[]): ImageFile[] {
  return files.map((file) => ({
    id: uid(),
    file,
    preview: URL.createObjectURL(file),
    status: "idle" as const,
  }));
}

/* ───────────────────────── Component ───────────────────────── */

export function ImageUploader({
  name,
  onChange,
  onReject,
  maxImages = 5,
  maxSize = 5 * 1024 * 1024,
  accept = "image/*",
  defaultFiles,
  className,
  disabled = false,
  label,
  hint,
  showFileNames = false,
  aspectRatio = "1/1",
  columns = 3,
  showRejectToasts = true,
}: ImageUploaderProps) {
  const t = useTranslations("Forms.imageUploader");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [images, setImages] = React.useState<ImageFile[]>(() =>
    toImageFiles(defaultFiles ?? [])
  );
  const dragCounter = React.useRef(0);

  /* Keep a live ref to the current images so the unmount cleanup can revoke
   * every preview URL — not just the ones present at mount. The event
   * handlers below update this alongside every setImages call, and it is
   * also re-synced after each commit via the effect. */
  const imagesRef = React.useRef(images);
  React.useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  /* Revoke ALL preview URLs on unmount (reads the latest list via ref). */
  React.useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, []);

  /* Notify the parent once about any pre-populated defaultFiles so a
   * controlled parent starts in sync. Runs a single time on mount. */
  React.useEffect(() => {
    if (imagesRef.current.length > 0) {
      onChange?.(imagesRef.current.map((i) => i.file));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── surface rejected files via callback + (optional) toast ── */
  const reportRejections = React.useCallback(
    (rejected: RejectedFile[]) => {
      if (rejected.length === 0) return;
      onReject?.(rejected);
      if (!showRejectToasts) return;

      const counts = rejected.reduce<Record<RejectReason, number>>(
        (acc, r) => {
          acc[r.reason] = (acc[r.reason] ?? 0) + 1;
          return acc;
        },
        {} as Record<RejectReason, number>
      );

      const messages: Record<RejectReason, (n: number) => string> = {
        type: (n) => t("rejectType", { count: n }),
        size: (n) =>
          t("rejectSize", { count: n, maxSize: formatBytes(maxSize) }),
        duplicate: (n) => t("rejectDuplicate", { count: n }),
        max: (n) => t("rejectMax", { count: n, maxImages }),
      };

      (Object.keys(counts) as RejectReason[]).forEach((reason) => {
        toast.error(messages[reason](counts[reason]));
      });
    },
    [maxSize, maxImages, onReject, showRejectToasts, t]
  );

  /* ── process incoming files ── */
  const processFiles = React.useCallback(
    (incoming: FileList | File[]) => {
      const prev = imagesRef.current;
      const slots = maxImages - prev.length;

      const rejected: RejectedFile[] = [];

      if (slots <= 0) {
        Array.from(incoming).forEach((file) =>
          rejected.push({ file, reason: "max" })
        );
        reportRejections(rejected);
        return;
      }

      const existingKeys = new Set(prev.map((i) => fileKey(i.file)));
      const seenKeys = new Set<string>();
      const valid: File[] = [];

      // Validate FIRST, then take only as many as we have slots for.
      Array.from(incoming).forEach((file) => {
        if (!matchesAccept(file, accept) || !file.type.startsWith("image/")) {
          rejected.push({ file, reason: "type" });
          return;
        }
        if (file.size > maxSize) {
          rejected.push({ file, reason: "size" });
          return;
        }
        const key = fileKey(file);
        if (existingKeys.has(key) || seenKeys.has(key)) {
          rejected.push({ file, reason: "duplicate" });
          return;
        }
        seenKeys.add(key);
        valid.push(file);
      });

      // Anything valid beyond the available slots is a "max" rejection.
      if (valid.length > slots) {
        valid.slice(slots).forEach((file) =>
          rejected.push({ file, reason: "max" })
        );
      }

      const toAdd = valid.slice(0, slots).map((file) => ({
        id: uid(),
        file,
        preview: URL.createObjectURL(file),
        status: "idle" as const,
      }));

      reportRejections(rejected);

      if (toAdd.length === 0) return;

      const next = [...prev, ...toAdd];
      imagesRef.current = next;
      setImages(next);
      onChange?.(next.map((i) => i.file));
    },
    [maxImages, maxSize, accept, onChange, reportRejections]
  );

  /* ── remove ── */
  const remove = React.useCallback(
    (id: string) => {
      const prev = imagesRef.current;
      const target = prev.find((i) => i.id === id);
      if (!target) return;
      URL.revokeObjectURL(target.preview);
      const next = prev.filter((i) => i.id !== id);
      imagesRef.current = next;
      setImages(next);
      onChange?.(next.map((i) => i.file));
    },
    [onChange]
  );

  /* ── drag events ── */
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    if (e.dataTransfer.items.length) setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    if (dragCounter.current === 0) setIsDragging(false);
  };
  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current = 0;
    setIsDragging(false);
    if (!disabled) processFiles(e.dataTransfer.files);
  };

  const openPicker = () => inputRef.current?.click();
  const handleZoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " " || e.key === "Spacebar") {
      e.preventDefault();
      openPicker();
    }
  };

  const isFull = images.length >= maxImages;
  const canAdd = !disabled && !isFull;

  /* ────────────────────────── Render ────────────────────────── */
  return (
      <div className={cn("space-y-3", className)}>
        {/* ── Drop Zone ── */}
        {canAdd && (
          <div
            role="button"
            tabIndex={0}
            aria-label={t("ariaUploadImages")}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={openPicker}
            onKeyDown={handleZoneKeyDown}
            className={cn(
              "group relative flex cursor-pointer flex-col items-center justify-center gap-3 overflow-hidden rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300 select-none",
              isDragging
                ? "border-primary bg-primary/5 scale-[1.01] shadow-lg shadow-primary/10"
                : "border-border hover:border-primary/60 hover:bg-muted/30",
              disabled && "pointer-events-none opacity-50"
            )}
          >
            {/* radial glow on drag */}
            <div
              className={cn(
                "pointer-events-none absolute inset-0 transition-opacity duration-500",
                "bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--color-primary)_8%,transparent)_0%,transparent_70%)]",
                isDragging ? "opacity-100" : "opacity-0"
              )}
            />

            {/* upload icon */}
            <div
              className={cn(
                "flex size-14 items-center justify-center rounded-full border border-border bg-muted transition-all duration-300",
                isDragging
                  ? "scale-110 border-primary/40 bg-primary/10 text-primary"
                  : "group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary"
              )}
            >
              <UploadCloudIcon
                className={cn(
                  "size-6 transition-transform duration-300",
                  isDragging && "-translate-y-0.5"
                )}
              />
            </div>

            {/* label */}
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {isDragging ? (
                  t("dropHere")
                ) : label ? (
                  label
                ) : (
                  <>
                    <span className="text-primary underline-offset-2 hover:underline">
                      {t("clickToUpload")}
                    </span>
                    {" "}{t("orDragDrop")}
                  </>
                )}
              </p>
              <p className="text-xs text-muted-foreground">
                {hint ??
                  t("hintTemplate", {
                    maxImages,
                    maxSize: formatBytes(maxSize),
                  })}
              </p>
            </div>

            {/* counter pill */}
            <div className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
              <ImageIcon className="size-3" />
              <span dir="ltr">{images.length} / {maxImages}</span>
            </div>

            <input
              ref={inputRef}
              name={name}
              type="file"
              accept={accept}
              multiple={maxImages > 1}
              className="sr-only"
              tabIndex={-1}
              onChange={(e) => {
                if (e.target.files) processFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
        )}

        {/* ── Thumbnails grid ── */}
        {images.length > 0 && (
          <div className={cn("grid gap-3", COLUMNS_CLASS[columns])}>
            {images.map((img) => (
              <Thumbnail
                key={img.id}
                img={img}
                aspectRatio={aspectRatio}
                showFileName={showFileNames}
                onRemove={() => remove(img.id)}
                disabled={disabled}
              />
            ))}

            {/* "add more" card — shown inside grid when not full */}
            {canAdd && (
              <button
                type="button"
                onClick={openPicker}
                disabled={disabled}
                aria-label={t("addMoreImagesAria")}
                style={{ aspectRatio }}
                className={cn(
                  "group flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/20 text-muted-foreground transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 hover:text-primary",
                  disabled && "pointer-events-none opacity-40"
                )}
              >
                <div className="flex size-9 items-center justify-center rounded-full border border-dashed border-current transition-transform duration-200 group-hover:scale-110">
                  <span className="text-lg leading-none select-none">+</span>
                </div>
                <span className="text-[11px] font-medium">{t("addMore")}</span>
              </button>
            )}
          </div>
        )}

        {/* ── Status row — keeps the counter visible even when the drop zone
            is hidden (e.g. when the max has been reached). ── */}
        {images.length > 0 && !canAdd && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <ImageIcon className="size-3" />
            <span dir="ltr">{images.length} / {maxImages}</span>
            {isFull && <span>· {t("limitReached")}</span>}
          </div>
        )}
      </div>
  );
}

/* ─────────────────── Thumbnail sub-component ─────────────────── */

interface ThumbnailProps {
  img: ImageFile;
  aspectRatio: string;
  showFileName: boolean;
  onRemove: () => void;
  disabled: boolean;
}

function Thumbnail({
  img,
  aspectRatio,
  showFileName,
  onRemove,
  disabled,
}: ThumbnailProps) {
  const t = useTranslations("Forms.imageUploader");

  return (
    <div className="group/thumb flex flex-col gap-1.5">
      <div
        className="relative overflow-hidden rounded-xl border border-border bg-muted shadow-sm transition-shadow duration-200 group-hover/thumb:shadow-md"
        style={{ aspectRatio }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={img.preview}
          alt={img.file.name}
          className="size-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
        />

        {/* hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/0 opacity-0 transition-all duration-200 group-hover/thumb:bg-black/40 group-hover/thumb:opacity-100">
          {!disabled && (
            <ActionButton
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              aria-label={t("removeImage")}
              className="bg-destructive/90 text-white hover:bg-destructive"
            >
              <XIcon className="size-3.5" />
            </ActionButton>
          )}
        </div>

        {/* done badge */}
        {img.status === "done" && (
          <div className="absolute top-1.5 start-1.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
            <CheckCircle2Icon className="size-3" />
          </div>
        )}

        {/* uploading spinner */}
        {img.status === "uploading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <div className="size-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          </div>
        )}
      </div>

      {showFileName && (
        <p className="truncate text-[11px] text-muted-foreground" title={img.file.name}>
          {img.file.name}
        </p>
      )}
    </div>
  );
}

/* ─────────────────────── Action icon button ─────────────────────── */

function ActionButton({
  className,
  children,
  ...props
}: React.ComponentProps<"button"> & { className?: string }) {
  return (
    <button
      type="button"
      className={cn(
        "flex size-7 cursor-pointer items-center justify-center rounded-full shadow transition-all duration-150 active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
