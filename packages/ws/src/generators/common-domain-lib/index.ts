import { Tree, formatFiles } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';
import { getCommonImportPath, getCommonProjectByDomain, getDomainProjectNames, setTags } from '../utilities';
import { IDomainSchema } from './common-schema.interface';

export default async function commonDomainLibGenerator(tree: Tree, schema: IDomainSchema) {
  const { domain } = getDomainProjectNames(schema);
  let projectConfiguration = getCommonProjectByDomain(tree, domain.fileName);

  // Library has already been created
  if (projectConfiguration) {
    console.log(`${projectConfiguration.name} exists for domain ${domain.fileName}.`);
    return;
  }

  await libraryGenerator(tree, {
    name: 'common',
    directory: `${domain.fileName}`,
    importPath: getCommonImportPath(domain.fileName),
    tags: setTags(domain.fileName, 'any', 'lib'),
    standaloneConfig: true
  });

  projectConfiguration = getCommonProjectByDomain(tree, domain.fileName);
  const commonProjectSrc = `${projectConfiguration.sourceRoot}/index.ts`;
  tree.write(commonProjectSrc, `export * from './lib';`);

  await formatFiles(tree);
}
