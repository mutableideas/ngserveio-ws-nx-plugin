import { applicationGenerator } from '@nrwl/angular/generators';
import { formatFiles, generateFiles, joinPathFragments, names, Tree, updateProjectConfiguration } from '@nrwl/devkit';
import { IDomainProject } from '../models';
import { addImportDeclaration, domainDirectory, getProject, getProjectHighLevelModule, setTags, updateSourceFiles } from '../utilities';

export default async function appGenerator(tree: Tree, schema: IDomainProject) {
  const directory = domainDirectory(schema.domain);
  const projectNames = names(schema.name)
  const domainNames = names(schema.domain);
  const projectName = `${projectNames.fileName}-ui`;
  const appProjectName = [domainNames.name, projectName].join('-');

  await applicationGenerator(tree, {
    name: projectName,
    directory,
    prefix: domainNames.fileName,
    addTailwind: true,
    style: 'scss',
    tags: setTags(domainNames.name, 'ng', 'ng-app'),
    standaloneConfig: true
  });

  const projectConfiguration = getProject(tree, appProjectName);
  projectConfiguration.targets.build.options.styles = [
    ...projectConfiguration.targets.build.options.styles,
    `${projectConfiguration.sourceRoot}/${projectName}.theme.scss`
  ];

  await generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    projectConfiguration.root,
    { projectName }
  );

  const appModule = getProjectHighLevelModule(tree, appProjectName);
  const fileUpdates = addImportDeclaration(appModule, {
    importPath: `@angular/platform-browser/animations`,
    modules: ['BrowserAnimationsModule']
  });

  updateSourceFiles(tree, fileUpdates);
  updateProjectConfiguration(tree, appProjectName, projectConfiguration); 

  await formatFiles(tree);
}
