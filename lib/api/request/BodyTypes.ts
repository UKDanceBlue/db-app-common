import type { OptionalToNullable } from "../../util/TypeUtils.js";

export enum EditType {
  MODIFY = 0,
  REPLACE = 1,
}

export type EditArray<T extends unknown[] | (unknown[] | undefined)> =
  | {
      type: EditType.MODIFY;
      /**
       * The items to add to the array
       */
      add: T;
      /**
       * The items to remove from the array (must be strict equal to the removed item)
       */
      remove: T;
    }
  | {
      type: EditType.REPLACE;
      /**
       * Replacement for the array
       */
      set: T;
    }
  | (T extends NonNullable<T> ? never : undefined);

type CreateBodyToEditBodyUtil<T> = {
  [K in keyof T]: T[K] extends unknown[]
    ? EditArray<T[K]>
    : OptionalToNullable<T[K]>;
};

interface CreateBodyToEditBodyBase<T, E extends EditType> {
  type: E;
  value: Partial<CreateBodyToEditBodyUtil<T>> | T;
}

interface CreateBodyToEditBodyModify<T>
  extends CreateBodyToEditBodyBase<T, EditType.MODIFY> {
  value: Partial<CreateBodyToEditBodyUtil<T>>;
}

interface CreateBodyToEditBodyReplace<T>
  extends CreateBodyToEditBodyBase<T, EditType.REPLACE> {
  value: T;
}

export type CreateBodyToEditBody<
  T,
  E extends EditType
> = E extends EditType.MODIFY
  ? CreateBodyToEditBodyModify<T>
  : E extends EditType.REPLACE
  ? CreateBodyToEditBodyReplace<T>
  : never;
