import { DateTime, Duration, Interval } from "luxon";

import { Resource } from "../api/resource/Resource.js";

import type { Class, Constructor, TypeOfTypeNames } from "./TypeUtils.js";

export class ValidationError extends TypeError {
  readonly name: string = "ValidationError";
}

export class TypeMismatchError extends ValidationError {
  readonly name: string = "TypeMismatchError";

  constructor(
    readonly expected: string,
    readonly actual: string,
    readonly message = `Expected ${expected}, got ${actual}`
  ) {
    super(message);
  }
}

export class NaNError extends ValidationError {
  readonly name: string = "NaNError";

  constructor(readonly message = "NaN is not a valid number") {
    super(message);
  }
}

export class UnionValidationError extends ValidationError {
  readonly name: string = "UnionValidationError";

  constructor(
    readonly errors: ValidationError[],
    readonly message = "Union validation failed"
  ) {
    super(message);
  }
}

/**
 * This is a list of all the types that have custom validation in checkType.
 * All values start with a capital letter.
 */
type CustomTypeNames =
  | "Class"
  | "Enum"
  | "Duration"
  | "DateTime"
  | "Interval"
  | "Resource"
  | "ANY";

interface CheckTypeOptions {
  /**
   * Whether to allow `undefined` values.
   * If true, `checkType` will return true if the value is `undefined`.
   */
  allowUndefined?: boolean;
  /**
   * Whether to allow `null` values.
   * If true, `checkType` will return true if the value is `null`.
   */
  allowNull?: boolean;
  /**
   * Whether to check if the value is an array.
   * If true, `checkType` will return false if the value is not an array
   * and will check each element of the array against the type.
   *
   * Works slightly differently for `checkUnion`, see its documentation for more details.
   */
  isArray?: boolean;
  /**
   * If provided, will be used in the `instanceof` check for "Resource"
   * and "Class" types.
   * If not provided, the default `Resource` constructor will be used
   * for "Resource" types and the "Class" type will throw an error.
   *
   * Ignored for all types other than `Resource`.
   */
  classToCheck?: Class<unknown>;
  /**
   * If provided, will be used in the check for "Enum" membership.
   * If not provided, an error will be thrown.
   *
   * Ignored for all types other than `Enum`.
   */
  enumToCheck?: Record<never, unknown>;
}

/**
 * Checks that the given value is of the given type.
 * If it is not and `array` is provided, a new `ValidationError` is pushed to `array`.
 *
 * As a special case, NaN is checked against "number" and will be rejected.
 * Object will also reject null and undefined, unless the options allow them.
 *
 * TODO convert most uses of this to a wrapper function that receives a full object and a key name
 * and calls this function with the value of that key. This will allow us to have more helpful
 * error handling.
 *
 * @param type The type to check against.
 * @param value The value to check.
 * @param array An array to push a new `ValidationError` to if the value is not of the given type.
 * @param options Options for the check.
 * @return true if the value is OK, false otherwise.
 * @see ValidationError
 */
export function checkType(
  type: TypeOfTypeNames | CustomTypeNames,
  value: unknown,
  array: ValidationError[],
  options: CheckTypeOptions = {}
): boolean {
  if (options.allowUndefined && value === undefined) {
    return true;
  }
  if (options.allowNull && value === null) {
    return true;
  }

  const actualTypeForError = String(
    (
      Object.getPrototypeOf(value) as
        | { constructor?: Constructor<never> }
        | undefined
    )?.constructor?.name ?? typeof value
  );

  if (options.isArray) {
    // Array check
    if (!Array.isArray(value)) {
      // If it isn't an array, short-circuit and return false.
      const error = new TypeMismatchError("Array", actualTypeForError);
      array.push(error);
      return false;
    }
    // Otherwise, check each element of the array.
    return (value as unknown[]).every((v) =>
      checkType(type, v, array, {
        ...options,
        isArray: false,
      })
    );
  }
  // Decide if we need to do a custom check or if we can just use typeof.
  // If the first character is lowercase, it's a typeof check.
  // eslint-disable-next-line @typescript-eslint/prefer-string-starts-ends-with
  else if (type[0] === type[0]?.toLowerCase()) {
    // typeof check
    if (typeof value !== type) {
      const error = new TypeMismatchError(type, actualTypeForError);
      array.push(error);
      return false;
    }

    // Special check for number
    if (type === "number" && Number.isNaN(value)) {
      const error = new NaNError();
      array.push(error);
      return false;
    }

    // Special check for object
    if (type === "object" && value === null) {
      const error = new TypeMismatchError(type, "null");
      array.push(error);
      return false;
    }
  } else {
    switch (type as CustomTypeNames) {
      // Use instanceof for Date.
      case "Class": {
        if (!options.classToCheck) {
          throw new Error(
            `No class provided for "Class" type in checkType options`
          );
        }
        if (!(value instanceof options.classToCheck)) {
          const error = new TypeMismatchError(
            options.classToCheck.name,
            actualTypeForError
          );
          array.push(error);
          return false;
        }
        break;
      }

      // Check that the value is a key of the enum.
      case "Enum": {
        if (!options.enumToCheck) {
          throw new Error(
            `No enum provided for "Enum" type in checkType options`
          );
        }
        const enumValues = Object.values(options.enumToCheck);
        if (!enumValues.includes(value)) {
          const error = new TypeMismatchError(
            `Enum<${Object.keys(options.enumToCheck).join(" | ")}>`,
            actualTypeForError
          );
          array.push(error);

          return false;
        }
        break;
      }

      // Luxon has built-in type guards for these types.
      case "Duration": {
        if (!Duration.isDuration(value)) {
          const error = new TypeMismatchError(type, actualTypeForError);
          array.push(error);
          return false;
        }
        break;
      }
      case "DateTime": {
        if (!DateTime.isDateTime(value)) {
          const error = new TypeMismatchError(type, actualTypeForError);
          array.push(error);
          return false;
        }
        break;
      }
      case "Interval": {
        if (!Interval.isInterval(value)) {
          const error = new TypeMismatchError(type, actualTypeForError);
          array.push(error);
          return false;
        }
        break;
      }

      // Any resource should be an instance of Resource, if it is we can validate it.
      case "Resource": {
        if (!options.classToCheck) {
          throw new Error(
            `No class provided for "Resource" type in checkType options`
          );
        }

        if (!(value instanceof Resource)) {
          const error = new TypeMismatchError("Resource", actualTypeForError);
          array.push(error);
          return false;
        } else if (!(value instanceof options.classToCheck)) {
          const error = new TypeMismatchError(
            options.classToCheck.name,
            actualTypeForError
          );
          array.push(error);
          return false;
        } else {
          const errors = value.validateSelf();
          if (errors.length > 0) {
            array.push(...errors);
            return false;
          }
        }
        break;
      }
      case "ANY": {
        // ANY is a special type that matches any value, do nothing.
        break;
      }
      default: {
        throw new Error(`Invalid type passed to checkType: "${type}"`);
      }
    }
  }

  return true;
}

/**
 * Tries multiple checks on the given value.
 * If any of the checks succeed, true is returned and no errors are pushed to `array`.
 * If all of the checks fail, false is returned and a new `UnionValidationError` is pushed to `array`.
 *
 * @param checks The checks to try (an array of arguments for `checkType`).
 * @param value The value to check.
 * @param errorsArray An array to push a new `UnionValidationError` to if all of the checks fail.
 * @param options Options for the checks.
 * @param options.isArray Whether to check if the value is an array. If true, each value in the array will be
 * tested against the checks, not the array itself. For example you would wanted to check something like
 * (string | number)[] and not (string[] | number[]). For the latter, you would set the isArray on the
 * checks array
 * @return The type that succeeded, or undefined if all of the checks failed.
 * @see checkType
 * @see UnionValidationError
 */
export function checkUnion<
  TypeNameToTest extends TypeOfTypeNames | CustomTypeNames
>(
  checks: {
    type: TypeNameToTest;
    options?: CheckTypeOptions;
  }[],
  value: unknown,
  errorsArray: ValidationError[],
  options: CheckTypeOptions = {}
):
  | ((typeof options)["isArray"] extends true
      ? TypeNameToTest[]
      : TypeNameToTest)
  | ((typeof options)["allowNull"] extends true ? "null" : never)
  | ((typeof options)["allowUndefined"] extends true ? "undefined" : never)
  | undefined {
  // TODO: This really really needs some testing, there are a lot of ts-expect-error comments which could be masking actual errors.
  if (options.allowUndefined && value === undefined) {
    // @ts-expect-error Typescript doesn't understand that allowUndefined means we can return "undefined".
    return "undefined";
  }
  if (options.allowNull && value === null) {
    // @ts-expect-error Typescript doesn't understand that allowNull means we can return "null".
    return "null";
  }

  if (options.isArray) {
    // Array check
    if (!Array.isArray(value)) {
      // If it isn't an array, short-circuit and return undefined.
      const message = `Expected array, got ${typeof value}`;
      const error = new ValidationError(message);
      errorsArray.push(error);
      return undefined;
    }
    // Otherwise, test each element of the array.
    const unionValidationErrors: ValidationError[] = [];
    const checked: TypeNameToTest[] = [];
    for (const element of value) {
      const checkedType = checkUnion(checks, element, unionValidationErrors, {
        ...options,
        isArray: false,
      });
      if (checkedType) {
        // If any element succeeds, push it to checked and return it.
        checked.push(checkedType);
      }

      // If all elements fail, push a new UnionValidationError to errorsArray.
      const error = new UnionValidationError(unionValidationErrors);
      errorsArray.push(error);
    }
    // If all elements fail, push a new UnionValidationError to errorsArray.
    const error = new UnionValidationError(unionValidationErrors);
    errorsArray.push(error);
  } else {
    // Otherwise, test each check.
    const unionValidationErrors: ValidationError[] = [];
    let ok = false;
    for (const check of checks) {
      ok = checkType(check.type, value, unionValidationErrors, check.options);
      if (ok) {
        // If any check succeeds, return true.
        return check.type;
      }
    }
    // If all checks fail, push a new UnionValidationError to errorsArray.
    const error = new UnionValidationError(unionValidationErrors);
    errorsArray.push(error);
  }

  return undefined;
}
