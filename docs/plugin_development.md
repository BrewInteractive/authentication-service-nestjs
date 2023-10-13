# Plugin Development

Since the service is written with NestJS technology, the plugin should also be developed using NestJS.

## Plugin Requirements

While creating the plugin we need to provide the necessary parameters. Example plugin settings that we must provide in plugin's `package.json` as follows:

```json
{
	...
	"authenticationService": {
		"name": "hello-world-overrider",
		"type":"plugin",
		"displayName": "Hello World Overrider"
	},
	...
}
```

| Variable Name | Description                                                                                              |
| ------------- | -------------------------------------------------------------------------------------------------------- |
| name          | This key is the plugin name. It can be used as.                                                          |
| type          | This key contains the value "plugin" and specifies that the package is an authentication-service plugin. |
| displayName   | This key is the human readable name of the plugin.                                                       |

[@brewww/authentication-service](https://www.npmjs.com/package/@brewww/authentication-service) package needs to be added to plugin as peer dependency to reach authentication service modules, providers, controllers etc. We also define the version of authentication service that our plugin is developed for.

```json
{
	...
	"peerDependencies": {
		"@brewww/authentication-service": "^1.1.2"
	}
	...
}
```

Plugin development is based on dependency injection feature of NestJs.

## Creating Plugins

### What can be done with Plugins ?

You can customize the service with plugins. Here's what you can do:

- Customize token claims.
- Perform checks or actions before user registration. For example, if registration requires a verification key, it can be handled through a plugin.
- Perform actions after user registration. For example, you can write a plugin to send an email after the user has completed registration.
- Leave different criteria for user authentication. By default, it checks username/email and password, but you can customize this process with plugins.

### Creating Token Claims Plugin

You can create a plugin to modify the token content. By default, the generated token contains the following data:

```json
{
  "user_id": "af7c1fe6-d669-414e-b066-e9733f0de7a8",
  "first_name": "Brew",
  "last_name": "Brew",
  "email": "info@brewww.com",
  "username": "brewww",
  "roles": ["admin"]
}
```

To add additional data to these claims, you need to create a "custom claims importer." The created importer is added to the `token service` using the [`customClaimImporters`](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/src/token/concrete/user-custom-claims-importer.type.ts) property. You can perform this addition using the `addCustomClaimImporter` method. For an example, you can refer to the [`authentication-service-nestjs-hasura-plugin`](https://github.com/BrewInteractive/authentication-service-nestjs-hasura-plugin) plugin.

### Creating User Registration Plugin

You can write two different plugins for user registration:

- Actions before user registration
- Actions after user registration.

#### Pre User Registration

It is possible to perform a check or action before user registration. For this process, you need to create a [`Pre Register User Handler`](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/src/user/interfaces/pre-register-user-handler.interface.ts). The created handler is added to the `preRegisterUserHandlers` using the `addPreRegisterUserHandler` method found within the `user service`.

#### Post User Registration

It is possible to perform a check or action after user registration. For this process, you need to create a [`Post Register User Handler`](https://github.com/BrewInteractive/authentication-service-nestjs/blob/main/src/user/interfaces/post-register-user-handler.interface.ts). The created handler is added to the `postRegisterUserHandlers` using the `addPostRegisterUserHandler` method found within the `user service`.

### Creating User Validator Plugin

When a user wants to log in, by default, username/email and password checks are performed. However, it is possible to add an additional check through the plugin. You can create a `User Validator` and add it to the `userValidators` using the `addUserValidator` method found within the `user service`.

## Publishing Your Plugin as a Package

While publishing the package, we need to adjust the `package.json` file settings.

| Variable Name  | Description                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------- |
| name           | The name of the package, which includes the scope if it's published under one.                                          |
| version        | The version number of the package. The version number should be incremented every time changes are made to the package. |
| description    | A short description of what the package does.                                                                           |
| author         | The name and/or email address of the author(s) of the package.                                                          |
| license        | The license under which the package is distributed.                                                                     |
| readmeFilename | The name of the file that contains the package's readme.                                                                |
| main           | The entry point of the package. This is the file that is loaded when someone requires the package.                      |
| files          | An array of file patterns that should be included in the package when it's published.                                   |

## Sample Plugin Projects

You can refer to the following projects as examples:

- [Sample Plugin](https://github.com/BrewInteractive/authentication-service-nestjs-sample-plugin)
- [Hasura Plugin](https://github.com/BrewInteractive/authentication-service-nestjs-hasura-plugin)
- [Text2 Appender](https://github.com/BrewInteractive/authentication-service-nestjs/tree/main/src/plugin/plugins/text2-appender)
