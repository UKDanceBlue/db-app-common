export type SimplePrimitive = string | number | boolean;
export type Primitive = SimplePrimitive | null | undefined;
export type ShallowPrimitiveObject =
  | Primitive
  | Record<string | number | symbol, Primitive>;
export interface PrimitiveObject {
  [key: string | number | symbol]: PrimitiveObject | Primitive;
}

export function isPrimitive(value: unknown): value is Primitive {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    value === null ||
    value === undefined
  );
}

function isPrimitiveObjectRecurse(
  value: unknown
): value is PrimitiveObject | Primitive {
  if (isPrimitive(value)) {
    return true;
  } else if (typeof value === "object" && value !== null) {
    for (const key in value) {
      if (
        !isPrimitiveObjectRecurse((value as Record<typeof key, unknown>)[key])
      ) {
        return false;
      }
    }
    return true;
  } else {
    return false;
  }
}

export function isPrimitiveObject(value: unknown): value is PrimitiveObject {
  if (typeof value !== "object" || value === null) {
    return false;
  } else {
    for (const key in value) {
      if (
        !isPrimitiveObjectRecurse((value as Record<typeof key, unknown>)[key])
      ) {
        return false;
      }
    }
  }
  return true;
}

export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};
export type OptionalNullOrUndefined<T> = Partial<{
  [K in keyof T]: NonNullable<T[K]> | null | undefined;
}>;

export type SelfOrArray<T> = T | T[];

export type RecursiveArray<T> = T | RecursiveArray<T>[];

// eslint-disable-next-line @typescript-eslint/ban-types
export type Abstract<T> = Function & { prototype: T };
export type Constructor<T> = new (...args: unknown[]) => T;
export type Class<T> = Abstract<T> | Constructor<T>;

export type OptionalToNullable<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends NonNullable<T[K]> ? T[K] : T[K] | null;
    }
  : T extends NonNullable<T>
  ? T
  : T | null;

export enum Comparator {
  EQUALS = "eq",
  GREATER_THAN = "gt",
  LESS_THAN = "lt",
  GREATER_THAN_OR_EQUAL_TO = "gte",
  LESS_THAN_OR_EQUAL_TO = "lte",
  INCLUDES = "incl",
}

export type StringComparator = Comparator.EQUALS | Comparator.INCLUDES;
export type NumericComparator =
  | Comparator.EQUALS
  | Comparator.GREATER_THAN
  | Comparator.LESS_THAN
  | Comparator.GREATER_THAN_OR_EQUAL_TO
  | Comparator.LESS_THAN_OR_EQUAL_TO;
export type BooleanComparator = Comparator.EQUALS;
