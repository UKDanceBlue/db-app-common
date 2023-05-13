import type { DateTime } from "luxon";

import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import { Resource } from "./Resource.js";
// Probably never used on the client

export class LoginFlowSessionResource extends Resource {
  sessionId!: string;

  codeVerifier!: string;

  creationDate!: DateTime;

  redirectToAfterLogin!: string | null;

  constructor({
    sessionId,
    codeVerifier,
    creationDate,
    redirectToAfterLogin,
  }: LoginFlowSessionResourceInitializer) {
    super();
    this.sessionId = sessionId;
    this.codeVerifier = codeVerifier;
    this.creationDate = creationDate;
    this.redirectToAfterLogin = redirectToAfterLogin ?? null;
  }

  validateSelf(): ValidationError[] {
    const errors: ValidationError[] = [];
    checkType("string", this.sessionId, errors);
    checkType("string", this.codeVerifier, errors);
    checkType("DateTime", this.creationDate, errors);
    checkType("string", this.redirectToAfterLogin, errors);
    return errors;
  }
}

export interface LoginFlowSessionResourceInitializer {
  sessionId: LoginFlowSessionResource["sessionId"];
  codeVerifier: LoginFlowSessionResource["codeVerifier"];
  creationDate: LoginFlowSessionResource["creationDate"];
  redirectToAfterLogin?: LoginFlowSessionResource["redirectToAfterLogin"];
}
