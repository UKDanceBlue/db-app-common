import { Query, Resolver } from "type-graphql";
import { Service } from "typedi";

import { ConfigurationResource } from "../object-types/Configuration.js";
import type { ConfigurationServiceInterface } from "../service-declarations/ConfigurationService.js";
import { configurationServiceToken } from "../service-declarations/ConfigurationService.js";

import { createBaseResolver } from "./BaseResolver.js";

const ConfigurationResourceBaseResolver = createBaseResolver<typeof ConfigurationResource, ConfigurationServiceInterface>("Configuration", ConfigurationResource, configurationServiceToken);

@Service()
@Resolver(() => ConfigurationResource)
export class ConfigurationResolver extends ConfigurationResourceBaseResolver {
  @Query(() => [ConfigurationResource], { name: "getAllConfigurations" })
  async getAll() {
    return this.service.getAll();
  }
}
