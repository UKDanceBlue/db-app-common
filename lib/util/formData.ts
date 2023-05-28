import type { Primitive } from "./TypeUtils.js";

export function formDataToJson<AllowFiles extends boolean = false>(
  formData: FormData,
  allowFiles: AllowFiles = false as AllowFiles
): Record<
  string,
  Primitive | Primitive[] | (AllowFiles extends true ? File : never)
> {
  if (allowFiles) {
    const json: Record<string, Primitive | Primitive[] | File> = {};

    for (const [key, value] of formData.entries()) {
      if (!Reflect.has(json, key)) {
        json[key] = value;
        continue;
      }

      if (!Array.isArray(json[key])) {
        if (json[key] instanceof Blob) {
          throw new TypeError("Cannot have multiple files with the same key.");
        }
        json[key] = [json[key] as Primitive];
      }
      (json[key] as Primitive[]).push(value as Primitive);
    }

    return json as Record<
      string,
      Primitive | Primitive[] | (AllowFiles extends true ? File : never)
    >;
  } else {
    const json: Record<string, Primitive | Primitive[]> = {};

    for (const [key, value] of formData.entries()) {
      if (value instanceof Blob) {
        throw new TypeError("Files are not allowed.");
      }

      if (!Reflect.has(json, key)) {
        json[key] = value;
        continue;
      }

      if (!Array.isArray(json[key])) {
        json[key] = [json[key] as Primitive];
      }
      (json[key] as Primitive[]).push(value);
    }

    return json;
  }
}
