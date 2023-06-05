import { isPrimitiveObject } from "../index.js";
import type { BaseResponse } from "../index.js";

import { EventClient } from "./EventClient.js";
import { LocalCache } from "./LocalCache.js";
import { checkAndHandleError, getResponseBodyOrThrow } from "./common.js";
import type {
  ApiCallOptions,
  ApiClientConfig,
  CacheEntryConfig,
  ParsedLocalCacheEntry,
} from "./config.js";
import { LocalCacheMode, isFallbackMode } from "./config.js";

const secretSymbol = Symbol("secret");

interface ApiClientConfigWithFetch extends Omit<ApiClientConfig, "fetch"> {
  /**
   * The fetch function to use for requests.
   */
  fetch: Required<ApiClientConfig>["fetch"];
}

function appendToUrl(url: URL, path: string): URL {
  const newUrl = new URL(url);
  const pathParts = newUrl.pathname.split("/");
  pathParts.push(path);
  newUrl.pathname = pathParts.join("/");
  return newUrl;
}

export class ApiClient {
  static #singleton: ApiClient | undefined;

  #localCache?: LocalCache;

  #config: ApiClientConfigWithFetch;

  #eventApi: EventClient;
  #personApi: undefined;
  #spiritApi: undefined;
  #moraleApi: undefined;
  #notificationApi: undefined;
  #authApi: undefined;
  #configApi: undefined;

  /**
   * @param config The configuration for the ApiClient.
   * @param secret A secret symbol to prevent instantiation of ApiClient outside of this file.
   * @private
   */
  constructor(config: ApiClientConfig, secret: typeof secretSymbol) {
    if (secret !== secretSymbol) {
      throw new Error("Cannot instantiate singleton ApiClient.");
    }

    this.#config = {
      ...config,
      fetch: config.fetch ?? globalThis.fetch.bind(globalThis),
    };
    if (this.#config.cache) {
      this.#localCache = new LocalCache(this.#config.cache);
    }

    this.#eventApi = new EventClient(this);
    this.#personApi = undefined;
    this.#spiritApi = undefined;
    this.#moraleApi = undefined;
    this.#notificationApi = undefined;
    this.#authApi = undefined;
    this.#configApi = undefined;
  }

  public get config() {
    return this.#config;
  }

  public set apiBaseUrl(apiBaseUrl: URL) {
    this.#config.baseUrl = apiBaseUrl;
  }

  public get eventApi() {
    return this.#eventApi;
  }

  public get personApi() {
    return this.#personApi;
  }

  public get spiritApi() {
    return this.#spiritApi;
  }

  public get moraleApi() {
    return this.#moraleApi;
  }

  public getLocalCache(secret: typeof secretSymbol): LocalCache | undefined {
    if (secret !== secretSymbol) {
      throw new Error("Cannot get local cache.");
    }
    return this.#localCache!;
  }

  /**
   * @return A singleton instance of ApiClient.
   */
  public static getApiClient(): ApiClient {
    return this.#singleton!;
  }

  /**
   * Initialize the singleton instance of ApiClient.
   *
   * @param config The configuration for the ApiClient.
   * @return The singleton instance of ApiClient.
   */
  public static initializeInstance(config: ApiClientConfig): ApiClient {
    this.#singleton = new ApiClient(config, secretSymbol);

    return this.#singleton;
  }
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

    const headers = new Headers();
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
   * @param cacheEntryConfig Configuration for any created cache entries.
   * @return The response.
   */
  protected async makeRequest<ApiResType extends BaseResponse>(
    options: MakeRequestOptions<ApiResType>,
    cacheEntryConfig?: CacheEntryConfig
  ): Promise<ApiResType | undefined> {
    const localCache = this.apiClient.getLocalCache(secretSymbol);

    let localCacheMode: LocalCacheMode =
      options.localCache ??
      this.apiClient.config.defaultOptions?.localCache ??
      LocalCacheMode.fallback;
    const cacheKey = options.path
      ? appendToUrl(options.url ?? this.baseUrl, options.path).href
      : options.url?.href ?? this.baseUrl.href;
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
          ...cacheEntryConfig,
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
