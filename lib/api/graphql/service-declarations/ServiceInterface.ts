import type { Resource } from "../object-types/Resource.js";

export interface ServiceInterface<R extends Resource> {
  getById(id: string): Promise<R | null>;
  create(input: R): Promise<void>;
  set(id: string, input: R): Promise<void>;
  delete(id: string): Promise<void>;
}
