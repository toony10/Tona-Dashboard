export type FormDataPrimitive = string | number | boolean | Blob;

export type FormDataValue =
  | FormDataPrimitive
  | null
  | undefined
  | ReadonlyArray<FormDataPrimitive | null | undefined>;

export type FormDataFields = Record<string, FormDataValue>;

function isFormDataArray(
  value: FormDataValue,
): value is ReadonlyArray<FormDataPrimitive | null | undefined> {
  return Array.isArray(value);
}

function appendField(
  formData: FormData,
  key: string,
  value: FormDataPrimitive,
): void {
  if (value instanceof Blob) {
    formData.append(key, value);
    return;
  }

  formData.append(key, String(value));
}

export function toFormData(fields?: FormDataFields | null): FormData {
  const formData = new FormData();

  if (!fields) {
    return formData;
  }

  for (const [key, value] of Object.entries(fields)) {
    if (value == null || value === "") {
      continue;
    }

    if (isFormDataArray(value)) {
      for (const item of value) {
        if (item == null || item === "") {
          continue;
        }
        appendField(formData, key, item);
      }
      continue;
    }

    appendField(formData, key, value);
  }

  return formData;
}
