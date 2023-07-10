import { formatFiles, names, Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/nest';
import { IDomainProjectNames } from '../models';
import {
  addImportDeclaration,
  getDomainProjectNames,
  getProjectHighLevelModule,
  setTags,
  updateSourceFiles,
  domainDirectory,
  getDomainProjectImportPath,
} from '../utilities';
import { IApiFeatureSchema } from './api-feature-schema.interface';

export default async function apiFeatureGenerator(
  tree: Tree,
  schema: IApiFeatureSchema
) {
  const directory = domainDirectory(schema.domain);
  const domainProject: IDomainProjectNames = getDomainProjectNames(schema);
  const projectName = `${domainProject.name.fileName}-feature`;
  const projectImportPath = getDomainProjectImportPath(
    schema.domain,
    'ng-feature',
    schema.name
  );

  await libraryGenerator(tree, {
    name: projectName,
    directory: `${directory}/api`,
    importPath: projectImportPath,
    tags: setTags(domainProject.domain.name, 'nest', 'api-feature'),
    standaloneConfig: true,
  });

  if (schema.parentProject) {
    const modulePath = getProjectHighLevelModule(tree, schema.parentProject);
    const featureModule = names(
      `${domainProject.domain.fileName}-api-${projectName}-module`
    ).className;

    const fileUpdates = {
      ...addImportDeclaration(modulePath, {
        importPath: projectImportPath,
        modules: [featureModule],
      }),
    };

    updateSourceFiles(tree, fileUpdates);
  }

  await formatFiles(tree);
}
