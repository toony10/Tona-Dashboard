# Forms Feature

## Purpose

The forms module showcases reusable input experiences for rich content and file/date workflows, plus a shared CRUD kit for dialogs and server actions.

## Routes

- `/forms`
- `/forms/rich-text`
- `/forms/image-uploader`
- `/forms/file-uploader`
- `/forms/date-input`

## Included capabilities

- Rich text editing with formatting controls.
- Image uploads with thumbnail preview (no lightbox).
- Generic file uploads with type-aware handling (merge via `filesRef` to avoid stale state).
- Date input controls for form workflows.
- CRUD dialogs, confirmations, and typed server actions.

## Primary building blocks

### Input widgets

- `RichTextEditor`
- `ImageUploader` (`columns` 1–5)
- `FileUploader`
- `DateInput`

### CRUD kit (`src/lib/forms/`)

| Export | Role |
|---|---|
| `useCrudForm` | RHF + Zod + toast + `router.refresh()` |
| `FormDialog` | Hybrid add/update dialog (`formKey` remount, hide close while pending) |
| `ConfirmDialog` | Delete / confirm flows |
| `runAction` | Server-only: parse schema, call handler, optional `revalidatePath` |
| `useConfirmAction` / `useControllableDialog` | Shared dialog/action state |
| `SubmitButton` / `FormErrors` / `Form*` | Form chrome |
| `optionalString` | Blank form text → `undefined` |

Client files import `@/lib/forms`. Server actions import `@/lib/forms/server`. Never import `runAction` or `apiClient` from a client component.

Full setup with copy-paste examples (list, dialogs, bulk, uploads, locale-aware Zod): [CRUD setup](../guides/crud-setup.md).

### Image optimization

Before sending uploads to the API, server actions call `optimizeImageFile` / `optimizeImageFiles` (`src/lib/images`) with a named preset from `src/config/image-optimize.ts` (`AVATAR_OPTIMIZE_OPTIONS`, `LOGO_OPTIMIZE_OPTIONS`, `DOCUMENT_IMAGE_OPTIMIZE_OPTIONS`).

## Business value

Provides ready-to-use form patterns for admin interfaces where users create and manage structured and unstructured content.
