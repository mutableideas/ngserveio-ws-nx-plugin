import { Tree, formatFiles } from '@nx/devkit';
import { libraryGenerator } from '@nx/workspace/generators';
import { IDomainProject } from '../models';
import {
  dasherize,
  domainDirectory,
  getCommonImportPath,
  getCommonProjectByDomain,
  getDomainProjectImportPath,
  getDomainProjectNames,
  setTags,
} from '../utilities';

export default async function commonDomainLibGenerator(
  tree: Tree,
  schema: IDomainProject
) {
  const directory = domainDirectory(schema.domain);
  const { domain } = getDomainProjectNames(schema);
  let projectConfiguration = getCommonProjectByDomain(tree, domain.fileName);

  // Library has already been created
  if (projectConfiguration) {
    console.log(
      `${projectConfiguration.name} exists for domain ${domain.fileName}.`
    );
    return;
  }

  await libraryGenerator(tree, {
    name: 'common',
    directory,
    importPath: getDomainProjectImportPath(schema.domain, 'lib', 'common'),
    tags: setTags(domain.fileName, 'any', 'lib'),
    standaloneConfig: true,
  });

  projectConfiguration = getCommonProjectByDomain(
    tree,
    dasherize(domain.fileName)
  );

  const commonProjectSrc = `${projectConfiguration.sourceRoot}/index.ts`;
  tree.write(commonProjectSrc, `export * from './lib';`);

  await formatFiles(tree);
}
