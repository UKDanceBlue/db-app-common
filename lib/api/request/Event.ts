import type { NullishToOptional } from "../../index.js";
import type { EventResource, PlainEvent } from "../resource/Event.js";

import type {
  FilterOptions,
  PaginationOptions,
  SortingOptions,
} from "./ListQueryTypes.js";

export type CreateEventBody = NullishToOptional<Omit<PlainEvent, "eventId">>;

export interface GetEventParams {
  eventId: string;
}

export interface ListEventsQuery
  extends SortingOptions,
    PaginationOptions,
    FilterOptions<EventResource> {}
