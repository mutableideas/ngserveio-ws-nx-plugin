import { formatFiles, generateFiles, installPackagesTask, joinPathFragments, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import { SourceFile, ts } from 'ts-morph';
import { FileUpdates, getCommonImportPath, getProject, parseControls, parseProjectTags, updateSourceFiles } from '../utilities';
import { MaterialFormSchema } from './material-form-schema';
import CommonFileGenerator from '../common-model'

export default async function (tree: Tree, schema: MaterialFormSchema) {
  const modelNames = names(schema.name);

  // 1. Determine where the project lives
  const project = getProject(tree, schema.project);
  const projectSrc = join(project.sourceRoot, 'lib');
  const modulePath = tree.children(projectSrc).find(file => file.endsWith('.module.ts'));
  const projectModulePath = join(projectSrc, modulePath);

  if (!tree.exists(projectModulePath)) {
    throw `${projectModulePath} does not exist!`;
  }

    // 2. Get the tags for the project to get the common project associated with the domain
  const tags = parseProjectTags(project.tags);
  const formControls = parseControls(schema.inputs);

  // 4. Generate the component files
  await generateFiles(
    tree,
    joinPathFragments(__dirname, './files/form-component'),
    projectSrc,
    {
      ...names(schema.name),
      selector: project['prefix'],
      commonProjectImportPath: getCommonImportPath(tags.domain),
      formControls,
      controlTypes: formControls.reduce((values, control) => {
        if (!values.has(control.type)) {
          values.add(control.type);
        }

        return values;
      }, new Set<string>())
    }
  );

  // 5. Update the barreled file in the domain under models to export it
  const updates: FileUpdates = {
    [projectModulePath]: (sourceFile: SourceFile) => {
      const node = sourceFile.getDescendantsOfKind(
        ts.SyntaxKind.ArrayLiteralExpression
      )?.find(node => node.getParent().getKind() === ts.SyntaxKind.PropertyAssignment
        && node.getParent().getText().includes('imports')
      );

      if (node) {
        node.addElement(`${modelNames.className}FormComponentModule`);
        sourceFile.addImportDeclaration({
          moduleSpecifier: `./components/${modelNames.fileName}-form/${modelNames.fileName}-form.module`,
          namedImports: [`${modelNames.className}FormComponentModule`]
        });
      }
    }
  };

  updateSourceFiles(tree, updates);

  await CommonFileGenerator(tree, {
    name: schema.name,
    domain: tags.domain,
    inputs: schema.inputs,
  });

  await formatFiles(tree);
}
