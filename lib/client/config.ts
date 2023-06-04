import type { PrimitiveObject, Resource } from "../index.js";

/**
 * The configuration for a cache entry.
 *
 * A cache entry can be one of four states:
 * - Fresh: The entry is probably the same as the server
 * - Stale: The entry is old, but it may still be fresh
 * - Valid: The entry is not yet expired, nothing else is known
 * - Expired: The entry is expired and should not be used
 */
export interface CacheEntryConfig {
  /**
   * The time at which the cache entry will expire.
   *
   * Expired entries will always be deleted from the cache when they are encountered
   * or when a cleanup is performed.
   *
   * This is a UTC timestamp in milliseconds.
   * If not specified, the cache entry will never expire
   */
  expiresAt?: number;
  /**
   * The length of time that this entry should be considered fresh.
   *
   * This means that the entry is almost certain to be valid.
   *
   * This is a UTC timestamp in milliseconds.
   * If not specified, the cache entry will never be considered fresh.
   * If both are specified, it must be less than or equal to staleUntil.
   */
  freshUntil?: number;
  /**
   * The length of time that this entry should be considered stale.
   *
   * This means that the entry may still be valid, but it is not guaranteed.
   * A stale entry will only be used if the request to the server fails or
   * the device is offline.
   *
   * This is a UTC timestamp in milliseconds.
   * If not specified, the cache entry will never be considered stale.
   * If both are specified, it must be greater than or equal to freshUntil.
   */
  staleUntil?: number;
}

export interface LocalCacheEntry extends CacheEntryConfig {
  /**
   * The value of the cache entry.
   * This is a stringified PrimitiveObject.
   */
  value: string;
}

export interface ParsedLocalCacheEntry extends CacheEntryConfig {
  /**
   * The value of the cache entry.
   * This is a PrimitiveObject.
   */
  value: PrimitiveObject;
}

/**
 * Get the key for the given resource, used to index the resource in the cache.
 *
 * @param resource The resource to get the key for.
 * @param id The ID of the resource.
 * @return The key for the given resource.
 */
export function getKeyForResource(
  resource: Resource["constructor"],
  id: string
): string {
  return `${resource.name}/${id}`;
}

export interface CacheUsage {
  /**
   * The number of cache entries.
   */
  count: number;
  /**
   * The total size of all cache entries in bytes or a best-effort estimate.
   */
  size: number;
}

export interface LocalCacheProvider {
  /**
   * Get the cache entry for the given key.
   *
   * @param key The key of the cache entry.
   * @return The cache entry or undefined if the cache entry does not exist.
   */
  get(key: string): Promise<LocalCacheEntry | undefined>;
  /**
   * Set the cache entry for the given key.
   *
   * @param key The key of the cache entry.
   * @param value The cache entry.
   * @return A promise that resolves when the cache entry has been set.
   */
  set(key: string, value: LocalCacheEntry): Promise<void>;
  /**
   * Delete the cache entry for the given key.
   *
   * @param key The key of the cache entry.
   * @return A promise that resolves when the cache entry has been deleted.
   */
  delete(key: string): Promise<void>;
  /**
   * Delete all cache entries.
   *
   * @return A promise that resolves when all cache entries have been deleted.
   */
  reset(): Promise<void>;

  /**
   * Get the cache usage.
   *
   * @return A promise that resolves to the cache usage.
   * @see CacheUsage
   */
  getCacheUsage(): Promise<CacheUsage>;
}

export class BasicProvider implements LocalCacheProvider {
  private cache = new Map<string, LocalCacheEntry>();

  // eslint-disable-next-line @typescript-eslint/require-await
  async get(key: string): Promise<LocalCacheEntry | undefined> {
    return this.cache.get(key);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async set(key: string, value: LocalCacheEntry): Promise<void> {
    this.cache.set(key, value);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async reset(): Promise<void> {
    this.cache.clear();
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async getCacheUsage(): Promise<CacheUsage> {
    let size = 0;
    for (const entry of this.cache.values()) {
      size += entry.value.length;
    }
    return {
      count: this.cache.size,
      size,
    };
  }
}

export interface LocalCacheConfig {
  /**
   * The cache provider to use.
   */
  provider: LocalCacheProvider;
  /**
   * The maximum age of a cache entry in milliseconds.
   *
   * This value is used to determine the maximum age of a cache entry and should
   * be used if the underlying cache provider has an upper limit on the age of
   * cache entries.
   *
   * If this value is defined then non-expiring cache entries will not be
   * allowed (i.e. expireAt must be defined)
   */
  maxEntryAge?: number;
  /**
   * The maximum size of a cache entry in bytes.
   *
   * This value is used to determine the maximum size of a cache entry and
   * should be used if the underlying cache provider has an upper limit on the
   * size of cache entries.
   */
  maxEntrySize?: number;
  /**
   * The maximum number of cache entries.
   *
   * This value is used to determine the maximum number of cache entries and
   * should be used if the underlying cache provider has an upper limit on the
   * number of cache entries.
   */
  maxEntries?: number;
  /**
   * The maximum size of the cache in bytes.
   *
   * This value is used to determine the maximum size of the cache and should
   * be used if the underlying cache provider has an upper limit on the size of
   * the cache.
   */
  maxSize?: number;
}

/**
 * The local cache mode.
 *
 * This usually defaults to 'fallback
 *
 * - never: never use the local cache, always fetch from the server
 * - fallback-fresh: use fresh cache entries if the request fails or the device is offline
 * - fallback: use fresh or stale cache entries if the request fails or the device is offline
 * - fallback-always: use any non-expired cache entry if the request fails or the device is offline
 * - fresh: use fresh cache entries if the request fails or the device is offline
 * - stale: use stale cache entries if the request fails or the device is offline
 * - always: use any non-expired cache entry if the request fails or the device is offline
 *
 * The integer values of this enum are useful for sorting the cache modes as 0 is never, fallbacks
 * are all odd, and non-fallbacks are all even.
 */
export enum LocalCacheMode {
  "never",
  "fallback-fresh",
  "fresh",
  "fallback",
  "stale",
  "fallback-always",
  "always",
}

export function isFallbackMode(mode: LocalCacheMode): boolean {
  return mode % 2 === 1;
}

export interface ApiCallOptions {
  /**
   * The default fetch cache mode.
   * If not provided, then the default fetch cache mode is used.
   *
   * @see https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
   */
  fetchCache?: RequestCache;
  /**
   * The default local cache mode.
   * If not provided, then the default local cache mode is used.
   * If the local cache is not configured, then this option is ignored.
   */
  localCache?: LocalCacheMode;
  /**
   * Configuration for the local cache.
   * If not provided, then the result of the request will not be cached.
   * If the local cache is not configured, then this option is ignored.
   */
  cacheEntryConfig?: CacheEntryConfig;
}

export interface ApiClientConfig {
  /**
   * The base URL of the API.
   */
  baseUrl: URL;
  /**
   * A function that returns the token to use for requests, added to the
   * Authorization header.
   *
   * If not provided, then the token is assumed to be set by the device.
   * This is the case for example if an HTTP-only cookie is used to store the
   * token.
   */
  getToken?: () => Promise<string>;
  /**
   * The local cache configuration.
   * If not provided, then direct caching is disabled and the client will
   * rely on the device (i.e. fetch) to cache responses.
   */
  cache?: LocalCacheConfig;
  /**
   * The default API call options.
   *
   * This object will be merged one level deep with the options provided to
   * each API call.
   */
  defaultOptions?: ApiCallOptions;
  /**
   * The fetch function to use.
   * If not provided, then the global fetch function is used.
   */
  fetch?: typeof globalThis.fetch;
}
