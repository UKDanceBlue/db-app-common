import { instanceToPlain, plainToInstance } from "class-transformer";

import type { PrimitiveObject } from "../../util/TypeUtils.js";
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
  getUniqueId(): string {
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
  abstract validateSelf(): ValidationError[];

  validateSelfOrThrow(): void {
    const errors = this.validateSelf();
    if (errors.length > 0) {
      throw errors[0] ?? new Error("Unknown error.");
    }
  }

  serialize(): PrimitiveObject {
    this.validateSelfOrThrow();
    return instanceToPlain(this);
  }

  static serializeArray<T extends Resource>(instances: T[]): PrimitiveObject[] {
    const errors: ValidationError[] = [];
    const plain = instances.map((i) => {
      const instanceErrors = i.validateSelf();
      errors.push(...instanceErrors);
      return instanceToPlain(i);
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
   * @param plain The plain object to deserialize (must be a primitive object).
   * @return A tuple containing the deserialized instance and any validation
   * errors.
   */
  static deserialize<V extends PrimitiveObject, T extends Resource>(
    this: new () => T,
    plain: V
  ): [T, ValidationError[]] {
    const instance = plainToInstance(this, plain);
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
   * @param plain The plain objects to deserialize (must be an array of primitive objects).
   * @return A tuple containing the deserialized instances and any validation
   * errors.
   */
  static deserializeArray<V extends PrimitiveObject, T extends Resource>(
    this: new () => T,
    plain: V[]
  ): [T[], ValidationError[]] {
    const errors: ValidationError[] = [];
    const instances = plain.map((p) => {
      const instance = plainToInstance(this, p);
      const instanceErrors = instance.validateSelf();
      errors.push(...instanceErrors);
      return instance;
    });
    return [instances, errors];
  }
}

export interface ResourceStatic<Self extends Resource> {
  serializeArray<T extends Self>(instances: T[]): PrimitiveObject[];
  deserialize<V extends PrimitiveObject, T extends Self>(
    this: new () => T,
    plain: V
  ): [T, ValidationError[]];
  deserializeArray<V extends PrimitiveObject, T extends Self>(
    this: new () => T,
    plain: V[]
  ): [T[], ValidationError[]];
}

Resource satisfies ResourceStatic<Resource>;

export interface ResourceConstructor<R extends Resource> {
  new (...args: never[]): R;
  serializeArray: (instances: R[]) => PrimitiveObject[];
  deserialize: (plain: PrimitiveObject) => [R, ValidationError[]];
  deserializeArray: (plain: PrimitiveObject[]) => [R[], ValidationError[]];
}
