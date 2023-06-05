import type { PrimitiveObject, Resource, ResourceStatic } from "../index.js";
import { isPrimitiveObject } from "../index.js";

import { getKeyForResource } from "./config.js";
import type {
  CacheEntryConfig,
  CacheUsage,
  LocalCacheConfig,
  ParsedLocalCacheEntry,
} from "./config.js";

/**
 * Create a cache entry for the given resource.
 *
 * @param resource The resource to create a cache entry for.
 * @param config The cache entry config.
 * @return The cache entry.
 */
export function makeCacheEntryForResource(
  resource: Resource,
  config: CacheEntryConfig
): [string, ParsedLocalCacheEntry] {
  return [
    getKeyForResource(resource.constructor, resource.getUniqueId()),
    { value: resource.toPlain(), ...config },
  ];
}

export class LocalCache {
  constructor(private readonly config: LocalCacheConfig) {}

  public async get(key: string): Promise<ParsedLocalCacheEntry | undefined> {
    const entry = await this.config.provider.get(key);
    if (entry == null) return undefined;
    if (entry.expiresAt != null && entry.expiresAt < Date.now()) {
      await this.delete(key);
      return undefined;
    }

    return {
      ...entry,
      // This cast is OK because we just checked that the value is not null and
      // there is a type guard that ensures that the value is a PrimitiveObject
      // before it is stored in the cache.
      value: JSON.parse(entry.value) as PrimitiveObject,
    };
  }

  public async set(key: string, entry: ParsedLocalCacheEntry): Promise<void> {
    if (entry.expiresAt != null && entry.expiresAt < Date.now()) {
      return this.delete(key);
    }

    if (!isPrimitiveObject(entry.value)) {
      throw new TypeError("The cache entry value must be a primitive object.");
    }

    return this.config.provider.set(key, {
      ...entry,
      value: JSON.stringify(entry.value),
    });
  }

  public async delete(key: string): Promise<void> {
    return this.config.provider.delete(key);
  }

  public async reset(): Promise<void> {
    return this.config.provider.reset();
  }

  public async getUsage(): Promise<CacheUsage> {
    return this.config.provider.getCacheUsage();
  }

  public async setResource(
    resource: Resource,
    config: CacheEntryConfig
  ): Promise<void> {
    const [key, entry] = makeCacheEntryForResource(resource, config);
    return this.set(key, entry);
  }

  public async getResource<R extends Resource>(
    resourceClass: ResourceStatic<R>,
    id: string
  ): Promise<[R, CacheEntryConfig] | undefined> {
    const key = getKeyForResource(resourceClass, id);
    const entry = await this.get(key);
    if (entry == null) return undefined;
    const [resource, errors] = resourceClass.deserialize(entry.value);
    if (errors.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw errors[0];
    }
    return [resource, entry];
  }

  public async isOnline(): Promise<boolean> {
    return this.config.provider.getConnectionStatus();
  }
}
