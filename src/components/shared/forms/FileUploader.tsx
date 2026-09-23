"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import {
    UploadCloudIcon,
    XIcon,
    AlertCircleIcon,
    FileIcon,
    FileTextIcon,
    FileSpreadsheetIcon,
    PresentationIcon,
    FileArchiveIcon,
    PaperclipIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─────────────────────────── Types ─────────────────────────── */

export interface UploadedFile {
    id: string;
    file: File;
    status: "idle" | "uploading" | "done" | "error";
    error?: string;
}

export interface FileUploaderProps {
    /** Field name for the hidden file <input> */
    name?: string;
    /** Called whenever the list of accepted files changes */
    onChange?: (files: File[]) => void;
    /** Maximum number of files allowed (default: 5) */
    maxFiles?: number;
    /** Maximum size per file in bytes (default: 10 MB) */
    maxSize?: number;
    /** Accept string forwarded to the file <input> */
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
    /** Allow selecting multiple files at once (default: true when maxFiles > 1) */
    multiple?: boolean;
    /** id for the root element */
    id?: string;
    /** aria-label for accessibility */
    "aria-label"?: string;
    /** Required field indicator for forms */
    required?: boolean;
}

const DEFAULT_ACCEPT =
    ".pdf,.doc,.docx,.txt,.rtf,.xls,.xlsx,.csv,.ppt,.pptx,.zip,.rar";

/* ───────────────────────── Helpers ─────────────────────────── */

function uid() {
    return Math.random().toString(36).slice(2);
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${ bytes } B`;
    if (bytes < 1024 * 1024) return `${ (bytes / 1024).toFixed(1) } KB`;
    return `${ (bytes / (1024 * 1024)).toFixed(1) } MB`;
}

function getExtension(name: string) {
    const parts = name.split(".");
    return parts.length > 1 ? parts.pop()!.toLowerCase() : "";
}

function isAccepted(file: File, accept: string): boolean {
    if (!accept || accept === "*") return true;

    const tokens = accept.split(",").map((t) => t.trim().toLowerCase());
    const ext = `.${ getExtension(file.name) }`;
    const mime = file.type.toLowerCase();

    return tokens.some((token) => {
        if (token.startsWith(".")) return ext === token;
        if (token.endsWith("/*")) return mime.startsWith(token.slice(0, -1));
        return mime === token;
    });
}

type FileKind = "pdf" | "doc" | "sheet" | "slides" | "archive" | "generic";

function getFileKind(file: File): FileKind {
    const ext = getExtension(file.name);
    const mime = file.type;

    if (ext === "pdf" || mime === "application/pdf") return "pdf";
    if (
        ["doc", "docx", "txt", "rtf", "odt"].includes(ext) ||
        mime.startsWith("text/") ||
        mime.includes("word") ||
        mime.includes("document")
    )
        return "doc";
    if (
        ["xls", "xlsx", "csv", "ods"].includes(ext) ||
        mime.includes("sheet") ||
        mime.includes("excel")
    )
        return "sheet";
    if (
        ["ppt", "pptx", "odp"].includes(ext) ||
        mime.includes("presentation") ||
        mime.includes("powerpoint")
    )
        return "slides";
    if (
        ["zip", "rar", "7z", "tar", "gz"].includes(ext) ||
        mime.includes("zip") ||
        mime.includes("archive")
    )
        return "archive";
    return "generic";
}

const FILE_KIND_META: Record<
    FileKind,
    { icon: React.ElementType; label: string; accent: string; bg: string }
> = {
    pdf: {
        icon: FileTextIcon,
        label: "PDF",
        accent: "text-red-600 dark:text-red-400",
        bg: "bg-red-500/10 border-red-500/20",
    },
    doc: {
        icon: FileTextIcon,
        label: "DOC",
        accent: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-500/10 border-blue-500/20",
    },
    sheet: {
        icon: FileSpreadsheetIcon,
        label: "SHEET",
        accent: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    slides: {
        icon: PresentationIcon,
        label: "SLIDES",
        accent: "text-amber-600 dark:text-amber-400",
        bg: "bg-amber-500/10 border-amber-500/20",
    },
    archive: {
        icon: FileArchiveIcon,
        label: "ZIP",
        accent: "text-violet-600 dark:text-violet-400",
        bg: "bg-violet-500/10 border-violet-500/20",
    },
    generic: {
        icon: FileIcon,
        label: "FILE",
        accent: "text-muted-foreground",
        bg: "bg-muted/50 border-border",
    },
};

function toUploadedFiles(files: File[]): UploadedFile[] {
    return files.map((file) => ({
        id: uid(),
        file,
        status: "idle" as const,
    }));
}

function mergeIncomingFiles(
    prev: UploadedFile[],
    incoming: FileList | File[],
    accept: string,
    maxFiles: number,
    maxSize: number,
    sizeError: string
): { next: UploadedFile[]; typeRejected: boolean; added: boolean } {
    const slots = maxFiles - prev.length;
    if (slots <= 0) return { next: prev, typeRejected: false, added: false };

    const toAdd: UploadedFile[] = [];
    let typeRejected = false;

    for (const file of Array.from(incoming)) {
        if (toAdd.length >= slots) break;

        if (!isAccepted(file, accept)) {
            typeRejected = true;
            continue;
        }

        const sizeOk = file.size <= maxSize;
        toAdd.push({
            id: uid(),
            file,
            status: sizeOk ? "idle" : "error",
            error: sizeOk ? undefined : sizeError,
        });
    }

    if (toAdd.length === 0) return { next: prev, typeRejected, added: false };

    return {
        next: [...prev, ...toAdd],
        typeRejected,
        added: true,
    };
}

/* ───────────────────────── Component ───────────────────────── */

export function FileUploader({
    name,
    onChange,
    maxFiles = 5,
    maxSize = 10 * 1024 * 1024,
    accept = DEFAULT_ACCEPT,
    defaultFiles,
    className,
    disabled = false,
    label,
    hint,
    multiple,
    id,
    "aria-label": ariaLabel,
    required,
}: FileUploaderProps) {
    const t = useTranslations("Forms.fileUploader");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [files, setFiles] = React.useState<UploadedFile[]>(() =>
        toUploadedFiles(defaultFiles ?? [])
    );
    const [typeRejection, setTypeRejection] = React.useState<string | null>(null);
    const dragCounter = React.useRef(0);
    const filesRef = React.useRef(files);
    filesRef.current = files;

    const isMultiple = multiple ?? maxFiles > 1;

    const emitChange = React.useCallback(
        (next: UploadedFile[]) => {
            onChange?.(
                next.filter((f) => f.status !== "error").map((f) => f.file)
            );
        },
        [onChange]
    );

    const processFiles = React.useCallback(
        (incoming: FileList | File[]) => {
            const result = mergeIncomingFiles(
                filesRef.current,
                incoming,
                accept,
                maxFiles,
                maxSize,
                t("exceedsSize", { maxSize: formatBytes(maxSize) })
            );

            setFiles(result.next);

            if (result.typeRejected) {
                setTypeRejection(t("typeNotAllowed"));
            } else if (result.added) {
                setTypeRejection(null);
            }

            if (result.added) {
                emitChange(result.next);
            }
        },
        [accept, emitChange, maxFiles, maxSize, t]
    );

    const remove = React.useCallback(
        (id: string) => {
            const next = filesRef.current.filter((f) => f.id !== id);
            setFiles(next);
            emitChange(next);
        },
        [emitChange]
    );

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

    const isFull = files.length >= maxFiles;
    const canAdd = !disabled && !isFull;
    const validFiles = files.filter((f) => f.status !== "error");
    const totalSize = validFiles.reduce((sum, f) => sum + f.file.size, 0);
    const maxTotalSize = maxSize * maxFiles;
    const usagePercent = Math.min((totalSize / maxTotalSize) * 100, 100);

    return (
        <div id={ id } className={ cn("space-y-3", className) }>
            { typeRejection && (
                <div
                    role="alert"
                    className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
                >
                    <AlertCircleIcon className="size-4 shrink-0" />
                    { typeRejection }
                </div>
            ) }

            {/* ── Drop Zone ── */ }
            { canAdd && (
                <div
                    role="button"
                    tabIndex={ 0 }
                    aria-label={ ariaLabel ?? t("ariaUploadFiles") }
                    onDragEnter={ handleDragEnter }
                    onDragLeave={ handleDragLeave }
                    onDragOver={ handleDragOver }
                    onDrop={ handleDrop }
                    onClick={ () => inputRef.current?.click() }
                    onKeyDown={ (e) => e.key === "Enter" && inputRef.current?.click() }
                    className={ cn(
                        "group relative flex cursor-pointer flex-col items-center justify-center gap-4 overflow-hidden rounded-xl border-2 border-dashed px-6 py-10 text-center transition-all duration-300 select-none",
                        isDragging
                            ? "border-primary bg-primary/5 scale-[1.01] shadow-lg shadow-primary/10"
                            : "border-border hover:border-primary/60 hover:bg-muted/30",
                        disabled && "pointer-events-none opacity-50"
                    ) }
                >
                    {/* animated document stack */ }
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.04]">
                        <div
                            className={ cn(
                                "relative size-32 transition-transform duration-500",
                                isDragging && "scale-110"
                            ) }
                        >
                            <div className="absolute inset-0 -rotate-8 rounded-lg border-2 border-current" />
                            <div className="absolute inset-2 rotate-4 rounded-lg border-2 border-current" />
                            <div className="absolute inset-4 -rotate-2 rounded-lg border-2 border-current" />
                        </div>
                    </div>

                    <div
                        className={ cn(
                            "pointer-events-none absolute inset-0 transition-opacity duration-500",
                            "bg-[radial-gradient(ellipse_at_center,color-mix(in_oklch,var(--color-primary)_8%,transparent)_0%,transparent_70%)]",
                            isDragging ? "opacity-100" : "opacity-0"
                        ) }
                    />

                    <div
                        className={ cn(
                            "relative flex size-14 items-center justify-center rounded-2xl border border-border bg-muted transition-all duration-300",
                            isDragging
                                ? "scale-110 border-primary/40 bg-primary/10 text-primary shadow-md shadow-primary/20"
                                : "group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary group-hover:shadow-sm"
                        ) }
                    >
                        <UploadCloudIcon
                            className={ cn(
                                "size-6 transition-transform duration-300",
                                isDragging && "-translate-y-1"
                            ) }
                        />
                    </div>

                    <div className="relative space-y-1.5">
                        <p className="text-sm font-medium text-foreground">
                            { isDragging ? (
                                t("dropHere")
                            ) : label ? (
                                label
                            ) : (
                                <>
                                    <span className="text-primary underline-offset-2 hover:underline">
                                        { t("clickToBrowse") }
                                    </span>{ " " }
                                    { t("orDragDrop") }
                                </>
                            ) }
                        </p>
                        <p className="text-xs text-muted-foreground">
                            { hint ??
                                t("hintTemplate", {
                                    maxFiles,
                                    maxSize: formatBytes(maxSize),
                                }) }
                        </p>
                    </div>

                    <div className="relative flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">
                        <PaperclipIcon className="size-3" />
                        <span dir="ltr">{ files.length } / { maxFiles }</span>
                    </div>

                    <input
                        ref={ inputRef }
                        name={ name }
                        type="file"
                        accept={ accept }
                        multiple={ isMultiple }
                        required={ required && files.length === 0 }
                        className="sr-only"
                        disabled={ disabled }
                        onChange={ (e) => {
                            if (e.target.files) processFiles(e.target.files);
                            e.target.value = "";
                        } }
                    />
                </div>
            ) }

            {/* ── Usage bar ── */ }
            { files.length > 0 && (
                <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>
                            { t("filesAttached", { count: validFiles.length }) }
                        </span>
                        <span>
                            { formatBytes(totalSize) }
                            { maxFiles > 1 &&
                                ` · ${ t("capacityTemplate", {
                                    percent: Math.round(usagePercent),
                                }) }` }
                        </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                            className="h-full rounded-full bg-primary/70 transition-all duration-500 ease-out"
                            style={ { width: `${ usagePercent }%` } }
                        />
                    </div>
                </div>
            ) }

            {/* ── File list ── */ }
            { files.length > 0 && (
                <ul className="space-y-2" aria-live="polite">
                    { files.map((item) => (
                        <FileRow
                            key={ item.id }
                            item={ item }
                            disabled={ disabled }
                            onRemove={ () => remove(item.id) }
                        />
                    )) }
                </ul>
            ) }

            {/* ── Compact add-more when full drop zone is hidden ── */ }
            { !canAdd && files.length > 0 && !disabled && (
                <p className="text-center text-xs text-muted-foreground">
                    { t("maxReached", { maxFiles }) }
                </p>
            ) }

            { canAdd && files.length > 0 && (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full border-dashed"
                    onClick={ () => inputRef.current?.click() }
                >
                    <PaperclipIcon className="size-3.5" />
                    { t("addAnotherFile") }
                </Button>
            ) }
        </div>
    );
}

/* ─────────────────── File row sub-component ─────────────────── */

interface FileRowProps {
    item: UploadedFile;
    disabled: boolean;
    onRemove: () => void;
}

function FileRow({ item, disabled, onRemove }: FileRowProps) {
    const t = useTranslations("Forms.fileUploader");
    const kind = getFileKind(item.file);
    const meta = FILE_KIND_META[kind];
    const Icon = meta.icon;
    const ext = getExtension(item.file.name).toUpperCase() || meta.label;
    const isError = item.status === "error";

    return (
        <li
            className={ cn(
                "group/file relative flex items-center gap-3 rounded-xl border bg-card p-3 shadow-sm transition-all duration-200",
                isError
                    ? "border-destructive/30 bg-destructive/5"
                    : "border-border hover:border-primary/30 hover:shadow-md"
            ) }
        >
            <div
                className={ cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-lg border",
                    isError ? "bg-destructive/10 border-destructive/20" : meta.bg
                ) }
            >
                { isError ? (
                    <AlertCircleIcon className="size-5 text-destructive" />
                ) : (
                    <Icon className={ cn("size-5", meta.accent) } />
                ) }
            </div>

            <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                    <p
                        className="truncate text-sm font-medium text-foreground"
                        title={ item.file.name }
                    >
                        { item.file.name }
                    </p>
                    { !isError && (
                        <span
                            className={ cn(
                                "shrink-0 rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase",
                                meta.bg,
                                meta.accent
                            ) }
                        >
                            { ext }
                        </span>
                    ) }
                </div>
                <p className="text-xs text-muted-foreground">
                    { isError ? item.error : formatBytes(item.file.size) }
                </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
                { !disabled && (
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        onClick={ onRemove }
                        aria-label={ t("removeFile", { name: item.file.name }) }
                    >
                        <XIcon className="size-3.5" />
                    </Button>
                ) }
            </div>

            { item.status === "uploading" && (
                <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-xl bg-muted">
                    <div className="h-full w-1/2 animate-pulse bg-primary" />
                </div>
            ) }
        </li>
    );
}
