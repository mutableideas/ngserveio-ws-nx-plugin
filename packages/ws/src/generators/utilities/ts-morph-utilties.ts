import { Tree } from '@nrwl/devkit';
import { ClassDeclaration, ImportDeclaration, Project, PropertyAssignment, SourceFile, ts } from 'ts-morph';

export type UpdateFileContent = (sourceFile: SourceFile) => void;
export type FileUpdates = Record<string, UpdateFileContent>;
export type UpdateFileDelegate = (tree: Tree, project: Project) => void;
export type QueryPredicate = (value: ts.Node) => boolean;

export type NgModuleImport = {
  moduleName: string,
  importText?: string
};

/**
 * string is meant to be the relative import path
 * string[] - the classes to import
*/
export type NgModuleDecoratorImport = Record<string, (NgModuleImport | string)[]>;
export type NgModuleDecoratorProperties = {
  imports?: NgModuleDecoratorImport;
  exports?: NgModuleDecoratorImport;
  declarations?: NgModuleDecoratorImport;
  providers?: NgModuleDecoratorImport;
}

function updateFile(path, updateFileContent: UpdateFileContent): UpdateFileDelegate {
  return (tree: Tree, project: Project): void => {
    const fileContents = tree.read(path).toString();
    const sourceFile = project.createSourceFile(path, fileContents);
    
    updateFileContent(sourceFile);
    sourceFile.saveSync();
  }
}

// need to know the source file being updated
// provide a delegate the SourceFile to update
export const updateSourceFiles = (tree: Tree, fileUpdates: FileUpdates) => {
  const project = new Project({
    useInMemoryFileSystem: true
  });

  const fs = project.getFileSystem();
  Object.keys(fileUpdates).forEach(path => {
    const fileUpdate = updateFile(path, fileUpdates[path]) as UpdateFileDelegate;

    fileUpdate(tree, project);
    tree.write(path, fs.readFileSync(path));
  });
}

export const addImportDeclaration = (modulePath: string, imports: { importPath: string, modules: string[] }): FileUpdates => {
  return {
    [modulePath]: (sourceFile: SourceFile) => {
      const node = sourceFile.getDescendantsOfKind(
        ts.SyntaxKind.ArrayLiteralExpression
      )?.find(node => node.getParent().getKind() === ts.SyntaxKind.PropertyAssignment
        && node.getParent().getText().includes('imports')
      );

      node.addElements(imports.modules);

      sourceFile.addImportDeclaration({
        moduleSpecifier: imports.importPath,
        namedImports: imports.modules
      });
    }
  }
}

export const containsExport = (sourceFile: SourceFile, exportText: string): boolean => {
  return sourceFile.getDescendantsOfKind(
    ts.SyntaxKind.ExportDeclaration
  ).some(p => {
    return p.getText().includes(exportText);
  });
}

export const getOrCreateImportDeclaration = (sourceFile: SourceFile, relativeImport: string): ImportDeclaration => {
  return sourceFile.getImportDeclaration(relativeImport) || sourceFile.addImportDeclaration({
    moduleSpecifier: relativeImport,
  });
}

export const createImportClassDeclaration = (sourceFile: SourceFile, relativeImport: string, names: string[]): void => {
  const importDeclaration = getOrCreateImportDeclaration(sourceFile, relativeImport);
  const namedImports = importDeclaration.getNamedImports().map(v => v.getText());
  const addedImports = names.filter(name =>
    namedImports.indexOf(name) === -1
  ).map(name => ({ name }));

  importDeclaration.addNamedImports(addedImports)
}

export class AngularGeneratorUtil {
  static NG_MODULE: string = 'NgModule';

  public static findNgModuleClass(sourceFile: SourceFile): ClassDeclaration {
    return sourceFile.getDescendantsOfKind(ts.SyntaxKind.ClassDeclaration).find(
      p => p.getDecorator(AngularGeneratorUtil.NG_MODULE)
    );
  }

  public static addToNgModuleDecorator(sourceFile: SourceFile, decoratorProperties: NgModuleDecoratorProperties): void {
    // Find The Angular Decorator
    const decorator = sourceFile.getDescendantsOfKind(ts.SyntaxKind.Decorator)?.find(
      p => p.getName() === AngularGeneratorUtil.NG_MODULE
    );

    if (!decorator) {
      throw `NgModule not found in source file: ${sourceFile.getFilePath()}.`;
    }

    // The object contained within the @NgModule({ /* THIS OBJECT */ });
    const objLiteral = decorator.getFirstDescendantByKind(ts.SyntaxKind.ObjectLiteralExpression);

    // Map any existing properties in the @NgModule so we can append the new elements
    const propertyMap = objLiteral.getDescendantsOfKind(ts.SyntaxKind.PropertyAssignment).reduce((obj, property) => {
      obj[property.getName()] = property;
      return obj;
    }, { }) as Record<string, PropertyAssignment>;

    // Go through all the decorator properties for imports, exports, declarations, and providers
    Object.keys(decoratorProperties).forEach(ngModulePropertyName => {
      // Find or create the property assignment in the NgModule object literal
      const propertyAssignment = propertyMap[ngModulePropertyName] || objLiteral.addPropertyAssignment({
        name: ngModulePropertyName,
        initializer: `[]`
      });

      // Find the array literal in the property assignment
      const arrayLiteral = propertyAssignment.getFirstDescendantByKind(ts.SyntaxKind.ArrayLiteralExpression);

      // import the relative file path and add to the array literal
      Object.keys(decoratorProperties[ngModulePropertyName]).forEach(relativeImport => {
        const elements = decoratorProperties[ngModulePropertyName][relativeImport];
        const currentElements = arrayLiteral.getElements().map(t => t.getText());
        const namedImports = elements.map(el => {
          return typeof el === 'string'
            ? el
            : el.moduleName;
        });
        const arrayLiteralElements = elements.map(el => {
          return el.importText || el;
        }).filter(el => {
          return currentElements.indexOf(el) === -1;
        });

        createImportClassDeclaration(sourceFile, relativeImport, namedImports);
        arrayLiteral.addElements(arrayLiteralElements);
      });
    });
  }
}
