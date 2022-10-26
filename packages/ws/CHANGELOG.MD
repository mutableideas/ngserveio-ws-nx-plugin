### 0.0.3
- Fixed generator schema to create an `app-feature` rather than an `api-feature`

### 0.0.4
- Added prompt for the `app-feature` name

### 0.0.5
- Templates were not being generated for typescript files

### 0.0.6
- `common-domain-lib` if the `domain` input includes a forward slash, it adds to the directory structure provided.


### 0.0.7
- All generators listed determine folder by the domain / sub-domain provided `api-app`, `api-feature`, `api-app`, `app-feature`, `client-app`, `data-access`.

### 0.0.8
- Fixed issue for common-domain-lib being created when `domain` generator is run

### 0.1.0

- The `domain` generator will no longer create an `api-feature`.  It will generate several libraries under a specific domain.  See the ReadME for details.
- `data-access` generator can now choose between a `ui` or `api` type library