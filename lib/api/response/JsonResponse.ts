export enum ClientAction {
  LOGOUT = "logout",
}

export interface BaseResponse {
  /**
   * Whether the request was successful (usually found on a 2xx response)
   */
  ok: boolean;
  /**
   * The client actions to perform, if this field is present
   * the client MUST perform the relevant actions if they are
   * supported.
   */
  clientAction?: ClientAction[];
}

export interface OkApiResponse<DataType> extends BaseResponse {
  ok: true;
  /**
   * The payload of the response (can be pretty much anything)
   */
  data?: DataType;
}

/**
 * Creates an OK API response with the given data.
 *
 * @param opts The options
 * @param opts.value The response data
 * @return The OK API response
 */
export function okResponseFrom<DataType>({
  value = undefined,
}: {
  value?: DataType;
} = {}): OkApiResponse<DataType> {
  const response: OkApiResponse<DataType> = {
    ok: true,
  };
  if (value !== undefined) {
    response.data = value;
  }
  return response;
}

export interface CreatedApiResponse<DataType> extends OkApiResponse<DataType> {
  /**
   * The ID of the created resource (this is the UUID not the sequential ID)
   */
  id: string;
}

/**
 * Creates a created API response with the given data.
 * The response will have an `id` property.
 *
 * @param opts The options
 * @param opts.value The response data
 * @param opts.id The ID of the created resource
 * @return The created API response
 */
export function createdResponseFrom<DataType>({
  value,
  id,
}: {
  value?: DataType;
  id: string;
}): CreatedApiResponse<DataType> {
  const okResponse: OkApiResponse<DataType> =
    value !== undefined ? okResponseFrom({ value }) : okResponseFrom();
  return {
    ...okResponse,
    id,
  };
}

export interface PaginationInfo {
  /**
   * The current page number (1-indexed)
   */
  page: number;
  /**
   * The number of items per page
   */
  pageSize: number;
  /**
   * The total number of items
   */
  total: number;
}

export interface PaginatedApiResponse<DataType>
  extends OkApiResponse<DataType> {
  /**
   * The pagination settings the server used to generate the response
   */
  pagination: PaginationInfo;
}

export interface ApiError {
  /**
   * The error message, this should be a short human-readable, but not
   * necessarily user-friendly, message.
   */
  errorMessage: string;
  /**
   * The error details, this should be a longer human-readable, but not
   * necessarily user-friendly, message.
   */
  errorDetails?: string;
  /**
   * The error explanation, this should be a user-friendly message.
   * If present, this should be shown to the user.
   */
  errorExplanation?: string;
  /**
   * The error cause, this should be the original error that caused the
   * error response. This should not be shown to the user and for some
   * errors can be used to address the issue.
   */
  errorCause?: unknown;
}

export interface ErrorApiResponse extends BaseResponse, ApiError {
  ok: false;
}

/**
 * Creates an error API response with the given error message.
 *
 * @param root0 The options
 * @param root0.errorMessage The error message
 * @param root0.errorDetails The error details
 * @param root0.errorCause The error cause
 * @param root0.errorExplanation The error explanation
 * @return The error API response
 */
export function errorResponseFrom({
  errorMessage,
  errorDetails = undefined,
  errorExplanation = undefined,
  errorCause = undefined,
}: ApiError): ErrorApiResponse {
  const response: ErrorApiResponse = {
    errorMessage,
    ok: false,
  };

  if (errorDetails !== undefined) {
    response.errorDetails = errorDetails;
  }
  if (errorExplanation !== undefined) {
    response.errorExplanation = errorExplanation;
  }
  if (errorCause !== undefined) {
    response.errorCause = errorCause;
  }

  return response;
}

export type ApiResponse<DataType> =
  | OkApiResponse<DataType>
  | PaginatedApiResponse<DataType>
  | ErrorApiResponse;
