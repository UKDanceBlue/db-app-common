import type { ClassType } from "type-graphql";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import type { Token } from "typedi";
import { Inject } from "typedi";

import { isApiError } from "../../response/JsonResponse.js";
import type { AbstractGraphQLCreatedResponse, AbstractGraphQLOkResponse } from "../object-types/ApiResponse.js";
import { GraphQLErrorResponse, defineGraphQlCreatedResponse, defineGraphQlOkResponse, withGraphQLErrorUnion } from "../object-types/ApiResponse.js";
import type { Resource } from "../object-types/Resource.js";
import type { ServiceInterface } from "../service-declarations/ServiceInterface.js";

export function createBaseResolver<T extends Resource, S extends ServiceInterface<T>>(resourceName: string, objectTypeCls: ClassType<T>, token: Token<unknown>) {
  const ResourceByIdResponse = defineGraphQlOkResponse("ResourceByIdResponse", objectTypeCls);
  const CreateResourceResponse = defineGraphQlCreatedResponse("CreateResourceResponse", objectTypeCls);
  const SetResourceResponse = defineGraphQlOkResponse("SetResourceResponse", objectTypeCls);
  const DeleteResourceResponse = defineGraphQlOkResponse("DeleteResourceResponse", Boolean);

  @Resolver()
  abstract class BaseResolver {
    @Inject(token)
    readonly service!: S;

    @Query(() => withGraphQLErrorUnion(ResourceByIdResponse), { name: `get${resourceName}ById`, nullable: true })
    async getById(@Arg("id") id: string): Promise<AbstractGraphQLOkResponse<T | null> | GraphQLErrorResponse> {
      const result = await this.service.getById(id);
      if (isApiError(result)) {
        return GraphQLErrorResponse.from(result);
      }
      return ResourceByIdResponse.newOk(result);
    }

    // @Mutation(() => withGraphQLErrorUnion(CreateResourceResponse), { name: `create${resourceName}` })
    // async create(@Arg("resource", () => objectTypeCls) resource: T): Promise<AbstractGraphQLCreatedResponse<T> | GraphQLErrorResponse> {
    //   const result = await this.service.create(resource);
    //   if (isApiError(result)) {
    //     return GraphQLErrorResponse.from(result);
    //   }
    //   const response = CreateResourceResponse.newOk(result);
    //   response.id = result.id;
    //   return response;
    // }

    // @Mutation(() => withGraphQLErrorUnion(SetResourceResponse), { name: `set${resourceName}` })
    // async set(@Arg("id") id: string, @Arg("resource", () => objectTypeCls) resource: T): Promise<AbstractGraphQLOkResponse<T> | GraphQLErrorResponse> {
    //   const result = await this.service.set(id, resource);
    //   if (isApiError(result)) {
    //     return GraphQLErrorResponse.from(result);
    //   }
    //   return SetResourceResponse.newOk(result);
    // }

    @Mutation(() => withGraphQLErrorUnion(DeleteResourceResponse), { name: `delete${resourceName}`, nullable: true })
    async delete(@Arg("id") id: string): Promise<AbstractGraphQLOkResponse<boolean> | GraphQLErrorResponse> {
      const result = await this.service.delete(id);
      if (isApiError(result)) {
        return GraphQLErrorResponse.from(result);
      }
      return DeleteResourceResponse.newOk(result);
    }
  }

  return BaseResolver;
}
