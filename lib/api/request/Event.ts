import type { Interval } from "luxon";

import type { CreateBodyToEditBody } from "./BodyTypes.js";
import type { PaginationOptions, SortingOptions } from "./ListQueryTypes.js";
import type { BodyDateTime } from "../../util/htmlDateTime.js";

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
  id: string;
}

export interface ListEventsQuery extends SortingOptions, PaginationOptions {}
