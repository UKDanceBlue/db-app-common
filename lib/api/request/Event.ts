import type { Interval } from "luxon";

import type { BodyDateTime } from "../../util/htmlDateTime.js";
import type { EventResource } from "../resource/Event.js";

import type { CreateBodyToEditBody } from "./BodyTypes.js";
import type {
  FilterOptions,
  PaginationOptions,
  SortingOptions,
} from "./ListQueryTypes.js";

export interface CreateEventBody {
  eventTitle: string;
  eventSummary?: string;
  eventDescription?: string;
  eventAddress?: string;
  eventOccurrences: {
    start: BodyDateTime;
    end: BodyDateTime;
  }[];
  timezone?: string;
}

export interface ParsedCreateEventBody {
  eventTitle: string;
  eventSummary?: string;
  eventDescription?: string;
  eventAddress?: string;
  eventIntervals: Interval[];
}

export type EditEventBody = CreateBodyToEditBody<CreateEventBody>;

export type ParsedEditEventBody = CreateBodyToEditBody<ParsedCreateEventBody>;

export interface GetEventParams {
  eventId: string;
}

export interface ListEventsQuery
  extends SortingOptions,
    PaginationOptions,
    FilterOptions<EventResource> {}
