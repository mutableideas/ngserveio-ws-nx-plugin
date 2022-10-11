import { Tree, formatFiles } from '@nrwl/devkit';
import { applicationGenerator } from '@nrwl/nest';
import { IDomainProjectNames } from '../models';
import { domainDirectory, getDomainProjectNames, setTags } from '../utilities';
import { IApiAppSchema } from './api-app-schema.interface';

export default async function apiAppGenerator(tree: Tree, schema: IApiAppSchema) {
  const domainProject: IDomainProjectNames = getDomainProjectNames(schema);
  const directory = domainDirectory(schema.domain);
  const projectName = `${domainProject.name.fileName}-api`;

  await applicationGenerator(tree, {
    name: projectName,
    directory,
    tags: setTags(domainProject.domain.name, 'nest', 'api-app'),
    standaloneConfig: true
  });

  await formatFiles(tree);
}
