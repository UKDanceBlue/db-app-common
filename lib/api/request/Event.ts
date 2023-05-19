import type { DateTime, Duration } from "luxon";

import type { EventResource, PlainEvent } from "../resource/Event.js";

import type { CreateBodyToEditBody } from "./BodyTypes.js";
import type {
  FilterOptions,
  PaginationOptions,
  SortingOptions,
} from "./ListQueryTypes.js";

export interface ParsedCreateEventBody {
  eventTitle: string;
  eventSummary?: string;
  eventDescription?: string;
  eventAddress?: string;
  eventOccurrences: DateTime[];
  eventDuration?: Duration;
}

export type EditEventBody = CreateBodyToEditBody<PlainEvent>;

export type ParsedEditEventBody = CreateBodyToEditBody<ParsedCreateEventBody>;

export interface GetEventParams {
  eventId: string;
}

export interface ListEventsQuery
  extends SortingOptions,
    PaginationOptions,
    FilterOptions<EventResource> {}
