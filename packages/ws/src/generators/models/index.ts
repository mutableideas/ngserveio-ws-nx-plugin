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
export type LibraryType = 'ng-app' | 
  'ng-feature' | 
  'ng-data-access' |
  'api-app' |
  'api-feature' |
  'lib' |
  'utilities' |
  'api-domain-data-access' |
  'api-domain-application' |
  'api-domain-services' |
  'api-domain-config';

export type Tags = {
  domain: string;
  platform: PlatformType;
  type: LibraryType;
  [key: string]: string;
}
