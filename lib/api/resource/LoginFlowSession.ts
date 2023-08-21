import { DateTime } from "luxon";

import type { ValidationError } from "../../util/resourceValidation.js";
import { checkType } from "../../util/resourceValidation.js";

import type { PlainResourceObject, ResourceStatic } from "./Resource.js";
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

  public toPlain(): PlainLoginFlowSession {
    const creationDate = this.creationDate.toISO();

    if (creationDate === null) {
      throw new Error(
        "Got null for creationDate.toISO(), creationDate is probably invalid"
      );
    }
    return {
      sessionId: this.sessionId,
      codeVerifier: this.codeVerifier,
      creationDate,
      redirectToAfterLogin: this.redirectToAfterLogin,
    };
  }

  public static fromPlain(
    plain: PlainLoginFlowSession
  ): LoginFlowSessionResource {
    return new LoginFlowSessionResource({
      sessionId: plain.sessionId,
      codeVerifier: plain.codeVerifier,
      creationDate: DateTime.fromISO(plain.creationDate),
      redirectToAfterLogin: plain.redirectToAfterLogin,
    });
  }

  static graphqlType = `#graphql
    type LoginFlowSession {
      sessionId: ID!
      creationDate: DateTime!
      redirectToAfterLogin: String
    }
  `;

  static graphqlQueries = `#graphql
    loginFlowSession(sessionId: ID!): LoginFlowSession
  `;
}

export interface PlainLoginFlowSession
  extends PlainResourceObject<LoginFlowSessionResourceInitializer> {
  sessionId: string;
  codeVerifier: string;
  creationDate: string;
  redirectToAfterLogin: string | null;
}

export interface LoginFlowSessionResourceInitializer {
  sessionId: LoginFlowSessionResource["sessionId"];
  codeVerifier: LoginFlowSessionResource["codeVerifier"];
  creationDate: LoginFlowSessionResource["creationDate"];
  redirectToAfterLogin?: LoginFlowSessionResource["redirectToAfterLogin"];
}

LoginFlowSessionResource satisfies ResourceStatic<
  LoginFlowSessionResource,
  PlainLoginFlowSession
>;
