## Plugin Development

While creating the plugin we need to provide the necessary parameters. Example plugin settings that we must provide in plugin's package.json as follows:

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

### Sample Plugins:

Plugins can be created in the service, for example, you can review the [Hello World Overrider Plugin](https://github.com/BrewInteractive/authentication-service-nestjs/tree/main/src/plugin/plugins/hello-world-overrider) and [Text2 Appender Plugin](https://github.com/BrewInteractive/authentication-service-nestjs/tree/main/src/plugin/plugins/text2-appender) plugins. These plugins should be located under `src/plugin/plugins`. It is possible to develop it as an npm package outside the service. You can review the [authentication-service-nestjs-sample-plugin](https://github.com/BrewInteractive/authentication-service-nestjs-sample-plugin) package.

## Publishing as Package

While publishing the package, we need to adjust the package.json file settings.

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
