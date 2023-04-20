import type { OptionalToNullable } from "../..";

export enum EditType {
  MODIFY = 0,
  REPLACE = 1,
}

export type EditArray<T> =
  | {
      type: EditType.MODIFY;
      /**
       * The items to add to the array
       */
      add: T[];
      /**
       * The items to remove from the array (must be strict equal to the removed item)
       */
      remove: T[];
    }
  | {
      type: EditType.REPLACE;
      /**
       * Replacement for the array
       */
      set: T[];
    };

type CreateBodyToEditBodyUtil<T> = OptionalToNullable<{
  [K in keyof T]: T[K] extends (infer U)[]
    ? EditArray<CreateBodyToEditBodyUtil<U>>
    : T[K] extends object
    ? CreateBodyToEditBodyUtil<T[K]>
    : T[K];
}>;
export type CreateBodyToEditBody<T> =
  | {
      type: EditType.MODIFY;
      value: Partial<OptionalToNullable<CreateBodyToEditBodyUtil<T>>>;
    }
  | {
      type: EditType.REPLACE;
      value: T;
    };
