export type SimplePrimitive = string | number | boolean;
export type Primitive = SimplePrimitive | bigint | null | undefined;
export type ExtendedPrimitive =
  | Primitive
  | Record<string | number | symbol, Primitive>;
export interface RecursivePrimitive {
  [key: string | number | symbol]: RecursivePrimitive | ExtendedPrimitive;
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
