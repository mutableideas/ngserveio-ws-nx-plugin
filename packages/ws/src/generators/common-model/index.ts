import { Tree, formatFiles, generateFiles, joinPathFragments, names } from '@nrwl/devkit';
import { join } from 'path';
import { SourceFile } from 'ts-morph';
import { containsExport, FileUpdates, getCommonProjectByDomain, parseControls, updateSourceFiles } from '../utilities';
import { ICommonModelSchema } from './common-model-schema.interface';

function createBarrelFile(tree: Tree, projectPath: string): string {
  const barrelPath = join(projectPath, 'index.ts');
  if (!tree.exists(barrelPath)) {
    tree.write(barrelPath, '');
  }

  return barrelPath;
}

export default async function commonModelGenerator(tree: Tree, schema: ICommonModelSchema) {
  const modelNames = names(schema.name);
  const commonProject = getCommonProjectByDomain(tree, schema.domain);
  const commonProjectSrcPath = join(commonProject.sourceRoot, 'lib');

  // Model file already exists in common
  const filesExist = tree.exists(`${commonProjectSrcPath}/models/${modelNames.fileName}.model.ts`)
    && tree.exists(`${commonProjectSrcPath}/validators/${modelNames.fileName}.validator.ts`);
  
  if (filesExist) { return; }

  const commonProjectModelsBarrelPath = createBarrelFile(tree, join(commonProjectSrcPath, 'models'));
  const commonProjectValidatorPath = createBarrelFile(tree, join(commonProjectSrcPath, 'validators'));
  const commonProjectBarrelPath = createBarrelFile(tree, commonProjectSrcPath);

  // Add the model to the common project
  await generateFiles(
    tree,
    joinPathFragments(__dirname, './files'),
    commonProjectSrcPath,
    {
      ...modelNames,
      formControls: schema.inputs?.trim()?.length > 0 ? parseControls(schema.inputs) : []
    }
  );

  const fileUpdates: FileUpdates = {
    [commonProjectModelsBarrelPath]:  (sourceFile: SourceFile) => {
      const moduleSpecifier = `./${modelNames.fileName}.model`;
      if (containsExport(sourceFile, moduleSpecifier)) {
        return;
      }

      sourceFile.addExportDeclaration({ moduleSpecifier });
    },
    [commonProjectValidatorPath]: (sourceFile: SourceFile) => {
      const moduleSpecifier = `./${modelNames.fileName}.validator`;
      if (containsExport(sourceFile, moduleSpecifier)) {
        return;
      }

      sourceFile.addExportDeclaration({ moduleSpecifier });
    },
    [commonProjectBarrelPath]: (sourceFile: SourceFile) => {
      const moduleSpecifiers = [`./models`, `./validators`];
      const hasSpecifiers = moduleSpecifiers.some(p => containsExport(sourceFile, p));
      
      if (!hasSpecifiers) {
        sourceFile.addExportDeclarations([
          { moduleSpecifier: moduleSpecifiers[0] },
          { moduleSpecifier: moduleSpecifiers[1] }
        ]);
      }
    }
  };

  updateSourceFiles(tree, fileUpdates);
  
  await formatFiles(tree);
}
