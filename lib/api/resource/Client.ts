import type { PersonResource } from "./Person.js";

export interface ClientResource {
  deviceId: string;

  expoPushToken: string;

  lastUser: PersonResource;
}
