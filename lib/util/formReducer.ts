import { useReducer, useState } from "react";

if (!useReducer || !useState)
  throw new Error("This file is only for use with React");

export type UpdatePayload<T extends object, K extends keyof T = keyof T> = [
  K,
  T[K]
];
export type FormErrors<T extends object> = Partial<
  Record<keyof T | "%STRUCTURE%", boolean | string>
>;

/**
 * Allowed action names:
 * - "reset": Resets the form to the initial state
 * - "update": Updates the form with a new value
 * - "remove-field": Removes a field from the form (ONLY USE FOR OPTIONAL FIELDS)
 * - "set": Sets the entire form to a new value
 */
export const useFormReducer = <T extends object>(
  initialState: T,
  validator?: (state: T) => FormErrors<T>
) => {
  const [errors, setErrors] = useState<FormErrors<T>>({});
  const reducer = useReducer(
    (
      state: T,
      newState:
        | ["reset"]
        | ["update", UpdatePayload<T>]
        | ["remove-field", keyof T]
        | ["set", T]
    ) => {
      switch (newState[0]) {
        case "reset": {
          return initialState;
        }
        case "update": {
          const updatedState = {
            ...state,
            [newState[1][0]]: newState[1][1],
          };
          if (validator) {
            setErrors(validator(updatedState));
          }
          return updatedState;
        }
        case "remove-field": {
          const updatedState = {
            ...state,
          };
          delete updatedState[newState[1]];
          if (validator) {
            setErrors(validator(updatedState));
          }
          return updatedState;
        }
        case "set": {
          if (validator) {
            setErrors(validator(newState[1]));
          }
          return newState[1];
        }
        default: {
          throw new Error("Invalid action");
        }
      }
    },
    initialState
  );

  return [reducer, errors] as const;
};
