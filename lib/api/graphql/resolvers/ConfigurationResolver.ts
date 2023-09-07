import { Query, Resolver } from "type-graphql";
import { Service } from "typedi";

import type { AbstractGraphQLArrayOkResponse } from "../object-types/ApiResponse.js";
import { GraphQLErrorResponse, defineGraphQLArrayOkResponse, withGraphQLErrorUnion } from "../object-types/ApiResponse.js";
import { ConfigurationResource } from "../object-types/Configuration.js";
import type { ConfigurationServiceInterface } from "../service-declarations/ConfigurationService.js";
import { configurationServiceToken } from "../service-declarations/ConfigurationService.js";

import { createBaseResolver } from "./BaseResolver.js";

const ConfigurationResourceBaseResolver = createBaseResolver<ConfigurationResource, ConfigurationServiceInterface>("Configuration", ConfigurationResource, configurationServiceToken);

const GetAllResponse = defineGraphQLArrayOkResponse("GetAllResponse", ConfigurationResource);

@Service()
@Resolver(() => ConfigurationResource)
export class ConfigurationResolver extends ConfigurationResourceBaseResolver {
  @Query(() => withGraphQLErrorUnion(GetAllResponse), { name: "getAllConfigurations" })
  async getAll(): Promise<AbstractGraphQLArrayOkResponse<ConfigurationResource> | GraphQLErrorResponse> {
    const resources = await this.service.getAll();
    if (resources instanceof Error) {
      return GraphQLErrorResponse.from(resources);
    }
    return GetAllResponse.newOk(resources);
  }
}
