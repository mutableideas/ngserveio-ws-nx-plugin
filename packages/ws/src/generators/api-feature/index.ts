import { formatFiles, names, Tree } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/nest';
import { LibraryGeneratorOptions } from '@nrwl/nest/src/generators/library/schema';
import { SourceFile } from 'ts-morph';
import { IDomainProjectNames } from '../models';
import { addImportDeclaration, getDomainProjectNames, getProjectHighLevelModule, setTags, updateSourceFiles, AngularGeneratorUtil } from '../utilities';
import { IApiFeatureSchema } from './api-feature-schema.interface';

export default async function apiFeatureGenerator(tree: Tree, schema: IApiFeatureSchema) {
  const domainProject: IDomainProjectNames = getDomainProjectNames(schema);
  const projectName = `${domainProject.name.fileName}-feature`;

  const featureOptions =  {
    name: projectName,
    directory: `${domainProject.domain.fileName}/api`,
    importPath: `@${domainProject.domain.fileName}/api-${projectName}`,
    tags: setTags(domainProject.domain.name, 'nest', 'api-feature'),
    standaloneConfig: true
  } as LibraryGeneratorOptions;

  await libraryGenerator(tree, featureOptions);

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
