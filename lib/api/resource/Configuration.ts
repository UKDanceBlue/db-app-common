import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import type { PlainResourceObject, ResourceStatic } from "./Resource.js";
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

  public toPlain(): PlainConfiguration {
    return {
      key: this.key,
    };
  }

  public static fromPlain(plain: PlainConfiguration): ConfigurationResource {
    return new ConfigurationResource({
      key: plain.key,
    });
  }
}

export interface ConfigurationResourceInitializer {
  key: ConfigurationResource["key"];
}

export interface PlainConfiguration
  extends PlainResourceObject<ConfigurationResourceInitializer> {
  key: string;
}

ConfigurationResource satisfies ResourceStatic<
  ConfigurationResource,
  PlainConfiguration
>;
