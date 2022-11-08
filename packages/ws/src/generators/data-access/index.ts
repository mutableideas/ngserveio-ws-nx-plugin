import { Tree, formatFiles, names } from '@nrwl/devkit';
import { libraryGenerator as angularLibraryGenerator } from '@nrwl/angular/generators';
import { libraryGenerator as nestLibraryGenerator } from '@nrwl/nest';
import { IDataAccessSchema } from './data-access-schema.inteface';
import { domainDirectory, getDataAccessProjectByDomain, getDomainProjectImportPath, setTags } from '../utilities';

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
      importPath: getDomainProjectImportPath(schema.domain, 'ng-data-access'),
      tags: setTags(domain.fileName, 'ng', 'ng-data-access'),
      standaloneConfig: true
    });
  }

  if (schema.type === 'api') {
    await nestLibraryGenerator(tree, {
      name: 'data-access',
      directory: `${directory}/api`,
      importPath: getDomainProjectImportPath(schema.domain, 'api-domain-data-access'),
      tags: setTags(domain.fileName, 'nest', 'api-domain-data-access'),
      standaloneConfig: true
    });
  }
  
  await formatFiles(tree);
}
