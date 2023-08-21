import type { DateTime } from "luxon";

import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import type { PersonResource } from "./Person.js";
import type { PlainResourceObject, ResourceStatic } from "./Resource.js";
import { Resource } from "./Resource.js";

export class DeviceResource extends Resource {
  deviceId!: string;
  public expoPushToken!: string | null;
  public lastUser!: PersonResource | string | null;
  public lastLogin!: DateTime | null;

  constructor({
    deviceId,
    expoPushToken,
    lastLogin,
    lastUser,
  }: DeviceResourceInitializer) {
    super();
    this.deviceId = deviceId;
    this.expoPushToken = expoPushToken ?? null;
    this.lastUser = lastUser ?? null;
    this.lastLogin = lastLogin ?? null;
  }

  validateSelf(): ValidationError[] {
    const errors: ValidationError[] = [];
    checkType("string", this.deviceId, errors);
    checkType("string", this.expoPushToken, errors, { allowNull: true });
    checkType("string", this.lastUser, errors, { allowNull: true });
    checkType("string", this.lastLogin, errors, { allowNull: true });
    return errors;
  }

  public toPlain(): PlainDevice {
    return {
      deviceId: this.deviceId,
      expoPushToken: this.expoPushToken,
      lastUser:
        typeof this.lastUser === "string"
          ? this.lastUser
          : this.lastUser?.personId ?? null,
      lastLogin: this.lastLogin,
    };
  }

  public static fromPlain(plain: PlainDevice): DeviceResource {
    return new DeviceResource({
      deviceId: plain.deviceId,
      expoPushToken: plain.expoPushToken,
      lastUser: plain.lastUser,
      lastLogin: plain.lastLogin,
    });
  }

  static graphqlType = `#graphql
    type Device {
      deviceId: ID!
      expoPushToken: String
      lastUser: Person
      lastLogin: DateTime
    }
  `;

  static graphqlQueries = `#graphql
    device(deviceId: ID!): Device
    devices: [Device!]!
  `;
}

export interface DeviceResourceInitializer {
  deviceId: DeviceResource["deviceId"];
  expoPushToken: DeviceResource["expoPushToken"];
  lastUser: DeviceResource["lastUser"];
  lastLogin: DeviceResource["lastLogin"];
}

export interface PlainDevice
  extends PlainResourceObject<DeviceResourceInitializer> {
  deviceId: string;
  expoPushToken: string | null;
  lastUser: string | null;
  lastLogin: DateTime | null;
}

DeviceResource satisfies ResourceStatic<DeviceResource, PlainDevice>;
