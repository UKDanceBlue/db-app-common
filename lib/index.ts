import "reflect-metadata";

export * from "./util/TypeUtils.js";
export * from "./api/request/BodyTypes.js";
export * from "./api/request/ListQueryTypes.js";
export * from "./api/request/SearchTypes.js";
export * from "./api/request/Event.js";
export * from "./auth/index.js";

export * from "./util/comparators.js";

export * from "./api/response/JsonResponse.js";

export { Resource as ApiResource } from "./api/resource/Resource.js";
export {
  ConfigurationResource,
  ConfigurationResourceInitializer,
} from "./api/resource/Configuration.js";
export {
  EventResource,
  EventResourceInitializer,
} from "./api/resource/Event.js";
export {
  ImageResource,
  ImageResourceInitializer,
} from "./api/resource/Image.js";
export {
  LoginFlowSessionResource,
  LoginFlowSessionResourceInitializer,
} from "./api/resource/LoginFlowSession.js";
export {
  NotificationResource,
  NotificationResourceInitializer,
} from "./api/resource/Notification.js";
export {
  PersonResource,
  PersonResourceInitializer,
} from "./api/resource/Person.js";
export {
  PointEntryResource,
  PointEntryResourceInitializer,
} from "./api/resource/PointEntry.js";
export {
  PointOpportunityResource,
  PointOpportunityResourceInitializer,
} from "./api/resource/PointOpportunity.js";
export { RoleResource, RoleResourceInitializer } from "./api/resource/Role.js";
export {
  TeamResource,
  TeamType,
  TeamResourceInitializer,
} from "./api/resource/Team.js";

export { ApiClient } from "./client/ApiClient.js";

// React specific code:
export * from "./util/formReducer.js";
export { initializeReact } from "./util/reactLib.js";

/*
Note:
If the .js is missing in a bunch of places, use this regex to replace:

Replace:   import (.*)from "(((\.|(\.\.))/(\w|/)*?)+)"
With:      import $1from "$2.js"

*/
