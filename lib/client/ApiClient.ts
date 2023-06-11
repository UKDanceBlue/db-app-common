import { EventClient } from "./EventClient.js";
import { LocalCache } from "./LocalCache.js";
import type { ApiClientConfig } from "./config.js";

export const secretSymbol = Symbol("secret");

interface ApiClientConfigWithFetch
  extends Omit<ApiClientConfig, "fetch" | "Headers"> {
  /**
   * The fetch function to use for requests.
   */
  fetch: Required<ApiClientConfig>["fetch"];
  /**
   * The Headers constructor to use for requests.
   */
  Headers: Required<ApiClientConfig>["Headers"];
}

export function appendToUrl(url: URL, path: string): URL {
  const newUrl = new URL(url);
  const pathParts = newUrl.pathname.split("/");
  pathParts.push(path);
  newUrl.pathname = pathParts.join("/");
  return newUrl;
}

export class ApiClient {
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

    let { fetch, Headers } = config;
    if (typeof window !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      fetch = window?.fetch?.bind(window);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      Headers = window?.Headers?.bind(window);
    } else if (typeof globalThis !== "undefined") {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      fetch ??= globalThis?.fetch?.bind(globalThis);
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      Headers ??= globalThis?.Headers?.bind(globalThis);
      // @ts-expect-error global is not defined in TypeScript
    } else if (typeof global !== "undefined") {
      // @ts-expect-error global is not defined in TypeScript
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      fetch ??= global?.fetch?.bind(global);
      // @ts-expect-error global is not defined in TypeScript
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      Headers ??= global?.Headers?.bind(global);
    }

    if (fetch === undefined || Headers === undefined) {
      throw new Error("Could not find a fetch function.");
    }

    this.#config = {
      ...config,
      fetch,
      Headers,
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
   * Get an instance of ApiClient.
   *
   * @param config The configuration for the ApiClient.
   * @return The singleton instance of ApiClient.
   */
  public static initializeInstance(config: ApiClientConfig): ApiClient {
    return new ApiClient(config, secretSymbol);
  }
}
