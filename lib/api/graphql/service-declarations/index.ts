import { Container } from "typedi"

export * from "./ConfigurationService.js"
export const graphQLServiceContainer = Container.of("db-graphql-services");