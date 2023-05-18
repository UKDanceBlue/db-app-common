import { EventClient } from "./EventClient.js";

export class ApiClient {
  public eventApi = new EventClient(this);
  public personApi = undefined;
  public spiritApi = undefined;
  public moraleApi = undefined;
  public notificationApi = undefined;
  public authApi = undefined;
  public configApi = undefined;

  constructor(
    private _apiBaseUrl: URL,
    public readonly fetch: (
      url: string | URL,
      init?: RequestInit
    ) => Promise<Response> = globalThis.fetch
  ) {}

  public get apiBaseUrl() {
    return this._apiBaseUrl;
  }

  public set apiBaseUrl(apiBaseUrl: URL) {
    this._apiBaseUrl = apiBaseUrl;
  }
}
