import "reflect-metadata";

export * from "./api/request/BodyTypes.js";
export * from "./api/request/ListQueryTypes.js";
export * from "./api/request/SearchTypes.js";

export * from "./api/response/JsonResponse.js";

export * from "./api/resource/Resource.js";
export * from "./api/resource/Configuration.js";
export * from "./api/resource/Device.js";
export * from "./api/resource/Event.js";
export * from "./api/resource/Image.js";
export * from "./api/resource/LoginFlowSession.js";
export * from "./api/resource/Notification.js";
export * from "./api/resource/Person.js";
export * from "./api/resource/PointEntry.js";
export * from "./api/resource/PointOpportunity.js";
export * from "./api/resource/Role.js";
export * from "./api/resource/Team.js";

export * from "./auth/index.js";
export * from "./auth/role.js";

export * from "./util/base64.js";
export * from "./util/comparators.js";
export * from "./util/formData.js";
export * from "./util/intervalTools.js";
export * from "./util/TypeUtils.js";
export * from "./util/typeTransformers.js";
export * from "./util/validation.js";


export * from "./style/color.js";

// React specific code:
export * from "./util/formReducer.js";
export { initializeReact } from "./util/reactLib.js";

/*
Note:
If the .js is missing in a bunch of places, use this regex to replace:

Replace:   import (.*)from "(((\.|(\.\.))/(\w|/)*?)+)"
With:      import $1from "$2.js"

*/
