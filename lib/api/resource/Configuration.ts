import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import { Resource } from "./Resource.js";

export class ConfigurationResource extends Resource {
  key!: string;

  constructor({ key }: ConfigurationResourceInitializer) {
    super();
    this.key = key;
  }

  validateSelf(): ValidationError[] {
    const errors: ValidationError[] = [];
    checkType("string", this.key, errors);
    return errors;
  }
}

export interface ConfigurationResourceInitializer {
  key: ConfigurationResource["key"];
}
