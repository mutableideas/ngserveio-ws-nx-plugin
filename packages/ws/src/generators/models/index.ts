export interface IDomainProject {
  name: string;
  domain: string;
}

export interface INames {
  name: string;
  className: string;
  constantName: string;
  propertyName: string;
  fileName: string;
}

export interface IDomainProjectNames {
  name: INames;
  domain: INames;
}

export type PlatformType = 'nest' | 'ng' | 'any';
export type LibraryType = 'ng-app' | 'ng-feature' | 'ng-data-access' | 'ng-library' | 'api-app' | 'api-feature' | 'api-library' | 'lib';

export type Tags = {
  domain: string;
  platform: PlatformType;
  type: LibraryType;
  [key: string]: string;
}
