import { formatFiles, generateFiles, joinPathFragments, names, ProjectConfiguration, Tree } from '@nrwl/devkit';
import * as path from 'path';
import { SourceFile, ts } from 'ts-morph';
import CommonModelGenerator from '../common-model';
import { AngularGeneratorUtil, createImportClassDeclaration, FileUpdates, getProject, updateSourceFiles } from '../utilities';
import { IFirebaseNgrxStoreSchema } from './firebase-ngrx-store-schema.interface';

// https://nx.dev/generators/modifying-files#ast-manipulation
export default async function (tree: Tree, schema: IFirebaseNgrxStoreSchema) {
  const domainNames = names(schema.domain);
  
  const project: ProjectConfiguration = getProject(tree, `${domainNames.fileName}-ui-data-access`);

  const collectionNames = names(schema.collection);
  const storeFilePath = path.join(project.sourceRoot, 'lib');

  console.log('Creating Store files for ', schema.collection);
  await generateFiles(
    tree,
    joinPathFragments(__dirname, './files/store'),
    storeFilePath,
    {
      ...collectionNames,
      template: '',
      domain: domainNames.fileName,
      domainProject: `${domainNames.fileName}/common`
    }
  );

  console.log('Creating Model for ', schema.collection);
  await CommonModelGenerator(tree, {
    name: schema.collection,
    domain: schema.domain,
    inputs: ''
  });

  const firebaseConfigPath = path.join(storeFilePath, `firebase-config.interface.ts`);
  
  if (!tree.exists(firebaseConfigPath)) {
    await generateFiles(
      tree,
      joinPathFragments(__dirname, './files/data-access-module/config'),
      storeFilePath,
      {
        ...domainNames,
        template: ''
      }
    );
  }

  const storeModuleFilePath = path.join(storeFilePath, `${domainNames.fileName}-ui-data-access.module.ts`);

  console.log('UPDATE ', storeModuleFilePath);

  const updates: FileUpdates = {
    [storeModuleFilePath]: (sourceFile: SourceFile) => {
      AngularGeneratorUtil.addToNgModuleDecorator(sourceFile, {
        imports: {
          [`./${collectionNames.fileName}-store`]: [
            `${collectionNames.className}StoreModule`
          ],
          [`@angular/fire/compat`]: [ 'AngularFireModule'],
          [`@angular/fire/compat/firestore`]: [
            { moduleName: 'AngularFirestoreModule', importText: 'AngularFirestoreModule.enablePersistence()' }
          ],
          [`@ngrx/store-devtools`]: [
            { moduleName: 'StoreDevtoolsModule', importText: 'StoreDevtoolsModule.instrument({})' }
          ],
          [`@ngrx/store`]: [
            { moduleName: 'StoreModule', importText: 'StoreModule.forRoot({})' }
          ],
          [`@ngrx/effects`]: [
            { moduleName: `EffectsModule`, importText: 'EffectsModule.forRoot([])' }
          ]
        }
      });

      createImportClassDeclaration(sourceFile, `@angular/fire/compat`, [
        'FIREBASE_APP_NAME',
        'FIREBASE_OPTIONS'
      ]);

      createImportClassDeclaration(sourceFile, '@angular/core', [
        'ModuleWithProviders'
      ]);

      const ngClassDeclaration = AngularGeneratorUtil.findNgModuleClass(sourceFile);
      let methodDeclaration = ngClassDeclaration.getFirstDescendantByKind(ts.SyntaxKind.MethodDeclaration);

      if (methodDeclaration?.getName() !== 'forRoot') {
        // Import the configuration
        sourceFile.addImportDeclaration({
          moduleSpecifier: './firebase-config.interface',
          namedImports: [`I${domainNames.className}DataAccessConfig`]
        });

        methodDeclaration = ngClassDeclaration.addMethod({
          isStatic: true,
          name: 'forRoot',
          returnType: `ModuleWithProviders<${domainNames.className}UiDataAccessModule>`,
          parameters: [
            {
              type: `I${domainNames.className}DataAccessConfig`,
              name: 'config'
            }
          ]
        });

        // Add a forRoot method to the module for configuration of Firebase
        methodDeclaration.setBodyText(`
          return {
            ngModule: ${domainNames.className}UiDataAccessModule,
            providers: [
              { provide: FIREBASE_APP_NAME, useValue: config.appName },
              { provide: FIREBASE_OPTIONS, useValue: config.firebaseConfig },
            ],
          };
        `);
      }
    }
  };

  updateSourceFiles(tree, updates);

  await formatFiles(tree);
}
