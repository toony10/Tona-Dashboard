# Guide: CRUD setup

How to add an entity (list, add, update, delete) with the forms kit: Zod, services, server actions, `{Entity}_FR`, `FormDialog`, and `ConfirmDialog`.

The kit already lives in this app. Login is the only live mutation today (`Login_FR` → `loginAction`). Copy the patterns below for the next domain.

## Architecture

```
{Entity}_FR  --useCrudForm-->  {entity}.actions.ts  --runAction-->  {entity}.api.ts  --> apiClient
ConfirmDialog --useConfirmAction-^
RSC page / loaders --------------------------------------------->  {entity}.api.ts
```

| Layer | Path | Imports | Role |
|---|---|---|---|
| Types | `src/types/{domain}/` | nothing from forms/api | Entity shapes |
| Schemas | `src/validations/{domain}/` | `zod`, `optionalString` | Same schema on client and server |
| Service | `src/services/{domain}/*.api.ts` | `apiClient` only here | HTTP |
| Actions | `src/actions/{domain}/*.actions.ts` | `runAction`, services, schemas | `"use server"` — no `apiClient` |
| Form | `src/components/forms/{domain}/{Entity}_FR.tsx` | `@/lib/forms` | RHF + Zod, typed object submit |
| Dialogs | `src/components/dialogs/{domain}/*_DL.tsx` | `@/lib/forms` | Hybrid add/update/delete |
| List UI | `src/app/[locale]/(main)/{route}/_components/` | table + dialogs | Client table; page stays a Server Component |

Client files import `@/lib/forms`. Server actions import `@/lib/forms/server`. Never import `runAction` or `apiClient` from a client component.

## Kit APIs

### `ActionResult`

```ts
type ActionResult<TData = null> = {
  success: boolean;
  statusCode: number;
  message: string; // toast text (success and error)
  data?: TData;
  errors?: string[]; // flat list for FormErrors — not field maps
};
```

`runAction` returns the service `ApiResponse` as-is when the handler succeeds or the API fails. Toasts use `result.message` (usually the backend string).

### Client (`@/lib/forms`)

| Export | Role |
|---|---|
| `useCrudForm` | RHF + Zod + toast + `router.refresh()` |
| `FormDialog` | Hybrid add/update (`formKey` remount, hide close while pending) |
| `ConfirmDialog` | Delete / confirm |
| `useConfirmAction` / `useControllableDialog` | Shared dialog/action state |
| `Form` / `FormField` / `FormItem` / `FormLabel` / `FormControl` / `FormMessage` | RHF chrome |
| `FormErrors` / `SubmitButton` | Server errors + pending button |
| `optionalString` | Blank form text → `undefined` |
| `CrudDialogProps` | Hybrid dialog props |

### Server (`@/lib/forms/server`)

```ts
runAction({
  schema,
  input,
  handler: (data) => serviceFn(data),
  revalidatePaths: ["/{locale}/products"], // or (data) => paths
});
```

Signature is `(input: unknown) => Promise<ActionResult>` — not `(prev, FormData)`.

### Hybrid dialog props

```ts
type CrudDialogProps = {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  redirectTo?: string;
  onSuccess?: (result: ActionResult<unknown>) => void;
};
```

One dialog component per operation. Use it as a trigger **or** controlled — never two twin components.

## Decision tree

```
1. Mutation type?
   Form (Add/Update)     → {Entity}_FR + FormDialog
   Confirm (Delete/etc.) → ConfirmDialog

2. Where is it triggered?
   List header           → Add dialog with trigger
   Table row             → inline trigger (default)
   Detail page bar       → same dialogs; delete gets redirectTo

3. Table pattern?
   Paginated + simple form (< ~8 fields) → inline _DL per row
   Heavy form / uploads / many rows      → one controlled instance + next/dynamic
```

## Hard rules

1. Same Zod schema on client (`useCrudForm`) and server (`runAction`).
2. Submit a **plain object**, not FormData, from the form. Build `FormData` in the action or service if the API needs multipart.
3. Services are the only layer that import `apiClient`.
4. Actions never import `apiClient`. Client components never import `runAction`.
5. Add + Update share `{Entity}_FR` when fields overlap.
6. Pass `key={formKey}` from `FormDialog` so the form remounts on open.
7. Keep `page.tsx` a Server Component. Only `_components`, dialogs, and forms are `"use client"`.
8. Do not add a `select` column to `DataTable` — `enableRowSelection` prepends it.
9. Add every new message key to **both** `messages/en.json` and `messages/ar.json`.
10. Do not hardcode toast strings when `result.message` exists.

---

## 1) Types

`src/types/products/product.types.ts`

```ts
export type ProductStatus = "active" | "draft" | "archived";

export type Product = {
  id: string;
  name: string;
  sku: string;
  description?: string | null;
  status: ProductStatus;
  publishedAt?: string | null;
  imageUrl?: string | null;
};

export type ProductDetails = Product & {
  createdAt: string;
};
```

Barrel: `src/types/products/index.ts`.

---

## 2) Zod schemas

`src/validations/products/product.schemas.ts`

Use the **same** schemas in `useCrudForm` and `runAction`. Factory functions take a translator when messages must be localized (see [Locale-aware schema](#locale-aware-schema-login-style)).

```ts
import { z } from "zod";

import { optionalString } from "@/lib/forms";

export const productStatusSchema = z.enum(["active", "draft", "archived"]);

export const createProductSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  sku: z.string().trim().min(1, "SKU is required"),
  description: optionalString(z.string().trim().max(2000)),
  status: productStatusSchema,
  publishedAt: z.date().optional(),
});

export const updateProductSchema = createProductSchema.extend({
  id: z.string().trim().min(1),
});

export const deleteProductSchema = z.object({
  id: z.string().trim().min(1),
});

export const bulkDeleteProductsSchema = z.object({
  ids: z.array(z.string().trim().min(1)).min(1),
});

export const toggleProductStatusSchema = z.object({
  id: z.string().trim().min(1),
  status: productStatusSchema,
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;
export type BulkDeleteProductsInput = z.infer<typeof bulkDeleteProductsSchema>;
export type ToggleProductStatusInput = z.infer<typeof toggleProductStatusSchema>;
```

`optionalString` turns `""` / whitespace into `undefined` so JSON bodies omit the key.

### Locale-aware schema (login style)

When validation copy must be translated, use a factory. Login already does this:

```ts
// src/validations/auth/auth.schemas.ts
export function createLoginSchema(t: (key: "validation.emailRequired" | …) => string) {
  return z.object({
    email: z.string().trim().min(1, t("validation.emailRequired")).email(t("validation.emailInvalid")),
    password: z.string().min(1, t("validation.passwordRequired")),
  });
}
```

Client: `useMemo(() => createLoginSchema(t), [t])`.

Server action: `getActionTranslations(locale, "Auth.loginForm")` then the same factory. Pass `locale` from `useLocale()` (see `loginAction`).

---

## 3) Service (HTTP only)

`src/services/products/product.api.ts`

```ts
import { apiClient } from "@/lib/api";
import { toFormData, toQueryString } from "@/lib/http";
import type { PaginationParams, PaginationResponse } from "@/types/pagination";
import type { Product } from "@/types/products";
import type {
  CreateProductInput,
  ToggleProductStatusInput,
  UpdateProductInput,
} from "@/validations/products/product.schemas";

export type ProductListParams = PaginationParams & {
  search?: string;
  status?: string;
};

type ProductJsonBody = Omit<CreateProductInput, "publishedAt"> & {
  publishedAt?: string;
};

export async function getProducts(params: ProductListParams) {
  return apiClient<PaginationResponse<Product>>(
    `products${toQueryString(params)}`,
  );
}

export async function getProduct(id: string) {
  return apiClient<Product>(`products/${id}`);
}

export async function createProduct(body: ProductJsonBody) {
  return apiClient<Product>("products", { method: "POST", body });
}

export async function updateProduct({
  id,
  ...body
}: ProductJsonBody & { id: string }) {
  return apiClient<Product>(`products/${id}`, { method: "PATCH", body });
}

export async function deleteProduct(id: string) {
  return apiClient<null>(`products/${id}`, { method: "DELETE" });
}

export async function bulkDeleteProducts(ids: string[]) {
  return apiClient<null>("products/bulk-delete", {
    method: "POST",
    body: { ids },
  });
}

export async function toggleProductStatus(body: ToggleProductStatusInput) {
  return apiClient<Product>(`products/${body.id}/status`, {
    method: "PATCH",
    body: { status: body.status },
  });
}

/** Multipart when the API expects a file field (see image example). */
export async function createProductWithImage(fields: {
  name: string;
  sku: string;
  status: string;
  description?: string;
  publishedAt?: string;
  image: File;
}) {
  return apiClient<Product, FormData>("products", {
    method: "POST",
    body: toFormData(fields),
  });
}
```

Reads in RSC pages import **services**, not actions.

`apiClient` already sends `Accept-Language` and Bearer auth. If `body` is `FormData`, it skips `Content-Type` so the browser/runtime sets the multipart boundary.

---

## 4) Server actions

`src/actions/products/product.actions.ts`

```ts
"use server";

import { getRequestLocale } from "@/lib/api/get-request-locale";
import { runAction } from "@/lib/forms/server";
import {
  bulkDeleteProducts,
  createProduct,
  deleteProduct,
  toggleProductStatus,
  updateProduct,
} from "@/services/products";
import {
  bulkDeleteProductsSchema,
  createProductSchema,
  deleteProductSchema,
  toggleProductStatusSchema,
  updateProductSchema,
} from "@/validations/products/product.schemas";

function listPath(locale: string) {
  return `/${locale}/products`;
}

function toJsonBody(
  data: { publishedAt?: Date } & Record<string, unknown>,
) {
  const { publishedAt, ...rest } = data;
  return {
    ...rest,
    publishedAt: publishedAt?.toISOString(),
  };
}

export async function createProductAction(input: unknown) {
  const locale = await getRequestLocale();

  return runAction({
    schema: createProductSchema,
    input,
    handler: (data) => createProduct(toJsonBody(data)),
    revalidatePaths: [listPath(locale)],
  });
}

export async function updateProductAction(input: unknown) {
  const locale = await getRequestLocale();

  return runAction({
    schema: updateProductSchema,
    input,
    handler: (data) => updateProduct(toJsonBody(data)),
    revalidatePaths: (data) => [
      listPath(locale),
      `${listPath(locale)}/${data.id}`,
    ],
  });
}

export async function deleteProductAction(input: unknown) {
  const locale = await getRequestLocale();

  return runAction({
    schema: deleteProductSchema,
    input,
    handler: (data) => deleteProduct(data.id),
    revalidatePaths: [listPath(locale)],
  });
}

export async function bulkDeleteProductsAction(input: unknown) {
  const locale = await getRequestLocale();

  return runAction({
    schema: bulkDeleteProductsSchema,
    input,
    handler: (data) => bulkDeleteProducts(data.ids),
    revalidatePaths: [listPath(locale)],
  });
}

export async function toggleProductStatusAction(input: unknown) {
  const locale = await getRequestLocale();

  return runAction({
    schema: toggleProductStatusSchema,
    input,
    handler: (data) => toggleProductStatus(data),
    revalidatePaths: (data) => [
      listPath(locale),
      `${listPath(locale)}/${data.id}`,
    ],
  });
}
```

Always prefix `revalidatePath` with the current locale (`/en/products`, `/ar/products`). `getRequestLocale()` is safe in actions.

Special case: `loginAction` also writes cookies and strips tokens before returning `ActionResult<AuthUser>`. Domain CRUD should just return `runAction(...)`.

---

## 5) Shared form

`src/components/forms/products/Product_FR.tsx`

Owns `useCrudForm`. Used inside `FormDialog` and (if needed) on a full page.

Do **not** `{...field}` on widgets that do not speak native `value` + `onChange(event)`. Map Select, Checkbox, DateInput, uploaders, and TipTap explicitly.

```tsx
"use client";

import { useTranslations } from "next-intl";

import {
  createProductAction,
  updateProductAction,
} from "@/actions/products";
import { DateInput } from "@/components/shared/forms/DateInput";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormErrors,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  SubmitButton,
  useCrudForm,
} from "@/lib/forms";
import type { Product } from "@/types/products";
import {
  createProductSchema,
  updateProductSchema,
} from "@/validations/products/product.schemas";

type ProductFormProps = {
  mode: "create" | "update";
  entity?: Product;
  onClose?: () => void;
};

export function Product_FR({ mode, entity, onClose }: ProductFormProps) {
  const t = useTranslations("Products");
  const tCrud = useTranslations("Crud");
  const isUpdate = mode === "update";

  const { form, onSubmit, serverErrors, isSubmitting } = useCrudForm({
    schema: isUpdate ? updateProductSchema : createProductSchema,
    defaultValues: isUpdate
      ? {
          id: entity!.id,
          name: entity!.name,
          sku: entity!.sku,
          description: entity!.description ?? "",
          status: entity!.status,
          publishedAt: entity!.publishedAt
            ? new Date(entity!.publishedAt)
            : undefined,
        }
      : {
          name: "",
          sku: "",
          description: "",
          status: "draft",
          publishedAt: undefined,
        },
    action: isUpdate ? updateProductAction : createProductAction,
    onSuccess: () => onClose?.(),
    resetOnSuccess: !isUpdate,
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <FormErrors errors={serverErrors} title={tCrud("errorsTitle")} />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.name")}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.sku")}</FormLabel>
              <FormControl>
                <Input dir="ltr" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.description")}</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.status")}</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="active">{t("status.active")}</SelectItem>
                  <SelectItem value="draft">{t("status.draft")}</SelectItem>
                  <SelectItem value="archived">{t("status.archived")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publishedAt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.publishedAt")}</FormLabel>
              <FormControl>
                <DateInput
                  value={field.value}
                  onChange={field.onChange}
                  withTime
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {tCrud("cancel")}
          </Button>
          <SubmitButton loading={isSubmitting} loadingLabel={tCrud("saving")}>
            {tCrud("save")}
          </SubmitButton>
        </DialogFooter>
      </form>
    </Form>
  );
}
```

### Checkbox

```tsx
<FormField
  control={form.control}
  name="featured"
  render={({ field }) => (
    <FormItem className="flex items-center gap-2 space-y-0">
      <FormControl>
        <Checkbox
          checked={field.value}
          onCheckedChange={(checked) => field.onChange(checked === true)}
        />
      </FormControl>
      <FormLabel>{t("fields.featured")}</FormLabel>
    </FormItem>
  )}
/>
```

Schema: `featured: z.boolean()`.

### Rich text

```tsx
<FormField
  control={form.control}
  name="body"
  render={({ field }) => (
    <FormItem>
      <FormLabel>{t("fields.body")}</FormLabel>
      <FormControl>
        <RichTextEditor value={field.value} onChange={field.onChange} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

Schema: `body: z.string().trim().min(1)`.

### Image uploader + optimize (multipart)

Form field — `ImageUploader` calls `onChange(File[])`, not a native input event:

```tsx
<FormField
  control={form.control}
  name="image"
  render={({ field }) => (
    <FormItem>
      <FormLabel>{t("fields.image")}</FormLabel>
      <FormControl>
        <ImageUploader
          maxImages={1}
          columns={1}
          onChange={(files) => field.onChange(files[0])}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

Schema:

```ts
const imageFileSchema = z.custom<File>(
  (value) => typeof File !== "undefined" && value instanceof File && value.size > 0,
  { message: "Image is required" },
);

export const createProductWithImageSchema = createProductSchema.extend({
  image: imageFileSchema,
});
```

Action — optimize on the server, then send `FormData`:

```ts
"use server";

import { AVATAR_OPTIMIZE_OPTIONS } from "@/config/image-optimize";
import { runAction } from "@/lib/forms/server";
import { optimizeImageFile } from "@/lib/images";
import { createProductWithImage } from "@/services/products";
import { createProductWithImageSchema } from "@/validations/products/product.schemas";

export async function createProductWithImageAction(input: unknown) {
  const locale = await getRequestLocale();

  return runAction({
    schema: createProductWithImageSchema,
    input,
    handler: async (data) => {
      const image = await optimizeImageFile(data.image, AVATAR_OPTIMIZE_OPTIONS);
      return createProductWithImage({
        name: data.name,
        sku: data.sku,
        status: data.status,
        description: data.description,
        publishedAt: data.publishedAt?.toISOString(),
        image,
      });
    },
    revalidatePaths: [`/${locale}/products`],
  });
}
```

Presets: `AVATAR_OPTIMIZE_OPTIONS`, `LOGO_OPTIMIZE_OPTIONS`, `DOCUMENT_IMAGE_OPTIMIZE_OPTIONS` in `src/config/image-optimize.ts`. Call `optimizeImageFile` / `optimizeImageFiles` from server actions only (`sharp` is server-only).

### File uploader (multiple)

```tsx
<FormField
  control={form.control}
  name="attachments"
  render={({ field }) => (
    <FormItem>
      <FormLabel>{t("fields.attachments")}</FormLabel>
      <FormControl>
        <FileUploader
          maxFiles={5}
          onChange={field.onChange}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

Schema: `attachments: z.array(z.custom<File>((v) => v instanceof File)).max(5)`. In the action, `toFormData({ …fields, attachments: data.attachments })` appends each file under the same key.

---

## 6) Dialogs

### Add — `src/components/dialogs/products/AddProduct_DL.tsx`

```tsx
"use client";

import { useTranslations } from "next-intl";

import { Product_FR } from "@/components/forms/products";
import { FormDialog, type CrudDialogProps } from "@/lib/forms";

export function AddProduct_DL(props: CrudDialogProps) {
  const t = useTranslations("Products");

  return (
    <FormDialog title={t("dialogs.addTitle")} {...props}>
      {({ onClose, formKey }) => (
        <Product_FR key={formKey} mode="create" onClose={onClose} />
      )}
    </FormDialog>
  );
}
```

### Update — `src/components/dialogs/products/UpdateProduct_DL.tsx`

```tsx
"use client";

import { useTranslations } from "next-intl";

import { Product_FR } from "@/components/forms/products";
import { FormDialog, type CrudDialogProps } from "@/lib/forms";
import type { Product } from "@/types/products";

export function UpdateProduct_DL({
  entity,
  ...props
}: CrudDialogProps & { entity: Product }) {
  const t = useTranslations("Products");

  return (
    <FormDialog title={t("dialogs.updateTitle")} {...props}>
      {({ onClose, formKey }) => (
        <Product_FR
          key={formKey}
          mode="update"
          entity={entity}
          onClose={onClose}
        />
      )}
    </FormDialog>
  );
}
```

### Delete — `src/components/dialogs/products/DeleteProduct_DL.tsx`

```tsx
"use client";

import { useTranslations } from "next-intl";

import { deleteProductAction } from "@/actions/products";
import { ConfirmDialog, type CrudDialogProps } from "@/lib/forms";
import type { Product } from "@/types/products";

export function DeleteProduct_DL({
  entity,
  ...props
}: CrudDialogProps & { entity: Product }) {
  const t = useTranslations("Products");

  return (
    <ConfirmDialog
      title={t("dialogs.deleteTitle")}
      description={t("dialogs.deleteDescription", { name: entity.name })}
      action={deleteProductAction}
      actionInput={{ id: entity.id }}
      {...props}
    />
  );
}
```

`ConfirmDialog` takes a **typed** `actionInput`, not FormData. Default confirm/cancel labels come from `Crud`.

### Toggle / archive confirm

Same `ConfirmDialog`; change `action` + `actionInput`:

```tsx
<ConfirmDialog
  title={t("dialogs.archiveTitle")}
  description={t("dialogs.archiveDescription", { name: entity.name })}
  confirmLabel={t("dialogs.archiveConfirm")}
  action={toggleProductStatusAction}
  actionInput={{ id: entity.id, status: "archived" }}
/>
```

---

## 7) List page (Server Component)

`src/app/[locale]/(main)/products/page.tsx`

```tsx
import { getTranslations, setRequestLocale } from "next-intl/server";

import { BreadCrumb } from "@/components/shared/navigation/BreadCrumb";
import { ErrorHandler } from "@/components/shared/error/ErrorHandler";
import { MainH } from "@/components/shared/text/Headings";
import { getUrlParams, listUrlParams } from "@/lib/http";
import { getProducts } from "@/services/products";

import { ProductsTable } from "./_components/ProductsTable";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ProductsPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "Products" });
  const query = await getUrlParams(searchParams, {
    ...listUrlParams,
    status: "string",
  });

  const response = await getProducts(query);

  if (!response.success) {
    return (
      <ErrorHandler
        statusCode={response.statusCode}
        message={response.message}
      />
    );
  }

  const { items = [], pagination } = response.data ?? {
    items: [],
    pagination: { page: 1, limit: 10, total: 0, totalPages: 1 },
  };

  return (
    <div className="space-y-6">
      <BreadCrumb items={[{ label: t("pageTitle") }]} />
      <MainH title={t("pageTitle")} />
      <ProductsTable products={items} totalPages={pagination.totalPages} />
    </div>
  );
}
```

`loading.tsx` next to the page: `<ListPage_SK />`.

`listUrlParams` already maps `page`, `limit`, and `search`. Add extra keys (`status`) on the page.

---

## 8) Table — inline triggers (default)

`src/app/[locale]/(main)/products/_components/ProductsTable.tsx`

```tsx
"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash } from "lucide-react";
import { useMemo } from "react";
import { useTranslations } from "next-intl";

import { AddProduct_DL } from "@/components/dialogs/products/AddProduct_DL";
import { DeleteProduct_DL } from "@/components/dialogs/products/DeleteProduct_DL";
import { UpdateProduct_DL } from "@/components/dialogs/products/UpdateProduct_DL";
import { SearchFilter } from "@/components/shared/filters/SearchFilter";
import { Pagination } from "@/components/shared/filters/Pagination";
import { DataTable } from "@/components/shared/table/DataTable";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/products";

export function ProductsTable({
  products,
  totalPages,
}: {
  products: Product[];
  totalPages: number;
}) {
  const t = useTranslations("Products");

  const columns = useMemo<ColumnDef<Product>[]>(
    () => [
      { accessorKey: "name", header: t("columns.name") },
      { accessorKey: "sku", header: t("columns.sku") },
      {
        accessorKey: "status",
        header: t("columns.status"),
        cell: ({ row }) => t(`status.${row.original.status}`),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end gap-1">
            <UpdateProduct_DL
              entity={row.original}
              trigger={
                <Button variant="ghost" size="icon" aria-label={t("dialogs.updateTitle")}>
                  <Pencil />
                </Button>
              }
            />
            <DeleteProduct_DL
              entity={row.original}
              trigger={
                <Button variant="ghost" size="icon" aria-label={t("dialogs.deleteTitle")}>
                  <Trash />
                </Button>
              }
            />
          </div>
        ),
      },
    ],
    [t],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SearchFilter />
        <AddProduct_DL
          trigger={<Button><Plus />{t("dialogs.addTitle")}</Button>}
        />
      </div>

      <DataTable columns={columns} data={products} getRowId={(row) => row.id} />

      <Pagination pages={totalPages} />
    </div>
  );
}
```

`SearchFilter` defaults to the `search` query param. URL changes refetch the RSC page; `DataTable` shows skeletons while `QueryNavigationProvider` is pending.

---

## 9) Table — single instance (heavy forms)

Use this when the form is large, has uploads, or the table has many rows.

```tsx
const [editTarget, setEditTarget] = useState<Product | null>(null);

// actions cell:
<Button variant="ghost" size="icon" onClick={() => setEditTarget(row.original)}>
  <Pencil />
</Button>

{editTarget ? (
  <UpdateProduct_DL
    entity={editTarget}
    open
    onOpenChange={(next) => {
      if (!next) setEditTarget(null);
    }}
  />
) : null}
```

Lazy-load the dialog:

```tsx
const UpdateProduct_DL = dynamic(
  () =>
    import("@/components/dialogs/products/UpdateProduct_DL").then(
      (m) => m.UpdateProduct_DL,
    ),
  { ssr: false },
);
```

---

## 10) Bulk delete

```tsx
<DataTable
  columns={columns}
  data={products}
  enableRowSelection
  getRowId={(product) => product.id}
  renderBulkActions={({ ids, count, clear }) => (
    <DeleteProductsBulk_DL
      ids={ids}
      count={count}
      onSuccess={clear}
      trigger={
        <Button variant="destructive" size="sm">
          {t("bulk.deleteSelected", { count })}
        </Button>
      }
    />
  )}
/>
```

```tsx
"use client";

import { useTranslations } from "next-intl";

import { bulkDeleteProductsAction } from "@/actions/products";
import { ConfirmDialog, type CrudDialogProps } from "@/lib/forms";

export function DeleteProductsBulk_DL({
  ids,
  count,
  ...props
}: CrudDialogProps & { ids: string[]; count: number }) {
  const t = useTranslations("Products");

  return (
    <ConfirmDialog
      title={t("dialogs.bulkDeleteTitle")}
      description={t("dialogs.bulkDeleteDescription", { count })}
      action={bulkDeleteProductsAction}
      actionInput={{ ids }}
      {...props}
    />
  );
}
```

Call `clear()` on success (`onSuccess={clear}`) so stale ids do not linger after `router.refresh()`. Selection is page-scoped and resets when URL search params change.

---

## 11) Detail action bar

`src/app/[locale]/(main)/products/[id]/_components/ProductDetailsActions.tsx`

```tsx
"use client";

import { useTranslations } from "next-intl";

import { DeleteProduct_DL } from "@/components/dialogs/products/DeleteProduct_DL";
import { UpdateProduct_DL } from "@/components/dialogs/products/UpdateProduct_DL";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/products";

export function ProductDetailsActions({ entity }: { entity: Product }) {
  const t = useTranslations("Products");

  return (
    <div className="flex gap-3">
      <UpdateProduct_DL
        entity={entity}
        trigger={<Button>{t("dialogs.updateTitle")}</Button>}
      />
      <DeleteProduct_DL
        entity={entity}
        redirectTo="/products"
        trigger={<Button variant="destructive">{t("dialogs.deleteTitle")}</Button>}
      />
    </div>
  );
}
```

`ConfirmDialog` → `useConfirmAction` uses `next/navigation` `router.push`, so include the locale:

```tsx
redirectTo={`/${locale}/products`}
```

---

## 12) Full-page form (no dialog)

Login is the reference: `src/components/forms/auth/Login_FR.tsx`.

```tsx
const { form, onSubmit, serverErrors, isSubmitting } = useCrudForm({
  schema: loginSchema,
  defaultValues: { email: "", password: "" },
  action: (values) => loginAction(values, locale),
  resetOnSuccess: false,
  onSuccess: (result) => {
    if (result.data) setAuthUser(result.data);
    router.replace("/");
  },
});
```

Use this for auth, multi-step wizards, or settings pages that should not sit in a dialog. Still: typed object → server action → `runAction`. No `fetch("/api/…")` from the client.

---

## 13) i18n

Add the same tree to **both** catalogs. Mutation toasts stay on `result.message` — do not duplicate them here.

Shared kit keys (already present):

```json
"Crud": {
  "confirm": "Confirm",
  "cancel": "Cancel",
  "save": "Save",
  "saving": "Saving...",
  "errorsTitle": "Please fix the following",
  "unexpectedError": "Something went wrong"
}
```

Entity namespace (add when you add the module):

```json
"Products": {
  "pageTitle": "Products",
  "fields": {
    "name": "Name",
    "sku": "SKU",
    "description": "Description",
    "status": "Status",
    "publishedAt": "Published",
    "image": "Image",
    "attachments": "Attachments",
    "featured": "Featured"
  },
  "columns": {
    "name": "Name",
    "sku": "SKU",
    "status": "Status"
  },
  "status": {
    "active": "Active",
    "draft": "Draft",
    "archived": "Archived"
  },
  "dialogs": {
    "addTitle": "Add product",
    "updateTitle": "Edit product",
    "deleteTitle": "Delete product",
    "deleteDescription": "Delete {name}? This cannot be undone.",
    "archiveTitle": "Archive product",
    "archiveDescription": "Archive {name}?",
    "archiveConfirm": "Archive",
    "bulkDeleteTitle": "Delete selected products",
    "bulkDeleteDescription": "Delete {count, plural, one {# product} other {# products}}?"
  },
  "bulk": {
    "deleteSelected": "Delete selected"
  }
}
```

Arabic: same keys in `messages/ar.json`.

Shared table chrome (`empty`, `selection.*`) stays in `Table`. Column headers and dialog copy stay in the entity namespace.

Sidebar: add `titleKey` in `src/config/navigation.ts` and matching `Nav.*` keys in both catalogs.

---

## Checklist

- [ ] Types
- [ ] Zod schemas (create / update / delete, plus bulk/toggle if needed)
- [ ] Service `*.api.ts` (all HTTP)
- [ ] Actions via `runAction` (no HTTP client)
- [ ] `{Entity}_FR` with `useCrudForm` (shared create/update)
- [ ] Add / Update `_DL` wrapping `FormDialog` (`key={formKey}`)
- [ ] Delete `_DL` wrapping `ConfirmDialog`
- [ ] List RSC page + filters + `ErrorHandler` + `_components` table
- [ ] i18n keys in **both** locales + `Nav` if it is in the sidebar
- [ ] Detail bar if a detail route exists (`redirectTo`)
- [ ] Verify: open → submit → toast → refresh → close / redirect in `/en` and `/ar`

---

## Anti-patterns

- `useFormDialog` + `<form action={formAction}>` + FormData when this kit exists
- Hardcoded toast strings when `result.message` exists
- Copy-pasting toast / `useEffect` into every dialog
- `apiClient` or `runAction` imported from a client component
- `apiClient` imported from `*.actions.ts`
- Two dialogs for the same operation (trigger-only + controlled-only)
- Marking a whole **page** `"use client"` just to host a dialog
- Adding `id: "select"` to column defs when `enableRowSelection` is on
- Adding a message key to only `en.json` or only `ar.json`

---

## Related

- Live login example: `src/components/forms/auth/Login_FR.tsx`, `src/actions/auth/login.actions.ts`
- Kit: `src/lib/forms/`
- Image optimize: `src/lib/images/`, `src/config/image-optimize.ts`
- HTTP helpers: `src/lib/http` (`toQueryString`, `toFormData`, `getUrlParams`)
- Table: [Table](../features/table.md)
- Filters: [State and URL filters](./state-and-url-filters.md)
- i18n: [Internationalization](../i18n.md)
- Adding a route: [Add a new page](./add-new-page.md)
