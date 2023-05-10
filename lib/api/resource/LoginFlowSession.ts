import type { DateTime } from "luxon";

// Probably never used on the client

export interface LoginFlowSessionResource {
  sessionId: string;

  codeVerifier: string;

  creationDate: DateTime;

  redirectToAfterLogin?: string | null;
}
