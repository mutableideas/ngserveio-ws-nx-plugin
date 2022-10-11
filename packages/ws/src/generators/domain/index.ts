import { formatFiles, Tree } from '@nrwl/devkit';
import apiAppGenerator from '../api-app';
import apiFeatureGenerator from '../api-feature';
import appFeatureGenerator from '../app-feature';
import appGenerator from '../client-app';

import { dasherize, getDomainProjectNames } from '../utilities';
import { IDomainSchema } from './domain-schema.interface';

export default async function domainGenerator(tree: Tree, schema: IDomainSchema) {
  const { domain, name } = getDomainProjectNames(schema);

  if (schema.createApps) {
    await apiAppGenerator(tree, schema);
    await appGenerator(tree, schema);
  }

  await appFeatureGenerator(tree, schema);
  await apiFeatureGenerator(tree, {
    ...schema,
    parentProject: schema.createApps 
      ? dasherize(`${domain.fileName}-${name.fileName}-api`)
      : undefined
  });

  await formatFiles(tree);
}
