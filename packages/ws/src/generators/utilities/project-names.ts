import { names } from "@nrwl/devkit";
import { IDomainProject, IDomainProjectNames } from "../models";

export function getDomainProjectNames(project: IDomainProject): IDomainProjectNames {
  return {
    name: names(project.name),
    domain: names(project.domain)
  };
};

function getFeatureLibraryName(project: IDomainProject, featureType: 'ui' | 'api'): string {
  const projectNames = getDomainProjectNames(project);

  return [
    featureType,
    projectNames.domain.fileName,
    projectNames.name.fileName,
    'feature'
  ].join('-');
}

export function getApiFeatureLibraryName(project: IDomainProject, ): string {
  return getFeatureLibraryName(project, 'api');
}

export function getUiFeatureLibraryName(project: IDomainProject, ): string {
  return getFeatureLibraryName(project, 'ui');
}
