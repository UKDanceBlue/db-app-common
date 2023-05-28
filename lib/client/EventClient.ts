import type { PlainEvent } from "../api/resource/Event.js";
import { EventResource } from "../api/resource/Event.js";
import type { CreateEventBody } from "../index.js";
import {
  isCreatedApiResponse,
  isPaginatedApiResponse,
  isSingularOkApiResponse,
} from "../index.js";

import type { ApiClient } from "./ApiClient.js";
import {
  checkAndHandleError,
  deserializeCreatedApiResponse,
  deserializePaginatedApiResponse,
  deserializeResourceApiResponse,
  getResponseBodyOrThrow,
} from "./common.js";

export class EventClient {
  private baseUrl: URL;
  constructor(private apiClient: ApiClient) {
    this.baseUrl = new URL(`${apiClient.apiBaseUrl.href}/event/`);
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
    const url = new URL(eventId, this.baseUrl);
    const response = await this.apiClient.fetch(url);
    const apiResponse = await getResponseBodyOrThrow(response);
    checkAndHandleError(apiResponse);
    if (!isSingularOkApiResponse(apiResponse)) {
      throw new Error("Expected singular OK API response.");
    }
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
    const response = await this.apiClient.fetch(this.baseUrl);
    const apiResponse = await getResponseBodyOrThrow(response);
    checkAndHandleError(apiResponse);
    if (!isPaginatedApiResponse(apiResponse)) {
      throw new Error("Expected paginated API response.");
    }
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
    const response = await this.apiClient.fetch(this.baseUrl, {
      method: "POST",
      body: JSON.stringify(event),
    });
    const apiResponse = await getResponseBodyOrThrow(response);
    checkAndHandleError(apiResponse);
    if (!isCreatedApiResponse(apiResponse)) {
      throw new Error("Expected created API response.");
    }
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
