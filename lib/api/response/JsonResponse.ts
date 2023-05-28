import type { PrimitiveObject } from "../../util/TypeUtils.js";
import { isPrimitiveObject } from "../../util/TypeUtils.js";

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
  clientActions?: ClientAction[];
}

export interface OkApiResponse<
  DataType extends PrimitiveObject | PrimitiveObject[] = PrimitiveObject
> extends BaseResponse {
  ok: true;
  /**
   * The payload of the response (can be pretty much anything)
   */
  data?: DataType;
}

export function isSingularOkApiResponse<
  DataType extends PrimitiveObject = PrimitiveObject
>(response: unknown): response is OkApiResponse<DataType> {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === true &&
    ("data" in response && response.data !== undefined
      ? isPrimitiveObject(response.data)
      : true)
  );
}

export function isArrayOkApiResponse<
  DataType extends PrimitiveObject[] = PrimitiveObject[]
>(response: unknown): response is OkApiResponse<DataType> {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === true &&
    "data" in response &&
    Array.isArray(response.data) &&
    response.data.every(isPrimitiveObject)
  );
}

export function isOkApiResponse<
  DataType extends PrimitiveObject | PrimitiveObject[] = PrimitiveObject
>(response: unknown): response is OkApiResponse<DataType> {
  return isSingularOkApiResponse(response) || isArrayOkApiResponse(response);
}

/**
 * Creates an OK API response with the given data.
 *
 * @param opts The options
 * @param opts.value The response data
 * @return The OK API response
 */
export function okResponseFrom<
  DataType extends PrimitiveObject | PrimitiveObject[] = PrimitiveObject
>({
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

export interface CreatedApiResponse<
  DataType extends PrimitiveObject = PrimitiveObject
> extends OkApiResponse<DataType> {
  /**
   * The ID of the created resource (this is the UUID not the sequential ID)
   */
  id: string;
}

export function isCreatedApiResponse<
  DataType extends PrimitiveObject = PrimitiveObject
>(response: unknown): response is CreatedApiResponse<DataType> {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === true &&
    "id" in response &&
    typeof response.id === "string"
  );
}

/**
 * Creates a "created" API response indicating that a resource was successfully created.
 * The response will have an `id` property that refers to the UUID of the created resource.
 * It may also have a `data` property if the resource was returned in the response.
 *
 * @param opts The options
 * @param opts.value The response data
 * @param opts.id The ID of the created resource
 * @return The created API response
 */
export function createdResponseFrom<
  DataType extends PrimitiveObject = PrimitiveObject
>({
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

export function isPaginationInfo(
  pagination: unknown
): pagination is PaginationInfo {
  return (
    typeof pagination === "object" &&
    pagination !== null &&
    "page" in pagination &&
    typeof pagination.page === "number" &&
    "pageSize" in pagination &&
    typeof pagination.pageSize === "number" &&
    "total" in pagination &&
    typeof pagination.total === "number"
  );
}

export interface PaginatedApiResponse<
  DataType extends PrimitiveObject = PrimitiveObject
> extends OkApiResponse<DataType[]> {
  /**
   * The pagination settings the server used to generate the response
   */
  pagination: PaginationInfo;
}

export function isPaginatedApiResponse(
  response: unknown
): response is PaginatedApiResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === true &&
    "data" in response &&
    Array.isArray(response.data) &&
    "pagination" in response &&
    isPaginationInfo(response.pagination)
  );
}

export function paginatedResponseFrom<
  DataType extends PrimitiveObject = PrimitiveObject
>({
  value,
  pagination,
}: {
  value: DataType[];
  pagination: PaginationInfo;
}): PaginatedApiResponse<DataType> {
  const okResponse = okResponseFrom({ value });
  return {
    ...okResponse,
    pagination,
  };
}

export interface ApiError<HasCause extends boolean = boolean> {
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
  errorCause?: HasCause extends true ? unknown : never;
}

export interface ErrorApiResponse extends BaseResponse, ApiError {
  ok: false;
}

export function isErrorApiResponse(
  response: unknown
): response is ErrorApiResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "ok" in response &&
    response.ok === false &&
    "errorMessage" in response &&
    typeof response.errorMessage === "string" &&
    ("errorDetails" in response
      ? typeof response.errorDetails === "string"
      : true) &&
    ("errorExplanation" in response
      ? typeof response.errorExplanation === "string"
      : true)
  );
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

export type ApiResponse<DataType extends PrimitiveObject = PrimitiveObject> =
  | OkApiResponse<DataType | DataType[]>
  | CreatedApiResponse<DataType>
  | PaginatedApiResponse<DataType>
  | ErrorApiResponse;

export function isApiResponse(response: unknown): response is ApiResponse {
  return isOkApiResponse(response) || isErrorApiResponse(response);
}
