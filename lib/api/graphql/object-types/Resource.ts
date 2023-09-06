import type { Class } from "utility-types";

import type { ExcludeValues } from "../../../util/TypeUtils.js";

export abstract class Resource {
  /**
   * This method should return a unique identifier for the instance.
   * This is usually a UUID, but should never be the numeric ID of
   * the instance in the database (that should remain internal)
   *
   * WARNING: This method is not implemented by all resources. If you
   * need to use this method, make sure the resource you are using
   * implements it.
   */
  // eslint-disable-next-line class-methods-use-this
  public getUniqueId(): string {
    throw new Error(`Method not implemented by subclass.`);
  }

  protected static doInit<R extends object>(this: unknown, init: Partial<R>): R {
    return Object.assign(new (this as Class<never>)() as R, init);
  }

  protected static init<R extends Resource>(init: R): Resource {
    return Resource.doInit(init);
  }
}

// TODO: there is something funky here, autocomplete is broken and that probably means
// that the type is wrong somehow
export type PlainResourceObject<I extends object> = {
  [key in keyof ExcludeValues<
    I,
    /*
      eslint-disable-next-line @typescript-eslint/ban-types -- We don't care about the lack
      of safety here because we are excluding the values, in fact the added specificity would
      allow illegal values to be included.
      */
    Function
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  >]: unknown;
};
