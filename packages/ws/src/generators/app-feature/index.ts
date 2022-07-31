import { Tree, formatFiles } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/angular/generators';
import { IAppFeatureSchema } from './app-feature-schema.interface';
import { IDomainProjectNames } from '../models';
import { getDomainProjectNames, setTags } from '../utilities';
import dataAccessGenerator from '../data-access';
import commonDomainLibGenerator from '../common-domain-lib';

export default async function appFeatureGenerator(tree: Tree, schema: IAppFeatureSchema) {
  const domainProject: IDomainProjectNames = getDomainProjectNames(schema);
  const projectName = `${domainProject.name.fileName}-feature`;

  await dataAccessGenerator(tree, schema);
  await commonDomainLibGenerator(tree, schema);

  await libraryGenerator(tree, {
    name: projectName,
    prefix: domainProject.domain.fileName,
    directory: `${domainProject.domain.fileName}/ui`,
    importPath: `@${domainProject.domain.fileName}/ui-${projectName}`,
    tags: setTags(domainProject.domain.fileName, 'ng', 'api-feature'),
    standaloneConfig: true
  });

  await formatFiles(tree);
}
