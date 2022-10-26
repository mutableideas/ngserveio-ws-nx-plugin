import { formatFiles, names, Tree } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/nest';
import { IDomainProjectNames } from '../models';
import { addImportDeclaration, getDomainProjectNames, getProjectHighLevelModule, setTags, updateSourceFiles, AngularGeneratorUtil, domainDirectory } from '../utilities';
import { IApiFeatureSchema } from './api-feature-schema.interface';

export default async function apiFeatureGenerator(tree: Tree, schema: IApiFeatureSchema) {
  const directory = domainDirectory(schema.domain);
  const domainProject: IDomainProjectNames = getDomainProjectNames(schema);
  const projectName = `${domainProject.name.fileName}-feature`;

  await libraryGenerator(tree, {
    name: projectName,
    directory: `${directory}/api`,
    importPath: `@${domainProject.domain.fileName}/api-${projectName}`,
    tags: setTags(domainProject.domain.name, 'nest', 'api-feature'),
    standaloneConfig: true
  });

  if (schema.parentProject) {
    const modulePath = getProjectHighLevelModule(tree, schema.parentProject);
    const featureModule = names(`${domainProject.domain.fileName}-api-${projectName}-module`).className;

    const fileUpdates = {
      ...addImportDeclaration(modulePath, 
        {
          importPath: `@${domainProject.domain.fileName}/api-${projectName}`,
          modules: [featureModule]
        }
      )
    };

    updateSourceFiles(tree, fileUpdates);
  }

  await formatFiles(tree);
}
