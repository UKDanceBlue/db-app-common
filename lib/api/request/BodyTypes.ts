import type { OptionalToNullable } from "../../util/TypeUtils.js";

export enum EditType {
  MODIFY = 0,
  REPLACE = 1,
}

type EditArray<T extends unknown[]> =
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
    };

type CreateBodyToEditBodyUtil<T> = {
  [K in keyof T]: T[K] extends unknown[]
    ? EditArray<T[K]>
    : OptionalToNullable<T[K]>;
};

export type CreateBodyToEditBody<T> =
  | {
      type: EditType.MODIFY;
      value: Partial<CreateBodyToEditBodyUtil<T>>;
    }
  | {
      type: EditType.REPLACE;
      value: T;
    };
