import type {
  PlainResourceObject,
  Resource,
  ResourceStatic,
} from "../api/resource/Resource.js";
import type {
  ApiError,
  ApiResponse,
  ClientAction,
  CreatedApiResponse,
  ErrorApiResponse,
  OkApiResponse,
  PaginatedApiResponse,
  PaginationInfo,
} from "../api/response/JsonResponse.js";
import {
  isErrorApiResponse,
  isOkApiResponse,
} from "../api/response/JsonResponse.js";
import type { PrimitiveObject } from "../util/TypeUtils.js";
import type { ValidationError } from "../util/resourceValidation.js";

export class ApiClientError extends Error {
  constructor(public message: string) {
    super(message);
  }
}

export class HttpError extends ApiClientError {
  constructor(public status: number, public message: string) {
    super(message);
  }
}

export class MalformedResponseError extends ApiClientError {
  constructor(public message: string) {
    super(message);
  }
}

export class DeserializationError extends ApiClientError {
  constructor(message: string, validationError?: ValidationError) {
    super(validationError?.message ?? message);
  }
}

export class ErrorApiResponseError extends ApiClientError {
  readonly apiError: ApiError;

  constructor(public apiResponse: ErrorApiResponse) {
    super(apiResponse.errorMessage);
    const apiError: ApiError = {
      errorMessage: apiResponse.errorMessage,
    };
    if (apiResponse.errorDetails)
      apiError.errorDetails = apiResponse.errorDetails;
    if (apiResponse.errorExplanation)
      apiError.errorExplanation = apiResponse.errorExplanation;
    if (apiResponse.errorCause) apiError.errorCause = apiResponse.errorCause;
    this.apiError = apiError;
  }
}

export async function getResponseBodyOrThrow(
  response: Response
): Promise<ApiResponse> {
  if (!response.ok) {
    try {
      const body = (await response.json()) as unknown;
      if (isErrorApiResponse(body)) {
        return body;
      } else {
        throw new HttpError(response.status, response.statusText);
      }
    } catch (error) {
      throw new HttpError(response.status, response.statusText);
    }
  } else {
    let responseJson: unknown;
    try {
      responseJson = await response.json();
    } catch (error) {
      throw new MalformedResponseError(
        "Failed to parse response body as JSON."
      );
    }
    if (isOkApiResponse(responseJson)) {
      return responseJson;
    } else {
      throw new MalformedResponseError(
        "Response body is not a valid OkApiResponse."
      );
    }
  }
}

export interface DeserializedOkApiResponse {
  clientActions: ClientAction[];
}

export interface DeserializedResourceApiResponse<R extends Resource>
  extends DeserializedOkApiResponse {
  resource: R | undefined;
}

export function deserializeResourceApiResponse<
  R extends Resource,
  P extends PlainResourceObject<R>
>(
  apiResponse: OkApiResponse,
  resourceClass: ResourceStatic<R, P>
): DeserializedResourceApiResponse<R> {
  if (!apiResponse.data) {
    return {
      resource: undefined,
      clientActions: apiResponse.clientActions ?? [],
    };
  }

  const [deserialized, errors] = resourceClass.deserialize(
    // TODO get rid of this cast, there should be a low-overhead way to do this correctly (I want to avoid having to do a full type check)
    apiResponse.data
  );
  if (errors.length > 0) {
    throw new DeserializationError("Failed to deserialize event.", errors[0]);
  }

  return {
    resource: deserialized,
    clientActions: apiResponse.clientActions ?? [],
  };
}

export interface DeserializedArrayApiResponse<R extends Resource>
  extends DeserializedOkApiResponse {
  resources: R[] | undefined;
}

export function deserializeArrayApiResponse<
  R extends Resource,
  P extends PlainResourceObject<R>
>(
  apiResponse: OkApiResponse<PrimitiveObject[]>,
  resourceClass: ResourceStatic<R, P>
): DeserializedArrayApiResponse<R> {
  if (!apiResponse.data) {
    return {
      resources: undefined,
      clientActions: apiResponse.clientActions ?? [],
    };
  }

  const [deserialized, errors] = resourceClass.deserializeArray(
    // TODO get rid of this cast, there should be a low-overhead way to do this correctly (I want to avoid having to do a full type check)
    apiResponse.data as P[]
  );
  if (errors.length > 0) {
    throw new DeserializationError("Failed to deserialize event.", errors[0]);
  }

  return {
    resources: deserialized,
    clientActions: apiResponse.clientActions ?? [],
  };
}

function isApiResponseArray<T extends PrimitiveObject>(
  apiResponse: OkApiResponse<T> | OkApiResponse<T[]>
): apiResponse is OkApiResponse<T[]> {
  return Array.isArray(apiResponse.data);
}

// Function that takes an OkApiResponse<PrimitiveObject> or OkApiResponse<PrimitiveObject[]> and returns a DeserializedOkApiResponse or DeserializedArrayApiResponse.
export function deserializeOkApiResponse<
  R extends Resource,
  P extends PlainResourceObject<R>
>(
  apiResponse: OkApiResponse,
  resourceClass: ResourceStatic<R, P>
): DeserializedResourceApiResponse<R>;
export function deserializeOkApiResponse<
  R extends Resource,
  P extends PlainResourceObject<R>
>(
  apiResponse: OkApiResponse<PrimitiveObject[]>,
  resourceClass: ResourceStatic<R, P>
): DeserializedArrayApiResponse<R>;
export function deserializeOkApiResponse<
  R extends Resource,
  P extends PlainResourceObject<R>
>(
  apiResponse: OkApiResponse | OkApiResponse<PrimitiveObject[]>,
  resourceClass: ResourceStatic<R, P>
): DeserializedResourceApiResponse<R> | DeserializedArrayApiResponse<R> {
  return isApiResponseArray(apiResponse)
    ? deserializeArrayApiResponse(apiResponse, resourceClass)
    : deserializeResourceApiResponse(apiResponse, resourceClass);
}

export interface DeserializedCreatedApiResponse<R extends Resource>
  extends DeserializedResourceApiResponse<R> {
  createdResourceId: string;
}

export function deserializeCreatedApiResponse<
  R extends Resource,
  P extends PlainResourceObject<R>
>(
  apiResponse: CreatedApiResponse,
  resourceClass: ResourceStatic<R, P>
): DeserializedCreatedApiResponse<R> {
  const deserialized = deserializeResourceApiResponse(
    apiResponse,
    resourceClass
  );
  return {
    ...deserialized,
    createdResourceId: apiResponse.id,
  };
}

export interface DeserializedPaginatedApiResponse<R extends Resource>
  extends DeserializedArrayApiResponse<R>,
    PaginationInfo {}

export function deserializePaginatedApiResponse<
  R extends Resource,
  P extends PlainResourceObject<R>
>(
  apiResponse: PaginatedApiResponse,
  resourceClass: ResourceStatic<R, P>
): DeserializedPaginatedApiResponse<R> {
  const deserialized = deserializeArrayApiResponse(apiResponse, resourceClass);
  return {
    ...deserialized,
    ...apiResponse.pagination,
  };
}

export function checkAndHandleError(
  apiResponse: ApiResponse
): asserts apiResponse is Exclude<ApiResponse, ErrorApiResponse> {
  // TODO: Do more than just throw an error.
  if (isErrorApiResponse(apiResponse)) {
    throw new ErrorApiResponseError(apiResponse);
  }
}
