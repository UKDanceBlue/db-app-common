import { isPrimitiveObject } from "../index.js";
import type { BaseResponse } from "../index.js";

import type { ApiClient } from "./ApiClient.js";
import { appendToUrl, secretSymbol } from "./ApiClient.js";
import { checkAndHandleError, getResponseBodyOrThrow } from "./common.js";
import type { ApiCallOptions, ParsedLocalCacheEntry } from "./config.js";
import { LocalCacheMode, isFallbackMode } from "./config.js";

function determineUrl<ApiResType extends BaseResponse>(
  options: MakeRequestOptions<ApiResType>,
  baseUrl: URL
): URL {
  let url = options.url ?? baseUrl;
  if (options.path !== undefined) {
    url = appendToUrl(url, options.path);
  }
  if (options.query !== undefined) {
    url.search = `?${options.query.toString()}`;
  }
  return url;
}

export class SubClientBase {
  protected baseUrl: URL;

  /**
   * @param apiClient The ApiClient to use for requests.
   * @param path The path to the resource (should not have a leading or trailing slash).
   */
  constructor(protected apiClient: ApiClient, path: string) {
    this.baseUrl = new URL(this.apiClient.config.baseUrl);
    const pathParts = this.baseUrl.pathname.split("/");
    pathParts.push(path);
    this.baseUrl.pathname = pathParts.join("/");
  }

  protected get fetch() {
    return this.apiClient.config.fetch;
  }

  /**
   * Make a request to the API.
   *
   * Does not use the local cache.
   *
   * @param options The options for the request.
   * @param options.body The body of the request
   * @param options.fetchCache The cache mode for the request.
   * @param options.method The HTTP method to use for the request.
   * @param options.typeGuard The type guard to use for the response.
   * @param options.url The URL to make the request to.
   * @param options.path The path to append to `options.url`.
   * @return The response from the API.
   */
  protected async makeRequestUncached<ApiResType extends BaseResponse>({
    body,
    url = this.baseUrl,
    path,
    fetchCache,
    method,
    typeGuard,
  }: MakeRequestOptions<ApiResType>): Promise<ApiResType> {
    if (path !== undefined) {
      url = appendToUrl(url, path);
    }

    const { fetchCache: defaultFetchCache } =
      this.apiClient.config.defaultOptions ?? {};

    const headers = new this.apiClient.config.Headers();
    headers.set("Accept", "application/json");
    headers.set("Content-Type", "application/json");

    const token = await this.apiClient.config.getToken?.();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await this.fetch(url, {
      method: method ?? (body ? "POST" : "GET"),
      body: body ?? null,
      cache: fetchCache ?? defaultFetchCache ?? "default",
      headers,
    });

    const apiResponse = await getResponseBodyOrThrow(response);

    checkAndHandleError(apiResponse);

    if (!typeGuard(apiResponse)) {
      throw new Error("Response did not match expected type.");
    }

    return apiResponse;
  }

  /**
   * Make a request to the API and return an opaque ApiResponse.
   *
   * If the response is in the local cache, it will be returned from there.
   * Otherwise, it will be fetched from the API and added to the local cache.
   *
   * The type of the response can be absolutely anything, but will be cached
   * naively as a string, by the entire URL.
   *
   * @param options The options for the request.
   * @return The response.
   */
  protected async makeRequest<ApiResType extends BaseResponse>(
    options: MakeRequestOptions<ApiResType>
  ): Promise<ApiResType | undefined> {
    const localCache = this.apiClient.getLocalCache(secretSymbol);

    let localCacheMode: LocalCacheMode =
      options.localCache ??
      this.apiClient.config.defaultOptions?.localCache ??
      LocalCacheMode.fallback;
    const cacheKey = determineUrl<ApiResType>(options, this.baseUrl).href;
    if (localCache && localCacheMode > LocalCacheMode.never) {
      // If fallback is requested, check if we're offline.
      const isOffline = !(await localCache.isOnline());

      // If we're offline, and fallback is requested, increment the local cache mode (i.e. fallback-stale -> stale)
      if (isFallbackMode(localCacheMode) && isOffline) {
        localCacheMode++;
      }

      // Lookup in local cache.
      const cacheResult = await localCache.get(cacheKey);

      // Cache hit, check if we should use it.
      if (cacheResult) {
        const now = Date.now();
        const expiresAt = cacheResult.expiresAt ?? Number.POSITIVE_INFINITY;
        const freshUntil = cacheResult.freshUntil ?? Number.NEGATIVE_INFINITY;
        const staleUntil = cacheResult.staleUntil ?? Number.POSITIVE_INFINITY;

        if (expiresAt < now) {
          await localCache.delete(cacheKey);
        } else if (
          (localCacheMode >= LocalCacheMode.fresh && freshUntil > now) ||
          (localCacheMode >= LocalCacheMode.stale && staleUntil > now) ||
          localCacheMode >= LocalCacheMode.always
        ) {
          const apiResponse = await getResponseBodyOrThrow({
            json: () => Promise.resolve(cacheResult.value),
            ok: true,
          });

          checkAndHandleError(apiResponse);

          if (!options.typeGuard(apiResponse)) {
            throw new Error("Response did not match expected type.");
          }

          return apiResponse;
        }
      }
    }

    const apiResponse = await this.makeRequestUncached(options);

    if (localCache && localCacheMode > LocalCacheMode.never) {
      const expiresAt = Date.now() + 1000 * 60 * 60 * 6;
      if (isPrimitiveObject(apiResponse)) {
        const entry: ParsedLocalCacheEntry = {
          expiresAt,
          ...options.cacheEntryConfig,
          value: apiResponse,
        };
        await localCache.set(cacheKey, entry);
      }
    }

    return apiResponse;
  }
}

export interface MakeRequestOptions<ApiResType extends BaseResponse>
  extends ApiCallOptions {
  /**
   * The URL to make the request to.
   * If not provided, the base URL will be used.
   */
  url?: URL;
  /**
   * The path to append to the base URL.
   * If not provided the url will be unchanged.
   */
  path?: string;
  /**
   * The query parameters to append to the URL.
   * These parameters will be applied to the url after it has been created.
   * If provided, these parameters will replace existing ones on the provided URL.
   */
  query?: URLSearchParams;
  /**
   * The method to use for the request.
   * If not provided, the method will be determined by `body`.
   * If `body` is provided, the method will be POST, otherwise it will be GET.
   */
  method?: string;
  /**
   * The body of the request.
   */
  body?: BodyInit;
  /**
   * A type guard to ensure that the response is of the provided type.
   *
   * If you don't care about the response type, you can just pass `isOkApiResponse` here.
   */
  typeGuard: (response: BaseResponse) => response is ApiResType;
}
