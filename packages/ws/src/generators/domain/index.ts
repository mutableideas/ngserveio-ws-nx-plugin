import { formatFiles, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/nest';
import apiAppGenerator from '../api-app';
import appFeatureGenerator from '../app-feature';
import appGenerator from '../client-app';
import dataAccessGenerator from '../data-access';

import {
  domainDirectory,
  getDomainProjectImportPath,
  getDomainProjectNames,
  setTags,
} from '../utilities';
import { IDomainSchema } from './domain-schema.interface';

export default async function domainGenerator(
  tree: Tree,
  schema: IDomainSchema
) {
  const { domain } = getDomainProjectNames(schema);

  if (schema.createApps) {
    await apiAppGenerator(tree, schema);
    await appGenerator(tree, schema);
  }

  await appFeatureGenerator(tree, schema);

  const directory = domainDirectory(schema.domain);

  await libraryGenerator(tree, {
    name: 'configuration',
    directory: `${directory}/api`,
    importPath: getDomainProjectImportPath(schema.domain, 'api-domain-config'),
    tags: setTags(domain.name, 'nest', 'api-domain-config'),
    standaloneConfig: true,
  });

  await dataAccessGenerator(tree, {
    ...schema,
    type: 'api',
  });

  await libraryGenerator(tree, {
    name: 'application',
    directory: `${directory}/api`,
    importPath: getDomainProjectImportPath(
      schema.domain,
      'api-domain-application'
    ),
    tags: setTags(domain.name, 'nest', 'api-domain-application'),
    standaloneConfig: true,
  });

  await libraryGenerator(tree, {
    name: 'services',
    directory: `${directory}/api`,
    importPath: getDomainProjectImportPath(
      schema.domain,
      'api-domain-services'
    ),
    tags: setTags(domain.name, 'nest', 'api-domain-services'),
    standaloneConfig: true,
  });

  await formatFiles(tree);
}
