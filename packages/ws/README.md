# @ngserveio/ws Nx Plugin

This library was generated with [Nx](https://nx.dev).

## Purpose
The purpose of the library is to quickly scaffold and create Angular Applications with certain opinions.

## Building

Run `nx build ngserveio-ws` to build the library.

## Running unit tests

Run `nx test ngserveio-ws` to execute the unit tests via [Jest](https://jestjs.io).

## Generators
| Name                  | Parameters                  | Description                                                                                                                                                                                                              |
| --------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `api-app`             | `name`, `domain`            | Creates a NestJS application under the `apps/{domain}/{name}-api`                                                                                                                                                        |
| `api-feature`         | `name`, `domain`            | Creates a NestJS feature library for an api under `libs/{domain}/api/{name}-feature`                                                                                                                                     |
| `app-feature`         | `name`,`domain`             | Creates an Angular feature library under `libs/{domain}/ui/{name}-feature`                                                                                                                                               |
| `client-app`          | `name`, `domain`            | Creates a Angular app under `apps/{domain}/{name}-app`                                                                                                                                                                   |
| `common-domain-lib`   | `name`, `domain`            | Creates a common node library that can be shared safely between Angular and Nest Applications `libs/{domain}/common`                                                                                                     |
| `data-access` | `domain` | Creates a `data-access` library under a specified domain `libs/{domain}/ui/data-access` |
| `domain`              | `name`, `domain`            | Creates a number of libraries to set up a backend and frontend for a domain.  Has as choice to create the app.                                                                                                                                                                               |
| `firebase-ngrx-store` | `collection`, `domain`      | Scaffolds a store module in the `libs/{domain}/ui/data-access` library scaffolding the reducer, effects, actions for working with Firebase. Creates the model in the `common` library by the `collection` name provided. |
| `material-form`       | `name`, `project`, `inputs` | Creates a material form utilzing the `@ngserveio/material-forms` package for form fields, validation, and inputs     
