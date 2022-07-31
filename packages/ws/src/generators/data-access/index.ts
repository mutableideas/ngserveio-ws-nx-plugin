import { Tree, formatFiles, names } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/angular/generators';
import { IDataAccessSchema } from './data-access-schema.inteface';
import { getDataAccessProjectByDomain, setTags } from '../utilities';

export default async function dataAccessGenerator(tree: Tree, schema: IDataAccessSchema) {
  const domain = names(schema.domain);
  const dataAccessProject = getDataAccessProjectByDomain(tree, domain.fileName);

  // Data Access Project Exists
  if (dataAccessProject) {
    console.log(`${dataAccessProject.name} exists for domain ${domain.fileName}.`);
    return;
  }

  await libraryGenerator(tree, {
    name: 'data-access',
    directory: `${domain.fileName}/ui`,
    importPath: `@${domain.fileName}/ui-data-access`,
    tags: setTags(domain.fileName, 'ng', 'ng-data-access'),
    standaloneConfig: true
  });
  
  await formatFiles(tree);
}
