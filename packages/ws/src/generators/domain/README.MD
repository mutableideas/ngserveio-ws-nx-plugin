# @ngserveio/ws:domain

The `domain` generates sets up a domain within an `Nx Workspace`.  It includes a number of libraries for both client side and backend.

## Running the Generator

``` bash
npx nx g @ngserveio/ws:domain --domain social-sprinkler/social --name facebook
```

### Parameters
|Parameter|Description|
|---------|-----------|
|`domain`| The name of the domain to to be generated.  Subdomains may be included in a folder like structure with forward slashes.|
|`name`|The name of the ui feature to be generated.|

## Libraries Generated

|Library|Directory|Description|
|-------|---------|-----------|
|`common`|libs/**domain**/common|A library meant for shared code between Angular and Nest Applications.|
|`api-domain-config`|libs/**domain**/api/configuration|Configuration library to be used between the api libraries|
|`api-data-access`|libs/**domain**/api/data-access|Services that connects to infractrutue data services|
|`api-domain-services`|libs/**domain**/api/services|Domain specific logic services library|
|`api-application`|libs/**domain**/api/application|Domain specific application services that could be exposed to the web|
|`api-app`|apps/**domain**/**name**-api|A shell application for NestJS that runs the services from one or many of the `api-application`|
|`ui-data-access`|libs/**domain**/ui/data-access|The data-access library for communicating with backend services|
|`ng-feature`|libs/**domain**/ui/**name**-feature|Creates a library as a UI feature that should have specific components for the feature|