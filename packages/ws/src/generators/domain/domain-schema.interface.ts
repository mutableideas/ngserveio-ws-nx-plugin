import { IDomainProject } from '../models';

export interface IDomainSchema extends IDomainProject {
  createApps: boolean;
}
