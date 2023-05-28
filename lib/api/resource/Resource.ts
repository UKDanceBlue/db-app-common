import type { ExcludeValues, PrimitiveObject } from "../../util/TypeUtils.js";
import type { ValidationError } from "../../util/resourceValidation.js";

export abstract class Resource {
  static defaultStrict = false;

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

  /**
   * This method both checks the types of the properties on the instance
   * and that they are valid values for the properties For example, if
   * the instance has a property that should be a URL, it will check that
   * the property is a valid URL.
   *
   * This function does not work as a type guard.
   */
  public abstract validateSelf(): ValidationError[];

  public validateSelfOrThrow(): void {
    const errors = this.validateSelf();
    if (errors.length > 0) {
      throw errors[0] ?? new Error("Unknown error.");
    }
  }

  public abstract toPlain(): PlainResourceObject<Resource>;

  public serialize(): PrimitiveObject {
    this.validateSelfOrThrow();
    return this.toPlain();
  }

  public static serializeArray<T extends Resource>(
    instances: T[]
  ): PrimitiveObject[] {
    const errors: ValidationError[] = [];
    const plain = instances.map((i) => {
      const instanceErrors = i.validateSelf();
      errors.push(...instanceErrors);
      return i.toPlain();
    });

    return plain;
  }

  /**
   * This method is a wrapper around class-transformer's `plainToInstance` and
   * class-validator's `validateOrReject` methods. It is a convenience method
   * for deserializing a plain object into a class instance and validating it
   * in one step.
   *
   * @param this The resource class to deserialize into.
   * @param this.fromPlain A function that takes a plain object and returns
   * an instance of the resource class, said instance is allowed to be invalid.
   * @param plain The plain object to deserialize (must be a primitive object).
   * @return A tuple containing the deserialized instance and any validation
   * errors.
   */
  public static deserialize<I, R extends Resource>(
    this: {
      new (initializer: I): R;
      fromPlain: ResourceStatic<R, PlainResourceObject<R>>["fromPlain"];
    },
    plain: PrimitiveObject
  ): [R, ValidationError[]] {
    const instance = this.fromPlain(plain as PlainResourceObject<R>);
    const errors = instance.validateSelf();
    return [instance, errors];
  }

  /**
   * This method is a wrapper around class-transformer's `plainToInstance` and
   * class-validator's `validateOrReject` methods. It is a convenience method
   * for deserializing an array of plain objects into an array of class
   * instances and validating them in one step. This function is stable, meaning
   * that the order of the resulting array will match the order of the input
   * array.
   *
   * @param this The resource class to deserialize into.
   * @param this.fromPlain A function that takes a plain object and returns
   * an instance of the resource class, said instance is allowed to be invalid.
   * @param plain The plain objects to deserialize (must be an array of primitive objects).
   * @return A tuple containing the deserialized instances and any validation
   * errors.
   */
  public static deserializeArray<
    V extends PlainResourceObject<R>,
    I,
    R extends Resource
  >(
    this: {
      new (initializer: I): R;
      fromPlain: ResourceStatic<R, PlainResourceObject<R>>["fromPlain"];
    },
    plain: V[]
  ): [R[], ValidationError[]] {
    const errors: ValidationError[] = [];
    const instances = plain.map((p) => {
      const instance = this.fromPlain(p);
      const instanceErrors = instance.validateSelf();
      errors.push(...instanceErrors);
      return instance;
    });
    return [instances, errors];
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

export interface ResourceStatic<
  R extends Resource,
  P extends PlainResourceObject<R> = PlainResourceObject<R>
> {
  new (...args: never[]): R;
  fromPlain: (plain: P) => R;
  serializeArray: (instances: R[]) => PrimitiveObject[];
  deserialize: (plain: PrimitiveObject) => [R, ValidationError[]];
  deserializeArray: (plain: P[]) => [R[], ValidationError[]];
}
