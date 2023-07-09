import { names } from '@nx/devkit';
import { IDomainProject, IDomainProjectNames, LibraryType } from '../models';

const librarySuffix: Record<LibraryType, string> = {
  'ng-app': '',
  'ng-feature': 'ui',
  'ng-data-access': 'ui-data-access',
  'api-app': 'api',
  'api-feature': 'api',
  lib: '',
  utilities: '',
  'api-domain-data-access': 'api-data-access',
  'api-domain-application': 'api-application',
  'api-domain-services': 'api-services',
  'api-domain-config': 'api-config',
};

export function getDomainProjectNames(
  project: IDomainProject
): IDomainProjectNames {
  return {
    name: names(project.name),
    domain: names(project.domain),
  };
}

export function getDomainProjectByLibrary(
  domain: string,
  libraryType: LibraryType,
  featureName = ''
): string {
  const suffix = librarySuffix[libraryType];
  return [domain, suffix, featureName]
    .filter((v) => v?.trim()?.length > 0)
    .map((v) => {
      const { fileName } = names(v);
      return dasherize(fileName);
    })
    .join('-');
}

export function getDomainProjectImportPath(
  domain: string,
  libraryType: LibraryType,
  featureName = ''
): string {
  if (domain.includes('/')) {
    const domains = domain.split('/');
    domain = `${domains[0]}/${domains.slice(1).join('-')}`;
  }

  return [`@${domain}`, librarySuffix[libraryType], featureName]
    .filter((v) => v?.trim()?.length > 0)
    .map((v) => {
      const { fileName } = names(v);
      return fileName;
    })
    .join('-');
}

export function domainDirectory(domain: string): string {
  return domain
    .split('/')
    .map((path) => {
      return names(path).fileName;
    })
    .join('/');
}

export function dasherize(name: string): string {
  return name.trim().replace(/\s/g, '-').replace(/[/]+/g, '-');
}
