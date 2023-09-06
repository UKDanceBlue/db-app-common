import { Arg, Mutation, Query, Resolver } from "type-graphql";
import type { Token } from "typedi";
import { Inject } from "typedi";

import type { Resource } from "../object-types/Resource.js";
import type { ServiceInterface } from "../service-declarations/ServiceInterface.js";

export function createBaseResolver<T extends typeof Resource, S extends ServiceInterface<InstanceType<T>>>(resourceName: string, objectTypeCls: T, token: Token<unknown>) {

  @Resolver()
  abstract class BaseResolver {
    @Inject(token)
    readonly service!: S;

    @Query(() => objectTypeCls, { name: `get${resourceName}ById` })
    async getById(@Arg("id") id: string) {
      return this.service.getById(id);
    }

    @Mutation(() => objectTypeCls, { name: `create${resourceName}` })
    async create(@Arg("resource", () => objectTypeCls) input: InstanceType<T>) {
      return this.service.create(input);
    }

    @Mutation(() => objectTypeCls, { name: `set${resourceName}` })
    async set(@Arg("id") id: string, @Arg("resource", () => objectTypeCls) input: InstanceType<T>) {
      return this.service.set(id, input);
    }

    @Mutation(() => objectTypeCls, { name: `delete${resourceName}` })
    async delete(@Arg("id") id: string) {
      return this.service.delete(id);
    }
  }

  return BaseResolver;
}
