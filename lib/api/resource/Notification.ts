import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import type { PlainResourceObject, ResourceStatic } from "./Resource.js";
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

  public toPlain(): PlainNotification {
    return {
      notificationId: this.notificationId,
    };
  }

  public static fromPlain(plain: PlainNotification): NotificationResource {
    return new NotificationResource({
      notificationId: plain.notificationId,
    });
  }
}

export interface PlainNotification
  extends PlainResourceObject<NotificationResourceInitializer> {
  notificationId: string;
}

export interface NotificationResourceInitializer {
  notificationId: NotificationResource["notificationId"];
}

NotificationResource satisfies ResourceStatic<
  NotificationResource,
  PlainNotification
>;
