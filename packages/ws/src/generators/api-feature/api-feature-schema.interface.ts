import { IDomainProject } from "../models";

export interface IApiFeatureSchema extends IDomainProject {
  parentProject?: string;
}