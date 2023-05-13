import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import { Resource } from "./Resource.js";
export class NotificationResource extends Resource {
  notificationId!: string;

  constructor({ notificationId }: NotificationResourceInitializer) {
    super();
    this.notificationId = notificationId;
  }

  validateSelf(): ValidationError[] {
    const errors: ValidationError[] = [];
    checkType("string", this.notificationId, errors);
    return errors;
  }
}

export interface NotificationResourceInitializer {
  notificationId: NotificationResource["notificationId"];
}
