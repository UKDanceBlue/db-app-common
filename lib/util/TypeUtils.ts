export type Primitive = string | number | bigint | boolean | null | undefined;
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

// eslint-disable-next-line @typescript-eslint/ban-types
export type Abstract<T> = Function & { prototype: T };
export type Constructor<T> = new (...args: unknown[]) => T;
export type Class<T> = Abstract<T> | Constructor<T>;
