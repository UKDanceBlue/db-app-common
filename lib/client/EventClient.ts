import type { PlainEvent } from "../api/resource/Event.js";
import { EventResource } from "../api/resource/Event.js";
import type { CreateEventBody } from "../index.js";
import {
  isCreatedApiResponse,
  isPaginatedApiResponse,
  isSingularOkApiResponse,
} from "../index.js";

import { type ApiClient, SubClientBase } from "./ApiClient.js";
import {
  deserializeCreatedApiResponse,
  deserializePaginatedApiResponse,
  deserializeResourceApiResponse,
} from "./common.js";

export class EventClient extends SubClientBase {
  constructor(apiClient: ApiClient) {
    super(apiClient, "events");
  }

  /**
   * Get an event by its ID.
   *
   * @param eventId The ID of the event to get.
   * @return The event with the given ID.
   * @throws HttpError if the request fails or the response is not OK and the body is not a valid ApiResponse.
   * @throws MalformedResponseError if the response is OK but the body is not a valid ApiResponse.
   * @throws ValidationError if the response is OK and the body is a valid ApiResponse but the data is not a valid EventResource.
   */
  public async getEvent(eventId: string) {
    const apiResponse = await this.makeRequest({
      path: eventId,
      typeGuard: isSingularOkApiResponse,
    });
    const resource = deserializeResourceApiResponse<EventResource, PlainEvent>(
      apiResponse,
      EventResource
    );
    return {
      apiResponse,
      resource,
    };
  }

  /**
   * Get all events.
   *
   * @return All events.
   * @throws HttpError if the request fails or the response is not OK and the body is not a valid ApiResponse.
   * @throws MalformedResponseError if the response is OK but the body is not a valid ApiResponse.
   * @throws ValidationError if the response is OK and the body is a valid ApiResponse but the data is not a valid EventResource[].
   * @throws DeserializationError if the response is OK and the body is a valid ApiResponse and the data is a valid EventResource[] but the data cannot be deserialized.
   */
  public async getAllEvents() {
    const apiResponse = await this.makeRequest({
      typeGuard: isPaginatedApiResponse,
    });
    const resource = deserializePaginatedApiResponse<EventResource, PlainEvent>(
      apiResponse,
      EventResource
    );
    return {
      apiResponse,
      resource,
    };
  }

  public async createEvent(event: CreateEventBody) {
    const apiResponse = await this.makeRequest({
      method: "POST",
      body: JSON.stringify(event),
      typeGuard: isCreatedApiResponse,
    });
    const resource = deserializeCreatedApiResponse<EventResource, PlainEvent>(
      apiResponse,
      EventResource
    );
    return {
      apiResponse,
      resource,
    };
  }
}
