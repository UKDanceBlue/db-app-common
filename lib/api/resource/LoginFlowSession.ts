import type { DateTime } from "luxon";

export interface LoginFlowSessionResource {
  sessionId: string;

  codeVerifier: string;

  creationDate: DateTime;

  redirectToAfterLogin?: string | null;
}
