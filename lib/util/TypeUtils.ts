export type Primitive = string | number | bigint | boolean | null | undefined;
export type ExtendedPrimitive =
  | Primitive
  | Record<string | number | symbol, Primitive>;
export interface RecursivePrimitive {
  [key: string | number | symbol]: RecursivePrimitive | ExtendedPrimitive;
}
