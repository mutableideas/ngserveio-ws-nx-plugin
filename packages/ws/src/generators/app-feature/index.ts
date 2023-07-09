import { Tree, formatFiles } from '@nx/devkit';
import { libraryGenerator } from '@nx/angular/generators';
import { IAppFeatureSchema } from './app-feature-schema.interface';
import { IDomainProjectNames } from '../models';
import {
  dasherize,
  domainDirectory,
  getDomainProjectImportPath,
  getDomainProjectNames,
  setTags,
} from '../utilities';
import dataAccessGenerator from '../data-access';
import commonDomainLibGenerator from '../common-domain-lib';

export default async function appFeatureGenerator(
  tree: Tree,
  schema: IAppFeatureSchema
) {
  const directory = domainDirectory(schema.domain);
  const domainProject: IDomainProjectNames = getDomainProjectNames(schema);
  const projectName = `${domainProject.name.fileName}-feature`;

  await dataAccessGenerator(tree, {
    ...schema,
    type: 'ui',
  });
  await commonDomainLibGenerator(tree, schema);

  await libraryGenerator(tree, {
    name: projectName,
    prefix: dasherize(domainProject.domain.fileName),
    directory: `${directory}/ui`,
    importPath: getDomainProjectImportPath(
      schema.domain,
      'ng-feature',
      projectName
    ),
    tags: setTags(domainProject.domain.fileName, 'ng', 'ng-feature'),
    standaloneConfig: true,
  });

  await formatFiles(tree);
}
