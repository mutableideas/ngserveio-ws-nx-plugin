import { formatFiles, Tree } from '@nrwl/devkit';
import apiAppGenerator from '../api-app';
import apiFeatureGenerator from '../api-feature';
import appFeatureGenerator from '../app-feature';
import appGenerator from '../client-app';

import { getDomainProjectNames } from '../utilities';
import { IDomainSchema } from './domain-schema.interface';

export default async function domainGenerator(tree: Tree, schema: IDomainSchema) {
  const { domain, name } = getDomainProjectNames(schema);

  await apiAppGenerator(tree, schema);
  await appGenerator(tree, schema);

  await appFeatureGenerator(tree, schema);
  await apiFeatureGenerator(tree, {
    ...schema,
    parentProject: `${domain.fileName}-${name.fileName}-api`
  });

  await formatFiles(tree);
}
