import { Tree, formatFiles, names } from '@nrwl/devkit';
import { libraryGenerator as angularLibraryGenerator } from '@nrwl/angular/generators';
import { libraryGenerator as nestLibraryGenerator } from '@nrwl/nest';
import { IDataAccessSchema } from './data-access-schema.inteface';
import { domainDirectory, getDataAccessProjectByDomain, setTags } from '../utilities';

export default async function dataAccessGenerator(tree: Tree, schema: IDataAccessSchema) {
  const directory = domainDirectory(schema.domain);
  const domain = names(schema.domain);
  const dataAccessProject = getDataAccessProjectByDomain(tree, domain.fileName, schema.type);

  // Data Access Project Exists
  if (dataAccessProject) {
    console.log(`${dataAccessProject.name} exists for domain ${domain.fileName}.`);
    return;
  }

  if (schema.type === 'ui') {
    await angularLibraryGenerator(tree, {
      name: 'data-access',
      directory: `${directory}/ui`,
      importPath: `@${domain.fileName}/ui-data-access`,
      tags: setTags(domain.fileName, 'ng', 'ng-data-access'),
      standaloneConfig: true
    });
  }

  if (schema.type === 'api') {
    await nestLibraryGenerator(tree, {
      name: 'data-access',
      directory: `${directory}/api`,
      importPath: `@${domain.fileName}/api-data-access`,
      tags: setTags(domain.fileName, 'nest', 'api-data-access'),
      standaloneConfig: true
    });
  }
  
  await formatFiles(tree);
}
