import { Tree, formatFiles } from '@nrwl/devkit';
import { applicationGenerator } from '@nrwl/nest';
import { IDomainProjectNames } from '../models';
import { getDomainProjectNames, setTags } from '../utilities';
import { IApiAppSchema } from './api-app-schema.interface';

export default async function apiAppGenerator(tree: Tree, schema: IApiAppSchema) {
  const domainProject: IDomainProjectNames = getDomainProjectNames(schema);
  const projectName = `${domainProject.name.fileName}-api`;

  await applicationGenerator(tree, {
    name: projectName,
    directory: domainProject.domain.name,
    tags: setTags(domainProject.domain.name, 'nest', 'api-app'),
    standaloneConfig: true
  });

  await formatFiles(tree);
}
