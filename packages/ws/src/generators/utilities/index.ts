import { ProjectConfiguration, Tree, getProjects, names } from '@nx/devkit';
import { ControlType } from '../material-form/control-type.interface';
import { LibraryType, PlatformType, Tags } from '../models';
import { buildRelativePath } from '@schematics/angular/utility/find-module';
import { dasherize } from './project-names';

export * from './ts-morph-utilties';
export * from './project-names';

export function parseControls(inputs: string): ControlType[] {
  return inputs.split(',').map((input) => {
    const controlSplit = input.trim().split(':');
    return {
      type: controlSplit[1] ?? 't',
      inputName: names(controlSplit[0]).propertyName,
    } as ControlType;
  });
}

export function getCommonProjectByDomain(
  tree: Tree,
  domain: string
): ProjectConfiguration {
  const commonProjectName = `${dasherize(domain)}-common`;
  return getProject(tree, commonProjectName);
}

export function getDataAccessProjectByDomain(
  tree: Tree,
  domain: string,
  type: 'api' | 'ui'
): ProjectConfiguration {
  const dataAccessProjectName = `${dasherize(domain)}-${type}-data-access`;
  return getProject(tree, dataAccessProjectName);
}

export function getServicesProjectByDomain(
  tree: Tree,
  domain: string
): ProjectConfiguration {
  const servicesProjectName = `${dasherize(domain)}-api-services`;
  return getProject(tree, servicesProjectName);
}

export function getApplicationProjectByDomain(
  tree: Tree,
  domain: string
): ProjectConfiguration {
  const applicationProject = `${dasherize(domain)}-api-application`;
  return getProject(tree, applicationProject);
}

export function parseProjectTags(projectTags: string[]): Tags {
  return projectTags.reduce((tags, tag) => {
    const domainTags = tag.split(':');
    return {
      ...tags,
      [domainTags[0]]: domainTags[domainTags.length - 1],
    } as Tags;
  }, {}) as Tags;
}

export function getCommonImportPath(domain: string): string {
  if (domain.includes('/')) {
    const domains = domain.split('/');
    return `@${domains[0]}/${domains.slice(1).join('-')}-common`;
  }

  return `@${domain}/common`;
}

export function getProject(
  tree: Tree,
  projectName: string
): ProjectConfiguration {
  return getProjects(tree).get(projectName);
}

export function setTags(
  domain: string,
  platform: PlatformType,
  libraryType: LibraryType,
  extraTags: Record<string, string> = null
): string {
  let tags = `domain:${domain},platform:${platform},type:${libraryType}`;

  if (extraTags) {
    tags = Object.keys(extraTags).reduce((prev, current) => {
      return `${prev},${current}:${extraTags[current]}`;
    }, tags);
  }

  return tags;
}

export function getProjectHighLevelModule(
  tree: Tree,
  projectName: string
): string {
  const project = getProject(tree, projectName);
  const srcRootLocation = project.projectType === 'library' ? 'lib' : 'app';
  const srcLocation = `${project.sourceRoot}/${srcRootLocation}`;

  // TO DO: Need to figure out if the module in question is a library
  const modulePath = tree
    .children(srcLocation)
    .find((path) => path.toLowerCase().endsWith('.module.ts'));

  return modulePath ? `${srcLocation}/${modulePath}` : null;
}

export function getRelativePath(from: string, to: string): string {
  return buildRelativePath(from, to);
}
