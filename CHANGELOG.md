# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.2.0](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.1.2...v1.2.0) (2023-04-25)


### Features

* **SHBD-302:** add readme ([c5d2a56](https://github.com/BrewInteractive/authentication-service-nestjs/commit/c5d2a56d077afe3a89b32cef25741c756d11d2d0))
* **SHBD-309:** add user service in auth module providers ([0d38948](https://github.com/BrewInteractive/authentication-service-nestjs/commit/0d38948a0442b52fbd74cc4f6555f8b3bfe9f1ce))
* **SHBD-309:** add UserService for TokenService to providers. ([caa8de9](https://github.com/BrewInteractive/authentication-service-nestjs/commit/caa8de9a7d2ef16756f537e4afff04f9deaaea0d))
* **SHBD-309:** add validateUser in user service and auth controller ([1e1df94](https://github.com/BrewInteractive/authentication-service-nestjs/commit/1e1df9473e7324ece26c2035a830379f896c061c))
* **SHBD-354:** Add validation for LoginDto ([55f74cf](https://github.com/BrewInteractive/authentication-service-nestjs/commit/55f74cf69099fec2fe6e27f4f1b3d3ec04ec9f0d))
* **SHBD-355:** Add sign up validation and tests ([1ffe3f2](https://github.com/BrewInteractive/authentication-service-nestjs/commit/1ffe3f2b52f4ddd0b52698506df9d72c1523cda6))
* **SHBD-365:** Add Swagger ([236c348](https://github.com/BrewInteractive/authentication-service-nestjs/commit/236c34877969dc41771033205ce54384009df8f8))
* typeorm integration and create user tables ([1188f6a](https://github.com/BrewInteractive/authentication-service-nestjs/commit/1188f6ad6df119cc0f1efb9334b4e06eee95da29))


### Bug Fixes

* fix for auth controller creating module tests ([08d5218](https://github.com/BrewInteractive/authentication-service-nestjs/commit/08d5218f30cf07b16d243c12115490538a8bca39))
* fix for data source config ([286b8cc](https://github.com/BrewInteractive/authentication-service-nestjs/commit/286b8cc562fb5523720f5b2bbca3d07e67576384))
* fix for user entity ([abdf1bc](https://github.com/BrewInteractive/authentication-service-nestjs/commit/abdf1bc465686d4ea09fb3aac1b2afccbe1a73b0))
* Injected UserService. ([af1dd48](https://github.com/BrewInteractive/authentication-service-nestjs/commit/af1dd482be17c61d81720aab18ade25c2e8bc1b0))
* **SHBD-309:** fix auth controller ([2840f76](https://github.com/BrewInteractive/authentication-service-nestjs/commit/2840f765d3144520a8152e64864848fa3daed0e9))
* **SHBD-309:** fix token module providers ([ddd7b8a](https://github.com/BrewInteractive/authentication-service-nestjs/commit/ddd7b8a89cbfab029aa8ff02dabde150fc906144))
* **SHBD-309:** remove token and user service in app module ([42b7ad3](https://github.com/BrewInteractive/authentication-service-nestjs/commit/42b7ad3d7457f27b3d32405b5bea11572b5f85fa))
* **SHBD-315:** fix auth controller ([01ea49e](https://github.com/BrewInteractive/authentication-service-nestjs/commit/01ea49e15c3f5071d70799f35f2f1d7df78737bf))
* **SHBD-315:** remove auth service and test ([0ccc902](https://github.com/BrewInteractive/authentication-service-nestjs/commit/0ccc902b0da93f1f1059c98df1212bd0d993ee2f))
* **SHBD-315:** remove TokenService in app module ([fd4b7a2](https://github.com/BrewInteractive/authentication-service-nestjs/commit/fd4b7a2204b005e971d70bff1169c71ba9fce813))
* **SHBD-354:** fix for get password matches from config env ([ea2e8fb](https://github.com/BrewInteractive/authentication-service-nestjs/commit/ea2e8fb1be3fcce2a9b2b9d30f11803ae6370c31))
* **SHBD-354:** fix validation code smells ([f13289c](https://github.com/BrewInteractive/authentication-service-nestjs/commit/f13289cee245107f72f78b4ab561ef38061070f8))
* **SHBD-365:** Fix swagger integration and environment-based swagger config ([f4e208e](https://github.com/BrewInteractive/authentication-service-nestjs/commit/f4e208e66660dbfd53b72c218577098352377897))
* **SHBD-365:** update swagger tittle and description ([e86daf3](https://github.com/BrewInteractive/authentication-service-nestjs/commit/e86daf35448d731d88a220b61f18e3793fcce0b4))
* update main.ts for swagger enable and .env.example for new variable ([4932bb4](https://github.com/BrewInteractive/authentication-service-nestjs/commit/4932bb4ae185ab74d29f52df58014177f2553215))
* update swagger enable control and readme.md ([b8b9abf](https://github.com/BrewInteractive/authentication-service-nestjs/commit/b8b9abfe38d9aee6b543266aff5729afe223a747))

### [1.1.2](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.1.1...v1.1.2) (2023-03-09)

### [1.1.1](https://github.com/BrewInteractive/authentication-service-nestjs/compare/v1.1.0...v1.1.1) (2023-03-09)

## 1.1.0 (2023-03-09)


### Features

* **SHBD-108:** Created brew-authentication-api project. ([669fdea](https://github.com/BrewInteractive/authentication-service-nestjs/commit/669fdeaf553793003d7b8584b6950df84a9b3412))
* **SHBD-216:** Dockerized. ([8f421f7](https://github.com/BrewInteractive/authentication-service-nestjs/commit/8f421f7366166bfd925baf0bd5c30b6572bbc41e))
* **SHBD-310:** add token service and module with createToken method and addCustomClaims ([e488c05](https://github.com/BrewInteractive/authentication-service-nestjs/commit/e488c051d067c35624428b16bc36f5a9111d3533))


### Bug Fixes

* Added node_modules-path to import as a dependency. ([43e69d8](https://github.com/BrewInteractive/authentication-service-nestjs/commit/43e69d8dbb49d4fdf1f0b701740b167e7d8aa83a))
* Check for directory existence. ([4ab0f6b](https://github.com/BrewInteractive/authentication-service-nestjs/commit/4ab0f6b70058c7e2fc0f99ae74f891429eab7a32))
* Fixed authenticationService options in package.json. ([458f9b9](https://github.com/BrewInteractive/authentication-service-nestjs/commit/458f9b963adf58a01c135d80936a93ec5cfc4056))
* Fixed plugin path. ([1c23e82](https://github.com/BrewInteractive/authentication-service-nestjs/commit/1c23e822f324cd0e17894b1e8e9b6f3be389d713))
* **SHBD-310:** remove unnecessary uses for token service and fix test ([11e3d44](https://github.com/BrewInteractive/authentication-service-nestjs/commit/11e3d4406451e3036f6e6b34833ae742f8c5178a))
