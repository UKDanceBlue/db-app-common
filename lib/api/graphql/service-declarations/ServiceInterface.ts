import type { ApiError } from "../../response/JsonResponse.js";
import type { Resource } from "../object-types/Resource.js";

export interface ServiceInterface<R extends Resource> {
  getById(id: string): Promise<R | null | ApiError>;
  create(input: R): Promise<{ data?: R, id: string } | ApiError>;
  set(id: string, input: R): Promise<R | ApiError>;
  delete(id: string): Promise<boolean | ApiError>;
}
